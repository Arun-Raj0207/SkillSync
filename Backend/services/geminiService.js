const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const AI_MODEL = process.env.AI_MODEL;

function ensureConfig() {
  if (!OPENROUTER_API_KEY) {
    throw new Error('Missing OPENROUTER_API_KEY environment variable.');
  }

  if (!AI_MODEL) {
    throw new Error('Missing AI_MODEL environment variable.');
  }
}

function extractJsonFromText(text) {
  if (!text || typeof text !== 'string') {
    return { parsed: null, error: new SyntaxError('Response is not text.') };
  }

  const originalText = text;
  const trimmed = originalText.trim();

  function tryParse(candidate) {
    if (!candidate || typeof candidate !== 'string') {
      return { parsed: null, error: new SyntaxError('Candidate is not a string.') };
    }

    const candidateText = candidate.trim();
    if (!candidateText) {
      return { parsed: null, error: new SyntaxError('Candidate is empty.') };
    }

    try {
      return { parsed: JSON.parse(candidateText), error: null };
    } catch (err) {
      return { parsed: null, error: err };
    }
  }

  function stripOuterFences(value) {
    return value.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }

  const cleanedText = stripOuterFences(trimmed);

  // 1) Try direct parse of the cleaned text
  const directAttempt = tryParse(cleanedText);
  if (directAttempt.parsed !== null) {
    return directAttempt;
  }

  let lastError = directAttempt.error;
  const parsedCandidates = [];

  // 2) Extract JSON content from fenced blocks if present
  const fenceRegex = /```(?:json)?\s*([\s\S]*?)```/gi;
  let match;
  while ((match = fenceRegex.exec(originalText)) !== null) {
    const candidateAttempt = tryParse(match[1]);
    if (candidateAttempt.parsed !== null) {
      return candidateAttempt;
    }
    lastError = candidateAttempt.error || lastError;
  }

  // 3) Search for top-level JSON-like substrings by scanning braces/brackets
  const candidates = [];
  let stack = [];
  let firstOpenPos = -1;

  for (let i = 0; i < originalText.length; i++) {
    const ch = originalText[i];
    if (ch === '{' || ch === '[') {
      stack.push(ch);
      if (stack.length === 1) {
        firstOpenPos = i;
      }
    } else if (ch === '}' || ch === ']') {
      if (stack.length === 0) {
        continue;
      }
      const last = stack[stack.length - 1];
      if ((last === '{' && ch === '}') || (last === '[' && ch === ']')) {
        stack.pop();
        if (stack.length === 0 && firstOpenPos !== -1) {
          candidates.push(originalText.substring(firstOpenPos, i + 1));
          firstOpenPos = -1;
        }
      } else {
        stack = [];
        firstOpenPos = -1;
      }
    }
  }

  for (const candidate of candidates) {
    const candidateAttempt = tryParse(candidate);
    if (candidateAttempt.parsed !== null) {
      parsedCandidates.push(candidateAttempt.parsed);
    } else {
      lastError = candidateAttempt.error || lastError;
    }
  }

  if (parsedCandidates.length > 0) {
    parsedCandidates.sort((a, b) => JSON.stringify(b).length - JSON.stringify(a).length);
    return { parsed: parsedCandidates[0], error: null };
  }

  return { parsed: null, error: lastError || new SyntaxError('Could not extract valid JSON.') };
}

async function analyzeResume(resumeText) {
  const normalizedText = resumeText?.trim();

  if (!normalizedText) {
    throw new Error('Resume text is required for analysis.');
  }

  ensureConfig();

  const systemInstruction =
    'You are a placement evaluation assistant. Analyze resumes to evaluate placement readiness, score candidates, generate company matches, and produce tailored recommendations and a 4-week roadmap. Do not invent details that are not supported by the resume. Return ONLY a valid JSON object with no markdown, no code fences (```), no explanation text, and no additional characters before or after the JSON.';

  const userPrompt =
    'Analyze the following resume text and evaluate placement readiness. Extract the requested fields, score the candidate, generate company matches, produce recommendations, and create a 4-week actionable roadmap. Return only valid JSON that matches the following shape:\n' +
    JSON.stringify(
      {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
        skills: [],
        experience: [],
        education: [],
        certifications: [],
        placementScore: 0,
        resumeQuality: {
          score: 0,
          feedback: '',
        },
        technicalSkills: {
          score: 0,
          matched: [],
          missing: [],
          feedback: '',
        },
        projects: {
          score: 0,
          feedback: '',
        },
        strengths: [],
        weaknesses: [],
        recommendations: [],
        companyMatches: [
          {
            company: 'Amazon',
            difficulty: '',
            match: 0,
            matchedSkills: [],
            missingSkills: [],
          },
        ],
        roadmap: [
          {
            week: '',
            title: '',
            tasks: [],
          },
        ],
      },
      null,
      2
    ) +
    '\nUse integers for all scores. Do not invent resume information. Infer only when reasonable. Use empty strings for missing scalar fields and empty arrays for missing lists.\n' +
    'Generate exactly 10 companyMatches for the following companies in this exact set and order: Amazon, Google, Microsoft, Adobe, Atlassian, Oracle, Zoho, TCS, Infosys, Accenture. Each companyMatch object must include: company, difficulty, match, matchedSkills, missingSkills.\n' +
    'For roadmap, return exactly 4 weeks, each with week, title, and tasks.\n' +
    'CRITICAL: Return ONLY valid JSON. Do not include any markdown fences (```), explanations, or additional text. The entire response must be a single valid JSON object that can be parsed directly.\n\n' +
    normalizedText;

  try {
    const resp = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 3000,
      },
      {
       headers: {
  Authorization: `Bearer ${OPENROUTER_API_KEY}`,
  'Content-Type': 'application/json',
  'HTTP-Referer': 'http://localhost:5000',
  'X-Title': 'SkillSync',
},
        timeout: 30_000,
      }
    );

    const choices = resp?.data?.choices;
    const content =
      Array.isArray(choices) && choices.length > 0
        ? choices[0]?.message?.content || choices[0]?.message || choices[0]?.text
        : null;

    if (!content) {
      throw new Error('OpenRouter returned an empty response.');
    }

    console.info('[Resume Analysis] Raw OpenRouter response:', content);

    const { parsed, error: parseError } = extractJsonFromText(content);
    if (parsed !== null) {
      return parsed;
    }

    console.error('[Resume Analysis] JSON parse failed:', parseError?.message || 'unknown error');
    console.error('[Resume Analysis] Raw model response:', content);
    throw new Error(
      `Failed to parse OpenRouter resume analysis response. Raw response: ${JSON.stringify(
        content,
      )}`,
    );
  } catch (err) {
    if (err.isAxiosError) {
      const status = err.response?.status;
      const data = err.response?.data;
      throw new Error(
        `OpenRouter request failed${status ? ` (status ${status})` : ''}: ${
          data ? JSON.stringify(data) : err.message
        }`
      );
    }

    if (err instanceof SyntaxError) {
      throw new Error(`Failed to parse OpenRouter resume analysis response: ${err.message}`);
    }

    throw new Error(`OpenRouter resume analysis failed: ${err.message}`);
  }
}

async function callAI(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt is required and must be a string.');
  }

  ensureConfig();

  try {
    const resp = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: AI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 512,
      },
      {
        headers: {
  Authorization: `Bearer ${OPENROUTER_API_KEY}`,
  'Content-Type': 'application/json',
  'HTTP-Referer': 'http://localhost:5000',
  'X-Title': 'SkillSync',
},
        timeout: 30_000,
      }
    );

    const choices = resp?.data?.choices;
    const content =
      Array.isArray(choices) && choices.length > 0
        ? choices[0]?.message?.content || choices[0]?.message || choices[0]?.text
        : null;

    if (!content) {
      throw new Error('OpenRouter returned an empty response.');
    }

    return content;
  } catch (err) {
    if (err.isAxiosError) {
      const status = err.response?.status;
      const data = err.response?.data;
      throw new Error(
        `OpenRouter request failed${status ? ` (status ${status})` : ''}: ${
          data ? JSON.stringify(data) : err.message
        }`
      );
    }

    throw new Error(`OpenRouter API call failed: ${err.message}`);
  }
}

module.exports = {
  analyzeResume,
  callAI,
};

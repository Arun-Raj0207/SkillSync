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

async function openRouterChat(messages, temperature = 0.2, max_tokens = 512) {
  ensureConfig();

  try {
    const resp = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: AI_MODEL,
        messages,
        temperature,
        max_tokens,
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

    throw new Error(`OpenRouter request failed: ${err.message}`);
  }
}

function extractJsonFromText(text) {
  if (!text || typeof text !== 'string') {
    return { parsed: null, error: new SyntaxError('Response is not text.') };
  }

  const originalText = text;
  const trimmed = originalText.trim();

  function tryParse(candidate, depth = 0) {
    if (!candidate || typeof candidate !== 'string') {
      return { parsed: null, error: new SyntaxError('Candidate is not a string.') };
    }

    const candidateText = candidate.trim();
    if (!candidateText) {
      return { parsed: null, error: new SyntaxError('Candidate is empty.') };
    }

    try {
      const parsedValue = JSON.parse(candidateText);

      if (
        typeof parsedValue === 'string' &&
        depth < 2 &&
        parsedValue.trim() &&
        ((parsedValue.trim().startsWith('{') && parsedValue.trim().endsWith('}')) ||
          (parsedValue.trim().startsWith('[') && parsedValue.trim().endsWith(']')))
      ) {
        return tryParse(parsedValue, depth + 1);
      }

      return { parsed: parsedValue, error: null };
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
  if (directAttempt.parsed !== null && typeof directAttempt.parsed === 'object') {
    return directAttempt;
  }

  let lastError = directAttempt.error;
  const parsedCandidates = [];

  // 2) Extract JSON content from fenced blocks if present
  const fenceRegex = /```(?:json)?\s*([\s\S]*?)```/gi;
  let match;
  while ((match = fenceRegex.exec(originalText)) !== null) {
    const candidateAttempt = tryParse(match[1]);
    if (candidateAttempt.parsed !== null && typeof candidateAttempt.parsed === 'object') {
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
    if (candidateAttempt.parsed !== null && typeof candidateAttempt.parsed === 'object') {
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

  const resumeExtractionSystem =
    'You are a resume extraction assistant. Extract structured resume fields from the provided resume text and return ONLY valid JSON with no markdown, no code fences (```), no explanation text, and no additional characters before or after the JSON.';

  const resumeExtractionPrompt =
    'Extract only the following structured resume fields from the text below and return valid JSON matching this shape:\n' +
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
      },
      null,
      2
    ) +
    '\nUse empty strings for missing scalar fields and empty arrays for missing lists. Return ONLY valid JSON. Do not include any markdown fences, explanations, or additional text.\n\n' +
    normalizedText;

  const placementAnalysisSystem =
    'You are a placement evaluation assistant. Use the supplied structured resume data to generate placement readiness analysis, a score, recommendations, company matches, and a 4-week roadmap. Return ONLY valid JSON with no markdown, no code fences (```), no explanation text, and no additional characters before or after the JSON.';

  const placementAnalysisPromptPrefix =
    'Analyze the following structured resume data and generate only the requested fields. Return valid JSON matching this shape:\n' +
    JSON.stringify(
      {
        placementScore: 0,
        resumeQuality: {
          score: 0,
          feedback: '',
        },
        technicalSkills: {
          score: 0,
          feedback: '',
        },
        projects: {
          score: 0,
          feedback: '',
        },
        strengths: ['', '', ''],
        weaknesses: ['', '', ''],
        recommendations: ['', '', ''],
        companyMatches: [
          {
            company: 'Amazon',
            difficulty: '',
            match: 0,
            topMissingSkills: [],
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
    '\nUse integers for scores. Do not invent resume information. Infer only when reasonable. Use empty strings for missing scalar fields and empty arrays for missing lists.\n' +
    'Return exactly 3 strengths, exactly 3 weaknesses, and exactly 3 recommendations.\n' +
    'Return exactly 4 roadmap weeks. Each week must include only week, title, and exactly 2 short tasks.\n' +
    'Generate exactly 10 companyMatches in this order: Amazon, Google, Microsoft, Adobe, Atlassian, Oracle, Zoho, TCS, Infosys, Accenture.\n' +
    'Each companyMatch must include only company, difficulty, match, topMissingSkills (max 3 items). Do not include matchedSkills or missingSkills.\n' +
    'Limit resumeQuality.feedback, technicalSkills.feedback, and projects.feedback to one concise sentence each.\n' +
    'Use short wording, avoid extra text, and keep output compact.\n' +
    'Return ONLY valid JSON. No markdown fences, no explanations, no extra text.\n\n';

  try {
    const extractionContent = await openRouterChat(
      [
        { role: 'system', content: resumeExtractionSystem },
        { role: 'user', content: resumeExtractionPrompt },
      ],
      0.2,
      1500
    );

    console.info('[Resume Analysis] Raw resume extraction response:', extractionContent);

    const { parsed: resumeData, error: resumeParseError } = extractJsonFromText(extractionContent);
    if (resumeData === null) {
      console.error('[Resume Analysis] Resume extraction parse failed:', resumeParseError?.message || 'unknown error');
      console.error('[Resume Analysis] Raw model response:', extractionContent);
      throw new Error(
        `Failed to parse OpenRouter resume extraction response. Raw response: ${JSON.stringify(
          extractionContent,
        )}`,
      );
    }

    const placementContent = await openRouterChat(
      [
        { role: 'system', content: placementAnalysisSystem },
        {
          role: 'user',
          content:
            placementAnalysisPromptPrefix +
            'Here is the structured resume data:\n' +
            JSON.stringify(resumeData, null, 2) +
            '\n\nReturn only the requested analysis JSON.' ,
        },
      ],
      0.2,
      4000
    );

    console.info('[Resume Analysis] Raw placement analysis response:', placementContent);

    const { parsed: placementAnalysis, error: placementParseError } = extractJsonFromText(placementContent);
    if (placementAnalysis === null) {
      console.error('[Resume Analysis] Placement analysis parse failed:', placementParseError?.message || 'unknown error');
      console.error('[Resume Analysis] Raw model response:', placementContent);
      throw new Error(
        `Failed to parse OpenRouter placement analysis response. Raw response: ${JSON.stringify(
          placementContent,
        )}`,
      );
    }

    return {
      ...resumeData,
      ...placementAnalysis,
    };
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

const fs = require('fs/promises');
const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');

function cleanPdfText(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';

  // Remove invalid control characters, preserve newlines
  const cleaned = rawText.replace(/[^\S\r\n]+/g, ' ').replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ');

  const lines = cleaned
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/\s+/g, ' '))
    .filter(Boolean);

  const lineCounts = new Map();
  for (const line of lines) {
    lineCounts.set(line, (lineCounts.get(line) || 0) + 1);
  }

  const normalizedLines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const prevLine = normalizedLines[normalizedLines.length - 1];

    if (line === prevLine) {
      continue;
    }

    if (/^(page\s*\d+|\d+\s*\/\s*\d+|\d+)$/i.test(line)) {
      continue;
    }

    const count = lineCounts.get(line) ?? 0;
    if (count > 3 && line.length <= 60) {
      continue;
    }

    normalizedLines.push(line);
  }

  return normalizedLines.join('\n');
}

// async function extractFromPdf(filePath) {
//   const buffer = await fs.readFile(filePath);
//   const parser = new PDFParse({ data: buffer });

//   try {
//     const { text } = await parser.getText();
//     return cleanPdfText(text);
//   } finally {
//     await parser.destroy();
//   }
// }
async function extractFromPdf(filePath) {
  const buffer = await fs.readFile(filePath);

  console.log("========== PDF DEBUG ==========");
  console.log("Buffer Size:", buffer.length);

  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();

    console.log("RAW RESULT:");
    console.dir(result, { depth: null });

    console.log("TEXT LENGTH:", result?.text?.length);

    return cleanPdfText(result.text || "");
  } finally {
    await parser.destroy();
    console.log("========== END PDF DEBUG ==========");
  }
}
async function extractFromWord(filePath) {
  const { value } = await mammoth.extractRawText({ path: filePath });
  return value;
}

async function extractResumeText(filePath, fileType) {
  let text;

  try {
    switch (fileType) {
      case 'pdf':
        text = await extractFromPdf(filePath);
        break;
      case 'doc':
      case 'docx':
        text = await extractFromWord(filePath);
        break;
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    const label = fileType.toUpperCase();
    throw new Error(`Failed to extract text from ${label} resume: ${error.message}`);
  }

  const normalizedText = text.trim();

  if (!normalizedText) {
    throw new Error(`No readable text found in the ${fileType.toUpperCase()} resume.`);
  }

  if (fileType === 'pdf') {
    console.info('[Resume Extraction] PDF text length:', normalizedText.length);
  }

  return normalizedText;
}

module.exports = {
  extractResumeText,
};

const fs = require('fs/promises');
const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');

async function extractFromPdf(filePath) {
  const buffer = await fs.readFile(filePath);
  const parser = new PDFParse({ data: buffer });

  try {
    const { text } = await parser.getText();
    return text;
  } finally {
    await parser.destroy();
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

  return normalizedText;
}

module.exports = {
  extractResumeText,
};

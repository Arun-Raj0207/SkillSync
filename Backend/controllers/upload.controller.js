const path = require('path');
const supabase = require('../config/supabase');
const { extractResumeText } = require('../services/resumeExtraction.service');
const { analyzeResume } = require('../services/geminiService');

async function resolveStudentId(studentId, analysis) {
  if (studentId) {
    const { data: student, error } = await supabase
      .from('students')
      .select('id')
      .eq('id', studentId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to validate student: ${error.message}`);
    }

    if (!student) {
      throw new Error('Student not found for the provided studentId.');
    }

    return student.id;
  }

  const email =
    analysis.email?.trim() || `resume+${Date.now()}@skillsync.local`;
  const fullName = analysis.fullName?.trim() || 'Unknown';

  const { data: existing, error: lookupError } = await supabase
    .from('students')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (lookupError) {
    throw new Error(`Failed to look up student: ${lookupError.message}`);
  }

  if (existing) {
    return existing.id;
  }

  const { data: created, error: createError } = await supabase
    .from('students')
    .insert({
      full_name: fullName,
      email,
      phone: analysis.phone?.trim() || null,
    })
    .select('id')
    .single();

  if (createError) {
    throw new Error(`Failed to create student record: ${createError.message}`);
  }

  return created.id;
}

async function storeResumeAnalysis({
  studentId,
  fileName,
  analysis,
}) {
  const resolvedStudentId = await resolveStudentId(studentId, analysis);

  const { data, error } = await supabase
    .from('resume_analysis')
    .insert({
      student_id: resolvedStudentId,
      file_name: fileName,
      analysis_result: analysis,
      status: 'completed',
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to store resume analysis: ${error.message}`);
  }

  return data.id;
}

async function uploadResume(req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded. Use the "resume" field.',
    });
  }

  const fileType = path.extname(req.file.filename).slice(1).toLowerCase();
  const studentId = req.body?.studentId?.trim() || null;

  try {
    const text = await extractResumeText(req.file.path, fileType);
    const analysis = await analyzeResume(text);
    const analysisId = await storeResumeAnalysis({
      studentId,
      fileName: req.file.filename,
      analysis,
    });

    res.status(200).json({
      success: true,
      analysisId,
      filename: req.file.filename,
      fileType,
      text,
      analysis,
    });
  } catch (processError) {
  console.error("========== UPLOAD ERROR ==========");
  console.error(processError);
  console.error(processError.stack);
  console.error("==================================");

  const status = /Failed to (store|validate|look up|create) /.test(
    processError.message,
  )
    ? 500
    : 422;

  res.status(status).json({
    success: false,
    message: processError.message,
    stack: process.env.NODE_ENV !== "production" ? processError.stack : undefined,
  });
}
}

module.exports = {
  uploadResume,
};

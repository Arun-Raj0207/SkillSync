import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Sparkles,
  Github,
  Code2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type DragEvent, type FormEvent } from "react";
import { OnboardingFrame } from "../components/OnboardingFrame";
import { Section } from "../components/Section";
import {
  TARGET_ROLES,
  useStudent,
  type TargetRole,
  type ResumeAnalysis,
} from "../context/StudentContext";


export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze your placement — SkillSync" },
      {
        name: "description",
        content:
          "Tell us about yourself and upload your resume for a personalized placement report.",
      },
    ],
  }),
  component: AnalyzePage,
});

type Status = "idle" | "uploading" | "ready";

const ACCEPT = ".pdf,.doc,.docx";
const MAX_MB = 10;
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
const UPLOAD_ENDPOINT = `${API_BASE_URL}/upload-resume`;
const RESUME_ANALYSIS_STORAGE_KEY = "skillsync:resume-analysis";

interface UploadResponse {
  success?: boolean;
  message?: string;
  filename?: string;
  fileType?: string;
  text?: string;
  analysis?: ResumeAnalysis;
}

interface FieldErrors {
  fullName?: string;
  collegeName?: string;
  targetRole?: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function AnalyzePage() {
  const navigate = useNavigate();
  const {
    details,
    setDetails,
    upload,
    setUpload,
    clearUpload,
    analysis,
    setAnalysis,
  } = useStudent();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  const { file, status, progress } = upload;

  const validatePersonalInfo = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!details.fullName.trim()) next.fullName = "Please enter your full name";
    if (!details.collegeName.trim())
      next.collegeName = "Please enter your college name";
    if (!details.targetRole) next.targetRole = "Pick the role you're targeting";
    return next;
  };

  const startUpload = useCallback(
    (picked: File) => {
      setUpload({
        file: picked,
        status: "uploading",
        progress: 0,
      });
      setError(null);
      setAnalysis(null);

      const formData = new FormData();
      formData.append("resume", picked);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", UPLOAD_ENDPOINT);

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;

        const percent = Math.min(99, (event.loaded / event.total) * 100);
        setUpload({ progress: percent });
      };

      xhr.onload = () => {
        let data: UploadResponse = {};

        try {
          data = JSON.parse(xhr.responseText) as UploadResponse;
        } catch {
          setError("Upload failed. Please try again.");
          setUpload({ file: null, status: "idle", progress: 0 });
          setAnalysis(null);
          if (inputRef.current) inputRef.current.value = "";
          return;
        }

        if (xhr.status >= 200 && xhr.status < 300 && data.success && data.analysis) {
          setAnalysis(data.analysis);
          setUpload({ progress: 100, status: "ready" });
          return;
        }

        setError(data.message ?? "Upload failed. Please try again.");
        setUpload({ file: null, status: "idle", progress: 0 });
        setAnalysis(null);
        if (inputRef.current) inputRef.current.value = "";
      };

      xhr.onerror = () => {
        setError("Could not reach the server. Check your connection and try again.");
        setUpload({ file: null, status: "idle", progress: 0 });
        setAnalysis(null);
        if (inputRef.current) inputRef.current.value = "";
      };

      xhr.send(formData);
    },
    [setUpload],
  );

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const picked = files[0];
    const ext = "." + (picked.name.split(".").pop() ?? "").toLowerCase();
    if (!ACCEPT.split(",").includes(ext)) {
      setError("That file type isn't supported. Use PDF, DOC or DOCX.");
      return;
    }
    if (picked.size > MAX_MB * 1024 * 1024) {
      setError(`File is too large. Max ${MAX_MB}MB.`);
      return;
    }
    startUpload(picked);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!dragging) setDragging(true);
  };

  const removeFile = () => {
    clearUpload();
    setAnalysis(null);
    sessionStorage.removeItem(RESUME_ANALYSIS_STORAGE_KEY);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleAnalyze = (e: FormEvent) => {
    e.preventDefault();
    
    // Validate personal info
    const personalInfoErrors = validatePersonalInfo();
    setErrors(personalInfoErrors);
    
    if (Object.keys(personalInfoErrors).length > 0) {
      return;
    }

    if (!analysis) {
      setError("Resume analysis is not available. Please upload your resume again.");
      return;
    }

    sessionStorage.setItem(RESUME_ANALYSIS_STORAGE_KEY, JSON.stringify(analysis));
    navigate({ to: "/dashboard" });
  };

  const isFormValid = Object.keys(validatePersonalInfo()).length === 0;
  const canProceed = isFormValid && status === "ready" && analysis !== null;

  return (
    <OnboardingFrame
      navigation={{
        onBack: () => navigate({ to: "/" }),
        nextLabel: "View placement report",
        nextDisabled: !canProceed,
        nextType: "submit",
        nextForm: "analyze-form",
        nextIcon: <Sparkles size={18} />,
      }}
    >
      <Section
        eyebrow="Placement Analysis"
        title="Tell us about yourself"
        description="Enter a few details and upload your resume for a personalized placement report."
        spacing="md"
      >
        <Box sx={{ maxWidth: 760, mx: "auto", width: "100%" }}>
          <Box
            component="form"
            id="analyze-form"
            onSubmit={handleAnalyze}
            noValidate
          >
            {/* Personal Information Card */}
            <Card variant="elevated" sx={{ mb: { xs: 2.5, md: 3.5 } }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={2.5}>
                  <TextField
                    label="Full Name"
                    placeholder="e.g. Aarav Sharma"
                    value={details.fullName}
                    onChange={(e) => {
                      setDetails({ fullName: e.target.value });
                      if (errors.fullName)
                        setErrors((prev) => ({ ...prev, fullName: undefined }));
                    }}
                    error={Boolean(errors.fullName)}
                    helperText={errors.fullName ?? " "}
                    fullWidth
                    autoComplete="name"
                    required
                  />

                  <TextField
                    label="College Name"
                    placeholder="e.g. IIT Bombay"
                    value={details.collegeName}
                    onChange={(e) => {
                      setDetails({ collegeName: e.target.value });
                      if (errors.collegeName)
                        setErrors((prev) => ({
                          ...prev,
                          collegeName: undefined,
                        }));
                    }}
                    error={Boolean(errors.collegeName)}
                    helperText={errors.collegeName ?? " "}
                    fullWidth
                    autoComplete="organization"
                    required
                  />

                  <TextField
                    select
                    label="Target Role"
                    value={details.targetRole}
                    onChange={(e) => {
                      setDetails({ targetRole: e.target.value as TargetRole });
                      if (errors.targetRole)
                        setErrors((prev) => ({
                          ...prev,
                          targetRole: undefined,
                        }));
                    }}
                    error={Boolean(errors.targetRole)}
                    helperText={
                      errors.targetRole ?? "Pick the role you're preparing for."
                    }
                    fullWidth
                    required
                  >
                    {TARGET_ROLES.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </CardContent>
            </Card>

            {/* Resume Upload Card */}
            <Card variant="elevated">
              <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                {status === "idle" || status === "uploading" ? (
                  <DropZone
                    dragging={dragging}
                    status={status}
                    progress={progress}
                    file={file}
                    error={error}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={() => setDragging(false)}
                    onClick={() => inputRef.current?.click()}
                  />
                ) : (
                  <SuccessState
                    file={file!}
                    analysis={analysis}
                    onRemove={removeFile}
                    onAnalyze={() => {}}
                  />
                )}

                <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPT}
                  hidden
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </CardContent>
            </Card>

            {/* Coming Soon Cards */}
            <Box
              sx={{
                mt: { xs: 3, md: 4 },
                display: "grid",
                gap: { xs: 2, md: 2.5 },
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              }}
            >
              <ComingSoonCard
                icon={<Github size={20} />}
                title="GitHub Analysis"
                body="Score your repos, contribution patterns and project depth automatically."
              />
              <ComingSoonCard
                icon={<Code2 size={20} />}
                title="LeetCode Analysis"
                body="Pull your solved problems, tag coverage and consistency over time."
              />
            </Box>

            {/* Hidden submit button - triggered by navigation next button */}
            <button type="submit" style={{ display: "none" }} />
          </Box>
        </Box>
      </Section>
    </OnboardingFrame>
  );
}

interface DropZoneProps {
  dragging: boolean;
  status: Status;
  progress: number;
  file: File | null;
  error: string | null;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onClick: () => void;
}

function DropZone({
  dragging,
  status,
  progress,
  file,
  error,
  onDrop,
  onDragOver,
  onDragLeave,
  onClick,
}: DropZoneProps) {
  const uploading = status === "uploading";

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={uploading ? undefined : onClick}
      onKeyDown={(e) => {
        if (!uploading && (e.key === "Enter" || e.key === " ")) onClick();
      }}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      sx={{
        position: "relative",
        cursor: uploading ? "default" : "pointer",
        borderRadius: 3,
        p: { xs: 4, md: 6 },
        textAlign: "center",
        border: "1.5px dashed",
        borderColor: dragging
          ? "primary.main"
          : error
            ? "error.main"
            : "rgba(255,255,255,0.14)",
        background: dragging
          ? "rgba(37,99,235,0.08)"
          : "rgba(255,255,255,0.02)",
        transition: "all 200ms ease",
        outline: "none",
        "&:hover": uploading
          ? undefined
          : {
              borderColor: "#2563EB",
              backgroundColor: "rgba(37,99,235,0.06)",
            },
        "&:focus-visible": {
          boxShadow: "0 0 0 3px rgba(37,99,235,0.25)",
        },
      }}
    >
      <Stack spacing={2.5} alignItems="center">
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "999px",
            display: "grid",
            placeItems: "center",
            color: "primary.light",
            background:
              "linear-gradient(135deg, rgba(79,70,229,0.22), rgba(139,92,246,0.12))",
            border: "1px solid rgba(79,70,229,0.3)",
            animation: uploading
              ? "pr-bob 1.4s ease-in-out infinite"
              : "none",
            "@keyframes pr-bob": {
              "0%,100%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-4px)" },
            },
          }}
        >
          <UploadCloud size={28} />
        </Box>

        {uploading ? (
          <Stack spacing={1.5} sx={{ width: "100%", maxWidth: 420 }}>
            <Typography variant="h6">
              Uploading and analyzing {file?.name}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 999,
                bgcolor: "rgba(255,255,255,0.06)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 999,
                  background:
                    "linear-gradient(90deg, #4F46E5, #8B5CF6)",
                },
              }}
            />
            <Typography variant="body2">
              {Math.min(100, Math.round(progress))}%
            </Typography>
          </Stack>
        ) : (
          <>
            <Stack spacing={0.75} alignItems="center">
              <Typography variant="h5">
                {dragging ? "Drop it right here" : "Drag & drop your resume"}
              </Typography>
              <Typography variant="body2">
                or <Box component="span" sx={{ color: "primary.light", fontWeight: 600 }}>click to browse</Box> · PDF, DOC or DOCX up to {MAX_MB}MB
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Chip size="small" label="PDF" />
              <Chip size="small" label="DOC" />
              <Chip size="small" label="DOCX" />
            </Stack>
          </>
        )}

        {error ? (
          <Typography variant="body2" sx={{ color: "error.main" }}>
            {error}
          </Typography>
        ) : null}
      </Stack>
    </Box>
  );
}

function SuccessState({
  file,
  analysis,
  onRemove,
}: {
  file: File;
  analysis: ResumeAnalysis | null;
  onRemove: () => void;
}) {
  return (
    <Stack
      spacing={3}
      sx={{
        animation: "pr-pop 320ms cubic-bezier(0.22,1,0.36,1) both",
        "@keyframes pr-pop": {
          from: { opacity: 0, transform: "translateY(8px) scale(0.98)" },
          to: { opacity: 1, transform: "translateY(0) scale(1)" },
        },
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{
          p: 2,
          borderRadius: 3,
          border: "1px solid rgba(16,185,129,0.3)",
          background:
            "linear-gradient(135deg, rgba(16,185,129,0.10), rgba(34,211,238,0.05))",
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            color: "success.main",
            bgcolor: "rgba(16,185,129,0.12)",
            border: "1px solid rgba(16,185,129,0.3)",
            flexShrink: 0,
          }}
        >
          <CheckCircle2 size={22} />
        </Box>
        <Stack sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <FileText size={16} />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={file.name}
            >
              {file.name}
            </Typography>
          </Stack>
          <Typography variant="body2">
            Uploaded · {formatSize(file.size)}
          </Typography>
        </Stack>
        <Button
          size="small"
          variant="subtle"
          onClick={onRemove}
          startIcon={<X size={16} />}
        >
          Replace
        </Button>
      </Stack>

      {analysis ? (
        <AnalysisPreview analysis={analysis} />
      ) : (
        <Typography variant="body2" color="text.secondary">
          No analysis data is available yet. Upload your resume to see the placement report.
        </Typography>
      )}

      <Typography variant="body2">
        {analysis
          ? "Analysis complete. Continue to your placement report."
          : "Upload complete, but analysis data is missing."}
      </Typography>
    </Stack>
  );
}

function AnalysisPreview({ analysis }: { analysis: ResumeAnalysis }) {
  const topSkills = analysis.skills.slice(0, 8);
  const latestRole = analysis.experience[0];

  return (
    <Stack
      spacing={2}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid rgba(79,70,229,0.28)",
        background:
          "linear-gradient(135deg, rgba(79,70,229,0.10), rgba(139,92,246,0.05))",
      }}
    >
      <Stack spacing={0.5}>
        <Typography variant="overline" sx={{ color: "primary.light" }}>
          Analysis complete
        </Typography>
        <Typography variant="h6">
          {analysis.fullName || "Candidate"}
        </Typography>
        {analysis.summary ? (
          <Typography variant="body2" color="text.secondary">
            {analysis.summary}
          </Typography>
        ) : null}
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {topSkills.length > 0 ? (
          topSkills.map((skill) => <Chip key={skill} size="small" label={skill} />)
        ) : (
          <Typography variant="body2" color="text.secondary">
            No skills detected
          </Typography>
        )}
        {analysis.skills.length > topSkills.length ? (
          <Chip
            size="small"
            label={`+${analysis.skills.length - topSkills.length} more`}
            sx={{ bgcolor: "rgba(255,255,255,0.04)" }}
          />
        ) : null}
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ pt: 0.5 }}
      >
        <Stack spacing={0.25} sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Experience
          </Typography>
          <Typography variant="body2">
            {latestRole
              ? `${latestRole.title} at ${latestRole.company}`
              : "No experience entries found"}
          </Typography>
        </Stack>
        <Stack spacing={0.25} sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Education
          </Typography>
          <Typography variant="body2">
            {analysis.education[0]
              ? `${analysis.education[0].degree}, ${analysis.education[0].institution}`
              : "No education entries found"}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

function ComingSoonCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card
      variant="outlined"
      aria-disabled
      sx={{
        position: "relative",
        opacity: 0.7,
        cursor: "not-allowed",
        overflow: "hidden",
      }}
    >
      <Chip
        label="Coming Soon"
        size="small"
        sx={{
          position: "absolute",
          top: 14,
          right: 14,
          bgcolor: "rgba(79,70,229,0.14)",
          color: "primary.light",
          border: "1px solid rgba(79,70,229,0.35)",
        }}
      />
      <CardContent>
        <Stack spacing={1.5}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              color: "text.secondary",
              bgcolor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2">{body}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

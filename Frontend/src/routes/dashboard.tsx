import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import {
  FileText,
  Code2,
  FolderGit2,
  Brain,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Section } from "../components/Section";
import { OnboardingFrame } from "../components/OnboardingFrame";
import { useStudent, type ResumeAnalysis } from "../context/StudentContext";
import {
  CompanyMatchCard,
  type CompanyMatch,
} from "../components/CompanyMatchCard";
import { SkillGapDrawer } from "../components/SkillGapDrawer";


export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your dashboard — SkillSync" },
      {
        name: "description",
        content:
          "Your placement readiness score and a breakdown of what's working and what to fix.",
      },
    ],
  }),
  component: DashboardPage,
});

interface Metric {
  key: string;
  title: string;
  score: number;
  summary: string;
  icon: LucideIcon;
  highlights: { label: string; good: boolean }[];
}

function safelySliceStrings(items: string[] | undefined, limit: number) {
  return (items ?? []).slice(0, limit).filter(Boolean);
}

function safeCount<T>(items: T[] | undefined) {
  return (items ?? []).length;
}

function buildMetrics(
  analysis: ResumeAnalysis | null,
  details: { fullName: string; collegeName: string },
): Metric[] {
  const skills = analysis?.skills ?? [];
  const experienceCount = safeCount(analysis?.experience);
  const educationCount = safeCount(analysis?.education);
  const certificationCount = safeCount(analysis?.certifications);
  const summaryText = analysis?.summary?.trim() || "Upload your resume to see this analysis.";

  const resumeScore = Math.min(
    100,
    Math.round(
      (Math.min(skills.length, 8) * 8) +
      (Math.min(experienceCount, 4) * 6) +
      (Math.min(educationCount, 2) * 6) +
      (analysis?.summary?.trim() ? 20 : 0),
    ),
  );

  const technicalScore = Math.min(100, Math.round(skills.length * 10));
  const projectsScore = Math.min(100, Math.round(experienceCount * 20));

  const dsaKeywords = [
    "algorithm",
    "data structure",
    "leetcode",
    "dynamic programming",
    "graph",
    "tree",
    "problem solving",
  ];
  const dsaMatches = skills.filter((skill) =>
    dsaKeywords.some((keyword) => skill.toLowerCase().includes(keyword)),
  );
  const dsaScore = Math.min(100, Math.round(dsaMatches.length * 20));

  const commsScore = analysis?.summary?.trim() ? 75 : 40;

  const skillSummary = skills.length
    ? `Detected skills: ${safelySliceStrings(skills, 5).join(", ")}`
    : "No technical skills were extracted.";
  const projectSummary = experienceCount
    ? `${experienceCount} experience entr${experienceCount === 1 ? "y" : "ies"} found.`
    : "No experience entries were detected.";
  const commsSummary = analysis?.summary?.trim()
    ? analysis.summary
    : "No summary is present in the resume.";

  return [
    {
      key: "resume",
      title: "Resume Quality",
      score: resumeScore,
      summary: summaryText,
      icon: FileText,
      highlights: [
        { label: `${safeCount(analysis?.education)} education entries`, good: !!analysis?.education?.length },
        { label: `${experienceCount} experience entries`, good: experienceCount > 0 },
        { label: `${skills.length} skill${skills.length === 1 ? "" : "s"} extracted`, good: skills.length > 0 },
      ],
    },
    {
      key: "technical",
      title: "Technical Skills",
      score: technicalScore,
      summary: skillSummary,
      icon: Code2,
      highlights: [
        { label: skills.length > 0 ? "Skills extracted from resume" : "No skills found", good: skills.length > 0 },
        { label: `${certificationCount} certifications noted`, good: certificationCount > 0 },
        { label: analysis?.location ? `Location parsed: ${analysis.location}` : "Location not parsed", good: !!analysis?.location },
      ],
    },
    {
      key: "projects",
      title: "Projects",
      score: projectsScore,
      summary: projectSummary,
      icon: FolderGit2,
      highlights: [
        { label: experienceCount > 0 ? "Experience section present" : "No experience section", good: experienceCount > 0 },
        { label: `${educationCount} education entries`, good: educationCount > 0 },
        { label: certificationCount > 0 ? "Certifications listed" : "No certifications listed", good: certificationCount > 0 },
      ],
    },
    {
      key: "dsa",
      title: "Problem Solving",
      score: dsaScore,
      summary:
        dsaMatches.length > 0
          ? `Found ${dsaMatches.length} skill${dsaMatches.length === 1 ? "" : "s"} related to problem solving.`
          : "No explicit problem-solving skills were detected.",
      icon: Brain,
      highlights: [
        { label: dsaMatches.length > 0 ? "Problem-solving skills detected" : "No DSA-related skills", good: dsaMatches.length > 0 },
        { label: skills.length > 0 ? "Technical skills available" : "Technical skills missing", good: skills.length > 0 },
        { label: analysis?.experience?.length > 0 ? "Experience details available" : "Experience details missing", good: analysis?.experience?.length > 0 },
      ],
    },
    {
      key: "comms",
      title: "Communication",
      score: commsScore,
      summary: commsSummary,
      icon: MessageSquare,
      highlights: [
        { label: analysis?.summary?.trim() ? "Summary present" : "Summary missing", good: !!analysis?.summary?.trim() },
        { label: details.fullName.trim() ? "Name is listed" : "Name missing", good: !!details.fullName.trim() },
        { label: details.collegeName.trim() ? "College is listed" : "College missing", good: !!details.collegeName.trim() },
      ],
    },
  ];
}

function overall(metrics: Metric[]) {
  const weights: Record<string, number> = {
    resume: 0.15,
    technical: 0.3,
    projects: 0.2,
    dsa: 0.25,
    comms: 0.1,
  };
  const sum = metrics.reduce((acc, m) => acc + m.score * (weights[m.key] ?? 0.2), 0);
  return Math.round(sum);
}

function scoreTone(score: number) {
  if (score >= 80) return { label: "Strong", color: "#10B981" };
  if (score >= 65) return { label: "On track", color: "#8B5CF6" };
  if (score >= 50) return { label: "Improving", color: "#F59E0B" };
  return { label: "Needs work", color: "#EF4444" };
}

function DashboardPage() {
  const navigate = useNavigate();
  const { details, analysis } = useStudent();
  const name = analysis?.fullName?.trim() || details.fullName.trim() || "Student";
  const role = details.targetRole || "Software Engineer";
  const metrics = buildMetrics(analysis, details);
  const score = overall(metrics);
  const tone = scoreTone(score);
  const [selected, setSelected] = useState<CompanyMatch | null>(null);
  const companies = analysis?.companyMatches ?? [];

  return (
    <OnboardingFrame
      navigation={{
        onBack: () => navigate({ to: "/analyze" }),
        onNext: () => navigate({ to: "/roadmap" }),
        nextLabel: "View my roadmap",
      }}
    >
      <Section spacing="sm">
      <HeaderCard name={name} role={role} score={score} tone={tone} />

      <Box
        sx={{
          mt: { xs: 3, md: 4 },
          display: "grid",
          gap: { xs: 2, md: 2.5 },
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
        }}
      >
        {metrics.map((m, i) => (
          <MetricCard key={m.key} metric={m} index={i} />
        ))}
      </Box>

      <Box sx={{ mt: { xs: 5, md: 8 } }}>
        <Stack spacing={1} sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography variant="overline" sx={{ color: "primary.light" }}>
            Company Match
          </Typography>
          <Typography variant="h4">Where you stand right now</Typography>
          <Typography variant="body1" color="text.secondary">
            Live fit scores against your target role at each company, with the
            skills you already have and the ones to close next.
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gap: { xs: 2, md: 2.5 },
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
              xl: "repeat(4, 1fr)",
            },
          }}
        >
          {companies.length > 0 ? (
            companies.map((c, i) => (
              <CompanyMatchCard
                key={c.name}
                company={c}
                index={i}
                onViewGap={(co) => setSelected(co)}
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ gridColumn: "1 / -1" }}>
              No company matches are available yet. Upload your resume and return to see target matches.
            </Typography>
          )}
        </Box>
      </Box>

      <SkillGapDrawer
        company={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </Section>
    </OnboardingFrame>
  );
}


function HeaderCard({
  name,
  role,
  score,
  tone,
}: {
  name: string;
  role: string;
  score: number;
  tone: { label: string; color: string };
}) {
  return (
    <Card
      variant="gradient"
      sx={{
        p: { xs: 2.5, md: 3.5 },
        animation: "pr-rise 500ms ease both",
        "@keyframes pr-rise": {
          from: { opacity: 0, transform: "translateY(12px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 3, md: 4 }}
        alignItems={{ md: "center" }}
        justifyContent="space-between"
      >
        <Stack spacing={1.25} sx={{ minWidth: 0 }}>
          <Chip
            label="Placement Report"
            size="small"
            sx={{
              alignSelf: "flex-start",
              bgcolor: "rgba(37,99,235,0.12)",
              color: "#2563EB",
              border: "1px solid rgba(37,99,235,0.25)",
            }}
          />
          <Typography variant="h3" sx={{ wordBreak: "break-word" }}>
            {name}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Typography variant="body1" color="text.secondary">
              Targeting
            </Typography>
            <Chip
              label={role}
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            />
          </Stack>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ pt: 1.5 }}
            flexWrap="wrap"
            useFlexGap
          >
            <Button
              component={Link}
              to="/roadmap"
              variant="hero"
              endIcon={<ArrowRight size={18} />}
            >
              View my roadmap
            </Button>
            <Button component={Link} to="/analyze" variant="subtle">
              Re-analyze resume
            </Button>
          </Stack>
        </Stack>

        <ScoreRing score={score} tone={tone} />
      </Stack>
    </Card>
  );
}

function ScoreRing({
  score,
  tone,
}: {
  score: number;
  tone: { label: string; color: string };
}) {
  const angle = Math.round((score / 100) * 360);
  return (
    <Stack alignItems="center" spacing={1.5} sx={{ flexShrink: 0 }}>
      <Typography variant="overline" color="text.secondary">
        Placement Readiness
      </Typography>
      <Box
        sx={{
          width: { xs: 180, md: 200 },
          aspectRatio: "1 / 1",
          borderRadius: "999px",
          background: `conic-gradient(${tone.color} 0deg, #8B5CF6 ${angle}deg, rgba(255,255,255,0.06) ${angle}deg 360deg)`,
          display: "grid",
          placeItems: "center",
          position: "relative",
          boxShadow: `0 20px 60px -20px ${tone.color}55`,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 12,
            borderRadius: "999px",
            bgcolor: "background.paper",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Stack alignItems="center" spacing={0.25}>
            <Typography
              sx={{
                fontSize: { xs: "2.75rem", md: "3rem" },
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                background:
                  "linear-gradient(135deg, #4F46E5, #8B5CF6 60%, #22D3EE)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {score}
            </Typography>
            <Typography variant="body2">out of 100</Typography>
          </Stack>
        </Box>
      </Box>
      <Stack direction="row" spacing={0.75} alignItems="center">
        <TrendingUp size={14} color={tone.color} />
        <Typography
          variant="body2"
          sx={{ color: tone.color, fontWeight: 600 }}
        >
          {tone.label}
        </Typography>
      </Stack>
    </Stack>
  );
}

function MetricCard({ metric, index }: { metric: Metric; index: number }) {
  const Icon = metric.icon;
  const tone = scoreTone(metric.score);
  return (
    <Card
      variant="interactive"
      sx={{
        opacity: 0,
        animation: "pr-card-in 500ms ease both",
        animationDelay: `${120 + index * 90}ms`,
        "@keyframes pr-card-in": {
          from: { opacity: 0, transform: "translateY(14px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  color: "#2563EB",
                  backgroundColor: "rgba(37,99,235,0.12)",
                  border: "1px solid rgba(37,99,235,0.25)",
                }}
              >
                <Icon size={20} />
              </Box>
              <Typography variant="h6">{metric.title}</Typography>
            </Stack>
            <Chip
              label={tone.label}
              size="small"
              sx={{
                color: tone.color,
                bgcolor: `${tone.color}1A`,
                border: `1px solid ${tone.color}55`,
                fontWeight: 600,
              }}
            />
          </Stack>

          <Stack spacing={1}>
            <Stack
              direction="row"
              alignItems="baseline"
              justifyContent="space-between"
            >
              <Typography
                sx={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {metric.score}
                <Box
                  component="span"
                  sx={{
                    fontSize: "0.95rem",
                    color: "text.secondary",
                    fontWeight: 500,
                    ml: 0.5,
                  }}
                >
                  /100
                </Box>
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={metric.score}
              sx={{
                height: 6,
                borderRadius: 999,
                bgcolor: "rgba(255,255,255,0.06)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${tone.color}, #8B5CF6)`,
                },
              }}
            />
          </Stack>

          <Typography variant="body2">{metric.summary}</Typography>

          <Stack spacing={0.75} sx={{ pt: 0.5 }}>
            {metric.highlights.map((h) => (
              <Stack
                key={h.label}
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "999px",
                    bgcolor: h.good ? "success.main" : "warning.main",
                    flexShrink: 0,
                  }}
                />
                <Typography variant="body2" sx={{ color: "text.primary" }}>
                  {h.label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

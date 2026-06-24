import {
  Box,
  Chip,
  Drawer,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowUpRight, BookOpen, Sparkles, Target, X } from "lucide-react";
import type { CompanyMatch } from "./CompanyMatchCard";

interface CompanyExtras {
  pattern: string[];
  recommended: { skill: string; reason: string }[];
}

const EXTRAS: Record<string, CompanyExtras> = {
  Amazon: {
    pattern: ["2 Online DSA rounds", "LLD / OOP design", "Bar Raiser (LP-heavy)", "Hiring Manager"],
    recommended: [
      { skill: "Leadership Principles (STAR)", reason: "Every round is LP-anchored." },
      { skill: "Low-Level Design (Parking Lot, Splitwise)", reason: "Standard LLD round." },
      { skill: "AWS core services depth", reason: "Expected for SDE-1 at AWS orgs." },
    ],
  },
  Google: {
    pattern: ["2 DSA rounds", "Coding + Design", "Googleyness & Leadership"],
    recommended: [
      { skill: "Dynamic Programming patterns", reason: "Frequent in onsite rounds." },
      { skill: "Distributed Systems basics", reason: "Asked in SWE-II design round." },
      { skill: "Big-O tradeoff reasoning", reason: "Interviewers probe complexity deeply." },
    ],
  },
  Microsoft: {
    pattern: ["Online Assessment", "2 DSA rounds", "LLD round", "AS Appropriate Behavioral"],
    recommended: [
      { skill: "Low-Level Design (UML + code)", reason: "Dedicated LLD round at SE level." },
      { skill: "Behavioral stories (STAR)", reason: "AS Appropriate round weighs heavily." },
      { skill: "Azure fundamentals", reason: "Bonus signal for cloud-adjacent teams." },
    ],
  },
  TCS: {
    pattern: ["TCS NQT (Aptitude + Coding)", "Technical Interview", "Managerial + HR"],
    recommended: [
      { skill: "TCS NQT prep (verbal + quant)", reason: "Cutoff-driven first filter." },
      { skill: "DBMS + SQL basics", reason: "Always asked in technical round." },
      { skill: "Project explanation (clear English)", reason: "Managerial round focus." },
    ],
  },
  Infosys: {
    pattern: ["InfyTQ / HackWithInfy", "Technical Interview", "HR Interview"],
    recommended: [
      { skill: "Java + Spring basics", reason: "Default tech stack for SE role." },
      { skill: "Pseudocode + puzzles", reason: "Common in technical round." },
      { skill: "HR-fit answers (relocation, bond)", reason: "HR round is filter-only but strict." },
    ],
  },
  Accenture: {
    pattern: ["Cognitive + Technical Assessment", "Coding Round", "Communication Round", "HR"],
    recommended: [
      { skill: "Spoken English fluency", reason: "Dedicated communication round." },
      { skill: "Cloud + DevOps basics", reason: "Aligns with current ASE intake." },
      { skill: "2 medium DSA problems / day", reason: "Coding round is the real gate." },
    ],
  },
  Zoho: {
    pattern: ["Written Round", "Advanced Programming", "Design Round", "HR"],
    recommended: [
      { skill: "Advanced DSA (multi-step problems)", reason: "Round 3 is notoriously hard." },
      { skill: "OOP design on paper", reason: "Design round expects clean class diagrams." },
      { skill: "C / C++ fundamentals", reason: "Preferred language for Zoho rounds." },
    ],
  },
  IBM: {
    pattern: ["Cognitive Ability", "Coding Assessment", "Technical Interview", "HR"],
    recommended: [
      { skill: "Hybrid Cloud + Red Hat basics", reason: "Strong signal for IBM stack." },
      { skill: "Python + SQL fluency", reason: "Default for Associate SE role." },
      { skill: "Watson / AI services overview", reason: "Bonus in technical round." },
    ],
  },
};

const DIFFICULTY_TONE: Record<
  CompanyMatch["difficulty"],
  { color: string; bg: string }
> = {
  Easy: { color: "#10B981", bg: "rgba(16,185,129,0.12)" },
  Moderate: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  Hard: { color: "#F87171", bg: "rgba(248,113,113,0.12)" },
  Elite: { color: "#22D3EE", bg: "rgba(34,211,238,0.14)" },
};

function matchColor(match: number) {
  if (match >= 85) return "#10B981";
  if (match >= 70) return "#8B5CF6";
  if (match >= 55) return "#F59E0B";
  return "#EF4444";
}

export function SkillGapDrawer({
  company,
  open,
  onClose,
}: {
  company: CompanyMatch | null;
  open: boolean;
  onClose: () => void;
}) {
  const extras = company ? EXTRAS[company.name] : undefined;
  const tone = company ? DIFFICULTY_TONE[company.difficulty] : null;
  const color = company ? matchColor(company.match) : "#8B5CF6";

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      transitionDuration={320}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 460, md: 520 },
          bgcolor: "background.default",
          backgroundImage: "none",
          borderLeft: "1px solid #30363D",
        },
      }}
    >
      {company && tone && (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              px: { xs: 2.5, md: 3 },
              py: 2,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Target size={18} color={color} />
              <Typography variant="overline" sx={{ color: "primary.light" }}>
                Skill Gap Report
              </Typography>
            </Stack>
            <IconButton onClick={onClose} size="small" aria-label="Close skill gap drawer">
              <X size={18} />
            </IconButton>
          </Stack>

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              px: { xs: 2.5, md: 3 },
              py: { xs: 2.5, md: 3 },
            }}
          >
            <Stack spacing={3.5}>
              <Stack spacing={1.25}>
                <Typography variant="h4" sx={{ letterSpacing: "-0.02em" }}>
                  {company.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {company.tagline}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ pt: 0.5 }} flexWrap="wrap" useFlexGap>
                  <Chip
                    label={`${company.difficulty} difficulty`}
                    size="small"
                    sx={{
                      color: tone.color,
                      bgcolor: tone.bg,
                      border: `1px solid ${tone.color}55`,
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    label={`${company.match}% match`}
                    size="small"
                    sx={{
                      color,
                      bgcolor: `${color}1A`,
                      border: `1px solid ${color}55`,
                      fontWeight: 600,
                    }}
                  />
                </Stack>
              </Stack>

              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                  <Typography variant="overline" color="text.secondary">
                    Match Strength
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      color,
                    }}
                  >
                    {company.match}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={company.match}
                  sx={{
                    height: 8,
                    borderRadius: 999,
                    bgcolor: "rgba(255,255,255,0.06)",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 999,
                      background: `linear-gradient(90deg, ${color}, #8B5CF6)`,
                    },
                  }}
                />
              </Stack>

              {extras && (
                <Section title="Interview Pattern" icon={<BookOpen size={14} />}>
                  <Stack spacing={1}>
                    {extras.pattern.map((step, i) => (
                      <Stack
                        key={step}
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{
                          p: 1.25,
                          borderRadius: 2,
                          bgcolor: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "999px",
                            display: "grid",
                            placeItems: "center",
                            backgroundColor: "rgba(37,99,235,0.18)",
                            color: "#2563EB",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {i + 1}
                        </Box>
                        <Typography variant="body2">{step}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Section>
              )}

              <Section title="Matched Skills" icon={<Sparkles size={14} />}>
                <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                  {company.matched.map((s) => (
                    <Chip
                      key={s}
                      label={s}
                      size="small"
                      sx={{
                        bgcolor: "rgba(16,185,129,0.12)",
                        color: "#10B981",
                        border: "1px solid rgba(16,185,129,0.4)",
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Stack>
              </Section>

              <Section title="Missing Skills" icon={<Target size={14} />}>
                <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                  {company.missing.map((s) => (
                    <Chip
                      key={s}
                      label={s}
                      size="small"
                      sx={{
                        bgcolor: "rgba(239,68,68,0.12)",
                        color: "#F87171",
                        border: "1px solid rgba(239,68,68,0.4)",
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Stack>
              </Section>

              {extras && (
                <Section title="Recommended to Learn" icon={<ArrowUpRight size={14} />}>
                  <Stack spacing={1.25}>
                    {extras.recommended.map((r) => (
                      <Box
                        key={r.skill}
                        sx={{
                          p: 1.75,
                          borderRadius: 2,
                          bgcolor: "rgba(139,92,246,0.06)",
                          border: "1px solid rgba(139,92,246,0.25)",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ color: "primary.light", mb: 0.5 }}
                        >
                          {r.skill}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {r.reason}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Section>
              )}
            </Stack>
          </Box>
        </Box>
      )}
    </Drawer>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Stack spacing={1.25}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Box sx={{ color: "primary.light", display: "flex" }}>{icon}</Box>
        <Typography variant="overline" color="text.secondary">
          {title}
        </Typography>
      </Stack>
      {children}
    </Stack>
  );
}

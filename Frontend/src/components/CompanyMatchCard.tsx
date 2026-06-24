import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { ArrowRight, Building2 } from "lucide-react";

export interface CompanyMatch {
  company: string;
  name?: string;
  reason?: string;
  match?: number;
  difficulty?: "Easy" | "Moderate" | "Hard" | "Elite";
  matchedSkills?: string[];
  missingSkills?: string[];
  matched?: string[];
  missing?: string[];
  tagline?: string;
}

const DIFFICULTY_TONE: Record<
  NonNullable<CompanyMatch["difficulty"]>,
  { color: string; bg: string }
>= {
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

export function CompanyMatchCard({
  company,
  index,
  onViewGap,
}: {
  company: CompanyMatch;
  index: number;
  onViewGap?: (c: CompanyMatch) => void;
}) {
  const defaultDifficulty: CompanyMatch['difficulty'] = 'Moderate';
  const displayName = company.company ?? company.name ?? 'Company';
  const matchScore = typeof company.match === 'number' ? company.match : 0;
  const matchedSkills = Array.isArray(company.matchedSkills)
    ? company.matchedSkills
    : Array.isArray(company.matched)
    ? company.matched
    : [];
  const missingSkills = Array.isArray(company.missingSkills)
    ? company.missingSkills
    : Array.isArray(company.missing)
    ? company.missing
    : [];
  const tagline = company.tagline ?? '';
  const difficulty =
    typeof company.difficulty === 'string' && company.difficulty in DIFFICULTY_TONE
      ? company.difficulty
      : defaultDifficulty;
  const tone = DIFFICULTY_TONE[difficulty];
  return (
    <Card
      variant="interactive"
      sx={{
        opacity: 0,
        animation: "pr-card-in 500ms ease both",
        animationDelay: `${index * 70}ms`,
        "@keyframes pr-card-in": {
          from: { opacity: 0, transform: "translateY(14px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <CardContent>
        <Stack spacing={2.5}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
              <CompanyMark name={displayName} />
              <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {displayName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {tagline}
                </Typography>
              </Stack>
            </Stack>
            <Chip
              label={difficulty}
              size="small"
              sx={{
                color: tone.color,
                bgcolor: tone.bg,
                border: `1px solid ${tone.color}55`,
                fontWeight: 600,
                flexShrink: 0,
              }}
            />
          </Stack>

          <Stack direction="row" spacing={2.5} alignItems="center">
            <DonutChart value={matchScore} color={matchColor(matchScore)} />
            <Stack spacing={0.5} sx={{ minWidth: 0 }}>
              <Typography variant="overline" color="text.secondary">
                Match
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  color: matchColor(matchScore),
                }}
              >
                {matchScore}%
              </Typography>
              <Typography variant="body2">
                {matchScore >= 80
                  ? "Strong fit — apply with confidence."
                  : matchScore >= 65
                    ? "Workable fit — close a few gaps first."
                    : "Stretch fit — build the missing skills."}
              </Typography>
            </Stack>
          </Stack>

          <SkillBlock title="Matched skills" tone="good" items={matchedSkills} />
          <SkillBlock title="Missing skills" tone="bad" items={missingSkills} />

          <Button
            fullWidth
            variant="subtle"
            endIcon={<ArrowRight size={16} />}
            onClick={() => onViewGap?.(company)}
          >
            View Skill Gap
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function CompanyMark({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: 2,
        display: "grid",
        placeItems: "center",
        color: "#2563EB",
        backgroundColor: "rgba(37,99,235,0.12)",
        border: "1px solid rgba(37,99,235,0.25)",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <Box sx={{ position: "absolute", opacity: 0.35 }}>
        <Building2 size={28} />
      </Box>
      <Typography
        sx={{
          fontSize: "0.875rem",
          fontWeight: 700,
          letterSpacing: "0.02em",
          position: "relative",
          color: "primary.light",
        }}
      >
        {initials}
      </Typography>
    </Box>
  );
}

function DonutChart({ value, color }: { value: number; color: string }) {
  const size = 92;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (Math.min(100, Math.max(0, value)) / 100) * c;

  return (
    <Box
      sx={{
        width: size,
        height: size,
        position: "relative",
        flexShrink: 0,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={`donut-${value}-${color.replace("#", "")}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#donut-${value}-${color.replace("#", "")})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: "stroke-dasharray 600ms ease",
          }}
        />
      </svg>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
            letterSpacing: "-0.02em",
          }}
        >
          {value}%
        </Typography>
      </Box>
    </Box>
  );
}

function SkillBlock({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "good" | "bad";
  items: string[];
}) {
  const isGood = tone === "good";
  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "999px",
            bgcolor: isGood ? "success.main" : "warning.main",
          }}
        />
        <Typography variant="overline" color="text.secondary">
          {title}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
        {(items ?? []).map((s) => (
          <Chip
            key={s}
            label={s}
            size="small"
            sx={{
              bgcolor: isGood ? "rgba(16,185,129,0.10)" : "rgba(245,158,11,0.10)",
              color: isGood ? "#10B981" : "#F59E0B",
              border: `1px solid ${isGood ? "rgba(16,185,129,0.35)" : "rgba(245,158,11,0.35)"}`,
              fontWeight: 500,
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
}

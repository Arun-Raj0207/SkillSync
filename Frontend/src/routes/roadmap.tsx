import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  LinearProgress,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import {
  BookOpen,
  Check,
  Download,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Section } from "../components/Section";
import { StepNavigation } from "../components/StepNavigation";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Your roadmap — SkillSync" },
      {
        name: "description",
        content:
          "A four-week personalized learning roadmap with weekly tasks and free resources to close your placement skill gaps.",
      },
    ],
  }),
  component: RoadmapPage,
});

interface WeekPlan {
  id: string;
  title: string;
  focus: string;
  tasks: string[];
  resource: { label: string; provider: string; url: string };
}

const WEEKS: WeekPlan[] = [
  {
    id: "w1",
    title: "Week 1 · DSA Foundations",
    focus: "Lock down arrays, strings, hashing and two-pointer patterns.",
    tasks: [
      "Solve 12 Easy + 8 Medium problems on arrays & strings",
      "Master sliding window and two-pointer templates",
      "Revise Big-O for every solution and write notes",
    ],
    resource: {
      label: "Striver's A2Z DSA Sheet",
      provider: "takeUforward · Free",
      url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/",
    },
  },
  {
    id: "w2",
    title: "Week 2 · Core CS & SQL",
    focus: "Strengthen OS, DBMS and SQL — interviewer favourites.",
    tasks: [
      "Cover OS scheduling, deadlocks and memory mgmt",
      "Practice 25 SQL queries on LeetCode (Easy → Medium)",
      "Build an ER diagram for one of your projects",
    ],
    resource: {
      label: "Gate Smashers — OS & DBMS",
      provider: "YouTube · Free",
      url: "https://www.youtube.com/@GateSmashers",
    },
  },
  {
    id: "w3",
    title: "Week 3 · Projects & LLD",
    focus: "Ship one polished project and learn a real LLD pattern.",
    tasks: [
      "Refactor your best project — README, tests, deploy",
      "Design Splitwise or Parking Lot with classes + UML",
      "Write 3 STAR stories about your project work",
    ],
    resource: {
      label: "Low-Level Design Primer",
      provider: "GitHub · prasadgujar · Free",
      url: "https://github.com/prasadgujar/low-level-design-primer",
    },
  },
  {
    id: "w4",
    title: "Week 4 · Mock Interviews",
    focus: "Simulate the real thing — DSA, HR and behavioural.",
    tasks: [
      "Do 4 timed DSA mocks (45 min each)",
      "Record 2 HR mocks, review tone and pacing",
      "Apply to 10 target companies with tailored resume",
    ],
    resource: {
      label: "Pramp — Free peer mock interviews",
      provider: "Pramp · Free",
      url: "https://www.pramp.com/",
    },
  },
];

function RoadmapPage() {
  const navigate = useNavigate();
  const [done, setDone] = useState<Record<string, boolean>>({});
  const completed = useMemo(
    () => WEEKS.filter((w) => done[w.id]).length,
    [done],
  );
  const pct = Math.round((completed / WEEKS.length) * 100);

  return (
    <>
      <Section spacing="sm">
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 2.5, md: 3 }}
        alignItems={{ md: "flex-end" }}
        justifyContent="space-between"
        sx={{ mb: { xs: 3, md: 4 } }}
      >
        <Stack spacing={1.25} sx={{ maxWidth: 720 }}>
          <Chip
            label="4-Week Plan"
            size="small"
            sx={{
              alignSelf: "flex-start",
              bgcolor: "rgba(79,70,229,0.14)",
              color: "primary.light",
              border: "1px solid rgba(79,70,229,0.35)",
            }}
          />
          <Typography variant="h3">
            Your Personalized Learning Roadmap
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Built from your resume gaps and target role. Check tasks off as you
            go — your readiness score updates with you.
          </Typography>
        </Stack>

        <Button
          variant="subtle"
          startIcon={<Download size={16} />}
          disabled
          sx={{ alignSelf: { xs: "stretch", md: "flex-end" } }}
        >
          Download PDF
        </Button>
      </Stack>

      <Card
        variant="gradient"
        sx={{
          p: { xs: 2.5, md: 3 },
          mb: { xs: 4, md: 5 },
        }}
      >
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="baseline"
            flexWrap="wrap"
            useFlexGap
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Sparkles size={16} color="#8B5CF6" />
              <Typography variant="overline" sx={{ color: "primary.light" }}>
                Overall progress
              </Typography>
            </Stack>
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                background:
                  "linear-gradient(135deg, #4F46E5, #8B5CF6 60%, #22D3EE)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {pct}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={pct}
            sx={{
              height: 10,
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.06)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                background:
                  "linear-gradient(90deg, #4F46E5, #8B5CF6 60%, #22D3EE)",
              },
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {completed} of {WEEKS.length} weeks completed
          </Typography>
        </Stack>
      </Card>

      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            left: { xs: 14, md: 22 },
            top: 8,
            bottom: 8,
            width: 2,
            background:
              "linear-gradient(180deg, rgba(79,70,229,0.6), rgba(34,211,238,0.2))",
            borderRadius: 999,
          }}
        />
        <Stack spacing={{ xs: 2.5, md: 3 }}>
          {WEEKS.map((w, i) => (
            <WeekCard
              key={w.id}
              week={w}
              index={i}
              done={!!done[w.id]}
              onToggle={() =>
                setDone((p) => ({ ...p, [w.id]: !p[w.id] }))
              }
            />
          ))}
        </Stack>
      </Box>
    </Section>

      <StepNavigation
        onBack={() => navigate({ to: "/dashboard" })}
        backLabel="Back to report"
        hideNext
      />
    </>
  );
}

function WeekCard({
  week,
  index,
  done,
  onToggle,
}: {
  week: WeekPlan;
  index: number;
  done: boolean;
  onToggle: () => void;
}) {
  return (
    <Box
      sx={{
        position: "relative",
        pl: { xs: 5, md: 7 },
        opacity: 0,
        animation: "pr-card-in 500ms ease both",
        animationDelay: `${index * 90}ms`,
        "@keyframes pr-card-in": {
          from: { opacity: 0, transform: "translateY(14px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: { xs: 0, md: 8 },
          top: 18,
          width: { xs: 30, md: 30 },
          height: { xs: 30, md: 30 },
          borderRadius: "999px",
          display: "grid",
          placeItems: "center",
          background: done
            ? "linear-gradient(135deg, #10B981, #22D3EE)"
            : "linear-gradient(135deg, #4F46E5, #8B5CF6)",
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.85rem",
          boxShadow: done
            ? "0 8px 24px -8px rgba(16,185,129,0.55)"
            : "0 8px 24px -8px rgba(79,70,229,0.55)",
          border: "3px solid",
          borderColor: "background.default",
          zIndex: 1,
        }}
      >
        {done ? <Check size={16} /> : index + 1}
      </Box>

      <Card variant="interactive">
        <CardContent>
          <Stack spacing={2.25}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ sm: "flex-start" }}
              justifyContent="space-between"
            >
              <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                <Typography variant="h6">{week.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {week.focus}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 999,
                  bgcolor: done
                    ? "rgba(16,185,129,0.12)"
                    : "rgba(255,255,255,0.04)",
                  border: `1px solid ${
                    done ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)"
                  }`,
                  alignSelf: { xs: "flex-start", sm: "auto" },
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                onClick={onToggle}
              >
                <Checkbox
                  checked={done}
                  onChange={onToggle}
                  size="small"
                  sx={{ p: 0.25 }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: done ? "#10B981" : "text.secondary",
                  }}
                >
                  {done ? "Completed" : "Mark complete"}
                </Typography>
              </Stack>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="overline" color="text.secondary">
                Learning Tasks
              </Typography>
              {week.tasks.map((t) => (
                <Stack
                  key={t}
                  direction="row"
                  spacing={1.25}
                  alignItems="flex-start"
                  sx={{
                    p: 1.25,
                    borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: "6px",
                      mt: "2px",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: done
                        ? "rgba(16,185,129,0.18)"
                        : "rgba(79,70,229,0.18)",
                      color: done ? "#10B981" : "primary.light",
                      flexShrink: 0,
                    }}
                  >
                    <Check size={12} />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.primary",
                      textDecoration: done ? "line-through" : "none",
                      opacity: done ? 0.7 : 1,
                    }}
                  >
                    {t}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <MuiLink
              href={week.resource.url}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                borderRadius: 2,
                background:
                  "linear-gradient(135deg, rgba(79,70,229,0.10), rgba(34,211,238,0.06))",
                border: "1px solid rgba(79,70,229,0.3)",
                transition: "transform 150ms ease, border-color 150ms ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  borderColor: "rgba(139,92,246,0.55)",
                },
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "rgba(79,70,229,0.22)",
                  color: "primary.light",
                  flexShrink: 0,
                }}
              >
                <BookOpen size={16} />
              </Box>
              <Stack sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "text.primary",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {week.resource.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {week.resource.provider}
                </Typography>
              </Stack>
              <ExternalLink size={16} color="#8B5CF6" />
            </MuiLink>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

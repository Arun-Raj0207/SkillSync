import {
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const DEFAULT_STEPS = [
  "Extracting Resume",
  "Identifying Skills",
  "Matching Companies",
  "Generating Roadmap",
] as const;

export interface AnalyzingProgressProps {
  steps?: readonly string[];
  /** Milliseconds per step. */
  stepDuration?: number;
  /** Called once the final step completes. */
  onComplete?: () => void;
}

export function AnalyzingProgress({
  steps = DEFAULT_STEPS,
  stepDuration = 1400,
  onComplete,
}: AnalyzingProgressProps) {
  const [current, setCurrent] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);

  // Advance steps
  useEffect(() => {
    if (current >= steps.length) return;
    const tick = 60;
    const id = window.setInterval(() => {
      setStepProgress((p) => {
        const next = p + (tick / stepDuration) * 100;
        if (next >= 100) {
          window.clearInterval(id);
          window.setTimeout(() => {
            if (current + 1 >= steps.length) {
              setCurrent(steps.length);
              onComplete?.();
            } else {
              setCurrent((c) => c + 1);
              setStepProgress(0);
            }
          }, 220);
          return 100;
        }
        return next;
      });
    }, tick);
    return () => window.clearInterval(id);
  }, [current, stepDuration, steps.length, onComplete]);

  const done = current >= steps.length;
  const overall =
    ((current + (done ? 0 : stepProgress / 100)) / steps.length) * 100;

  return (
    <Card variant="elevated" sx={{ overflow: "hidden" }}>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={3}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Stack spacing={0.5}>
              <Typography variant="overline" sx={{ color: "primary.light" }}>
                {done ? "Done" : "Analyzing"}
              </Typography>
              <Typography variant="h5">
                {done
                  ? "Your placement report is ready"
                  : "Crunching your resume…"}
              </Typography>
            </Stack>
            <Typography
              sx={{
                fontVariantNumeric: "tabular-nums",
                fontWeight: 600,
                fontSize: "1.125rem",
                color: "text.primary",
              }}
            >
              {Math.round(overall)}%
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={Math.min(100, overall)}
            sx={{
              height: 8,
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.06)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                background: "linear-gradient(90deg, #4F46E5, #8B5CF6, #22D3EE)",
              },
            }}
          />

          <Stack spacing={1.25}>
            {steps.map((label, i) => {
              const state: "done" | "active" | "pending" =
                i < current || done
                  ? "done"
                  : i === current
                    ? "active"
                    : "pending";
              return (
                <StepRow
                  key={label}
                  label={label}
                  state={state}
                  progress={state === "active" ? stepProgress : 0}
                />
              );
            })}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function StepRow({
  label,
  state,
  progress,
}: {
  label: string;
  state: "done" | "active" | "pending";
  progress: number;
}) {
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: "1px solid",
        borderColor:
          state === "active"
            ? "rgba(37,99,235,0.4)"
            : state === "done"
              ? "rgba(34,197,94,0.3)"
              : "rgba(255,255,255,0.06)",
        backgroundColor:
          state === "active"
            ? "rgba(37,99,235,0.08)"
            : state === "done"
              ? "rgba(34,197,94,0.06)"
              : "rgba(255,255,255,0.02)",
        transition: "all 220ms ease",
      }}
    >
      <StepIcon state={state} />
      <Stack sx={{ flex: 1, minWidth: 0 }} spacing={0.75}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            color:
              state === "pending" ? "text.secondary" : "text.primary",
          }}
        >
          {label}
        </Typography>
        {state === "active" ? (
          <Box
            sx={{
              height: 4,
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${progress}%`,
                height: "100%",
                borderRadius: 999,
                background: "linear-gradient(90deg, #4F46E5, #8B5CF6)",
                transition: "width 80ms linear",
              }}
            />
          </Box>
        ) : null}
      </Stack>
      <Typography
        variant="body2"
        sx={{
          color:
            state === "done"
              ? "success.main"
              : state === "active"
                ? "primary.light"
                : "text.secondary",
          fontVariantNumeric: "tabular-nums",
          minWidth: 64,
          textAlign: "right",
        }}
      >
        {state === "done"
          ? "Complete"
          : state === "active"
            ? `${Math.round(progress)}%`
            : "Queued"}
      </Typography>
    </Stack>
  );
}

function StepIcon({ state }: { state: "done" | "active" | "pending" }) {
  return (
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: "999px",
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        color:
          state === "done"
            ? "success.main"
            : state === "active"
              ? "primary.light"
              : "text.secondary",
        bgcolor:
          state === "done"
            ? "rgba(34,197,94,0.12)"
            : state === "active"
              ? "rgba(37,99,235,0.14)"
              : "rgba(255,255,255,0.04)",
        border: "1px solid",
        borderColor:
          state === "done"
            ? "rgba(34,197,94,0.35)"
            : state === "active"
              ? "rgba(37,99,235,0.4)"
              : "rgba(255,255,255,0.08)",
      }}
    >
      {state === "done" ? (
        <Box
          sx={{
            animation: "pr-check 320ms cubic-bezier(0.22,1,0.36,1) both",
            "@keyframes pr-check": {
              from: { transform: "scale(0.6)", opacity: 0 },
              to: { transform: "scale(1)", opacity: 1 },
            },
          }}
        >
          <Check size={18} />
        </Box>
      ) : state === "active" ? (
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            animation: "pr-spin 900ms linear infinite",
            "@keyframes pr-spin": {
              to: { transform: "rotate(360deg)" },
            },
          }}
        >
          <Loader2 size={18} />
        </Box>
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "999px",
            bgcolor: "currentColor",
            opacity: 0.6,
          }}
        />
      )}
    </Box>
  );
}

import { Box, Stack, Typography } from "@mui/material";
import { Check } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ONBOARDING_STEPS,
  getOnboardingStep,
  isOnboardingPath,
} from "../lib/onboarding-steps";

type StepState = "done" | "active" | "pending";

function getStepState(stepIndex: number, currentIndex: number): StepState {
  if (stepIndex < currentIndex) return "done";
  if (stepIndex === currentIndex) return "active";
  return "pending";
}

export function OnboardingStepper() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (!isOnboardingPath(pathname)) return null;

  const current = getOnboardingStep(pathname);
  const currentIndex = current ? current.step - 1 : 0;

  return (
    <Box
      component="nav"
      aria-label="Onboarding progress"
      sx={{ width: "100%", mb: { xs: 3, md: 4 } }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 2, sm: 0 }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="center"
      >
        {ONBOARDING_STEPS.map((step, index) => {
          const state = getStepState(index, currentIndex);
          const isLast = index === ONBOARDING_STEPS.length - 1;

          return (
            <Stack
              key={step.path}
              direction="row"
              alignItems="center"
              sx={{ flex: { sm: isLast ? "0 0 auto" : 1 }, minWidth: 0 }}
            >
              <Stack
                component={Link}
                to={step.path}
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  minWidth: 0,
                  borderRadius: 2,
                  px: 1,
                  py: 0.5,
                  mx: -1,
                  transition: "background 150ms ease",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.04)",
                  },
                }}
              >
                <StepDot state={state} number={step.step} />
                <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        state === "active"
                          ? "primary.light"
                          : "text.secondary",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Step {step.step}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: state === "active" ? 600 : 500,
                      color:
                        state === "pending" ? "text.secondary" : "text.primary",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {step.label}
                  </Typography>
                </Stack>
              </Stack>

              {!isLast ? (
                <Box
                  aria-hidden
                  sx={{
                    display: { xs: "none", sm: "block" },
                    flex: 1,
                    height: 2,
                    mx: 1.5,
                    borderRadius: 999,
                    bgcolor: "rgba(255,255,255,0.06)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      width: index < currentIndex ? "100%" : "0%",
                      bgcolor:
                        index < currentIndex
                          ? "success.main"
                          : "transparent",
                      transition: "width 300ms ease",
                    }}
                  />
                </Box>
              ) : null}
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}

function StepDot({
  state,
  number,
}: {
  state: StepState;
  number: number;
}) {
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
        boxShadow:
          state === "active"
            ? "0 0 0 3px rgba(37,99,235,0.18)"
            : "none",
        transition: "all 220ms ease",
      }}
    >
      {state === "done" ? (
        <Check size={18} />
      ) : (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            color: "inherit",
          }}
        >
          {number}
        </Typography>
      )}
    </Box>
  );
}

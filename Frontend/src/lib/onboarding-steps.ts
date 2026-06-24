export const ONBOARDING_STEPS = [
  { path: "/analyze", label: "Analyze resume", step: 1 },
  { path: "/dashboard", label: "Your report", step: 2 },
] as const;

export type OnboardingPath = (typeof ONBOARDING_STEPS)[number]["path"];

export function getOnboardingStep(pathname: string) {
  return ONBOARDING_STEPS.find((s) => s.path === pathname) ?? null;
}

export function getAdjacentStep(
  pathname: string,
  direction: "prev" | "next",
): OnboardingPath | null {
  const index = ONBOARDING_STEPS.findIndex((s) => s.path === pathname);
  if (index === -1) return null;
  const nextIndex = direction === "prev" ? index - 1 : index + 1;
  return ONBOARDING_STEPS[nextIndex]?.path ?? null;
}

export function isOnboardingPath(pathname: string): pathname is OnboardingPath {
  return ONBOARDING_STEPS.some((s) => s.path === pathname);
}

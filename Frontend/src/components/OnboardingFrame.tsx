import { Stack } from "@mui/material";
import type { ReactNode } from "react";
import { OnboardingStepper } from "./OnboardingStepper";
import { StepNavigation, type StepNavigationProps } from "./StepNavigation";

interface OnboardingFrameProps {
  children: ReactNode;
  navigation?: StepNavigationProps;
}

export function OnboardingFrame({ children, navigation }: OnboardingFrameProps) {
  return (
    <Stack spacing={0}>
      <OnboardingStepper />
      {children}
      {navigation ? <StepNavigation {...navigation} /> : null}
    </Stack>
  );
}

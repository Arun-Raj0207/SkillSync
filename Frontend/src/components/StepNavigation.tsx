import { Button, Stack } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import type { ReactNode } from "react";

export interface StepNavigationProps {
  onBack?: () => void;
  backLabel?: string;
  backDisabled?: boolean;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextType?: "button" | "submit";
  nextForm?: string;
  nextIcon?: ReactNode;
  hideBack?: boolean;
  hideNext?: boolean;
}

export function StepNavigation({
  onBack,
  backLabel = "Back",
  backDisabled = false,
  onNext,
  nextLabel = "Next",
  nextDisabled = false,
  nextType = "button",
  nextForm,
  nextIcon = <ArrowForwardRoundedIcon />,
  hideBack = false,
  hideNext = false,
}: StepNavigationProps) {
  if (hideBack && hideNext) return null;

  return (
    <Stack
      direction={{ xs: "column-reverse", sm: "row" }}
      spacing={1.5}
      justifyContent="space-between"
      alignItems={{ sm: "center" }}
      sx={{ mt: { xs: 3, md: 4 }, width: "100%" }}
    >
      {!hideBack ? (
        <Button
          variant="subtle"
          size="large"
          onClick={onBack}
          disabled={backDisabled || !onBack}
          startIcon={<ArrowBackRoundedIcon />}
        >
          {backLabel}
        </Button>
      ) : (
        <span />
      )}

      {!hideNext ? (
        <Button
          variant="hero"
          size="large"
          type={nextType}
          form={nextForm}
          onClick={nextType === "button" ? onNext : undefined}
          disabled={nextDisabled}
          endIcon={nextIcon}
        >
          {nextLabel}
        </Button>
      ) : null}
    </Stack>
  );
}

import { Box, Container, Stack, Typography } from "@mui/material";
import type { ContainerProps } from "@mui/material";
import type { ReactNode } from "react";

export interface SectionProps {
  /** Optional eyebrow chip text above the heading. */
  eyebrow?: ReactNode;
  /** Section title (renders as h2). */
  title?: ReactNode;
  /** Supporting description below the title. */
  description?: ReactNode;
  /** Right-aligned actions next to the title block. */
  actions?: ReactNode;
  /** Constrain width. Defaults to `lg`. */
  maxWidth?: ContainerProps["maxWidth"];
  /** Vertical padding scale. */
  spacing?: "sm" | "md" | "lg";
  /** Centers heading + text. */
  centered?: boolean;
  children?: ReactNode;
  id?: string;
}

const PY = {
  sm: { xs: 4, md: 6 },
  md: { xs: 6, md: 10 },
  lg: { xs: 8, md: 14 },
} as const;

export function Section({
  eyebrow,
  title,
  description,
  actions,
  maxWidth = "lg",
  spacing = "md",
  centered = false,
  children,
  id,
}: SectionProps) {
  const hasHeader = eyebrow || title || description || actions;

  return (
    <Box
      component="section"
      id={id}
      sx={{ py: PY[spacing], width: "100%" }}
    >
      <Container maxWidth={maxWidth}>
        {hasHeader ? (
          <Stack
            direction={{ xs: "column", md: actions ? "row" : "column" }}
            spacing={3}
            alignItems={{
              xs: centered ? "center" : "flex-start",
              md: actions ? "flex-end" : centered ? "center" : "flex-start",
            }}
            justifyContent="space-between"
            sx={{ mb: { xs: 4, md: 6 }, textAlign: centered ? "center" : "left" }}
          >
            <Stack
              spacing={1.5}
              sx={{ maxWidth: 720, alignItems: centered ? "center" : "flex-start" }}
            >
              {eyebrow ? (
                <Typography
                  variant="overline"
                  sx={{ color: "primary.light" }}
                >
                  {eyebrow}
                </Typography>
              ) : null}
              {title ? <Typography variant="h2">{title}</Typography> : null}
              {description ? (
                <Typography variant="body1" color="text.secondary">
                  {description}
                </Typography>
              ) : null}
            </Stack>
            {actions ? (
              <Stack direction="row" spacing={1.5}>
                {actions}
              </Stack>
            ) : null}
          </Stack>
        ) : null}
        {children}
      </Container>
    </Box>
  );
}

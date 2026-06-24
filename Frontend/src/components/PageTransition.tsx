import { Box } from "@mui/material";
import type { ReactNode } from "react";

export function PageTransition({
  pathname,
  children,
}: {
  pathname: string;
  children: ReactNode;
}) {
  return (
    <Box
      key={pathname}
      sx={{
        animation: "pr-fade-in 320ms cubic-bezier(0.22, 1, 0.36, 1)",
        "@keyframes pr-fade-in": {
          from: { opacity: 0, transform: "translateY(8px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {children}
    </Box>
  );
}

import { AppBar, Box, Container, Toolbar, Typography, Button, Stack } from "@mui/material";
import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { PageTransition } from "./PageTransition";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/analyze", label: "Analyze" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/roadmap", label: "Roadmap" },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });


  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="sticky" elevation={0} color="transparent">
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 2 }}>
            <Typography
              component={Link}
              
              to="/"
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "text.primary",
                textDecoration: "none",
                mr: 2,
              }}
            >
              SkillSync
            </Typography>
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ ml: "auto", overflowX: "auto" }}
            >
              {NAV.map((item) => {
                const active = pathname === item.to;
                return (
                  <Button
                    key={item.to}
                    component={Link}
                    
                    to={item.to}
                    size="small"
                    sx={{
                      color: active ? "text.primary" : "text.secondary",
                      bgcolor: active ? "rgba(255,255,255,0.06)" : "transparent",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flex: 1, py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <PageTransition pathname={pathname}>{children}</PageTransition>

        </Container>
      </Box>
    </Box>
  );
}

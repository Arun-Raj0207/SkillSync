import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import { Section } from "../components/Section";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillSync — Know your placement odds before you apply" },
      {
        name: "description",
        content:
          "SkillSync predicts your placement odds, surfaces the gaps that matter, and shows a clear path to your dream offer.",
      },
      {
        property: "og:title",
        content: "SkillSync — Know your placement odds before you apply",
      },
      {
        property: "og:description",
        content:
          "Predict your placement odds, find your gaps, and ship the prep that gets offers.",
      },
    ],
  }),
  component: LandingPage,
});

const FEATURES = [
  {
    icon: <InsightsRoundedIcon fontSize="medium" />,
    title: "Honest odds, not vibes",
    body:
      "A calibrated score based on your resume, skills and target roles — updated as you grow.",
    accent: "Predict",
  },
  {
    icon: <AutoAwesomeRoundedIcon fontSize="medium" />,
    title: "Gaps that actually matter",
    body:
      "We compare you to recent hires at the same companies and surface the 3 things to fix first.",
    accent: "Diagnose",
  },
  {
    icon: <RocketLaunchRoundedIcon fontSize="medium" />,
    title: "A roadmap that ships offers",
    body:
      "A weekly plan that adapts to your progress — projects, problems and mock rounds, in order.",
    accent: "Prepare",
  },
];

function LandingPage() {
  return (
    <Box>
      <Hero />
      <Features />
    </Box>
  );
}

function Hero() {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        pt: { xs: 8, md: 14 },
        pb: { xs: 8, md: 12 },
      }}
    >
      {/* Ambient gradient blobs */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          display: "none",
        }}
      />
      {/* Subtle grid */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.35,
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 75%)",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Stack spacing={{ xs: 3, md: 4 }} alignItems="center" textAlign="center">
          <Chip
            label="Now in beta — free for students"
            size="small"
            sx={{
              animation: "pr-rise 600ms ease both",
              animationDelay: "40ms",
              bgcolor: "rgba(37,99,235,0.12)",
              color: "#2563EB",
              border: "1px solid rgba(37,99,235,0.25)",
            }}
          />

          <Typography
            variant="h1"
            sx={{
              maxWidth: 920,
              animation: "pr-rise 700ms ease both",
              animationDelay: "120ms",
              color: "#F8FAFC",
            }}
          >
            Know your placement odds{" "}
            <Box
              component="span"
              sx={{
                color: "#2563EB",
                fontWeight: 700,
              }}
            >
              before you apply.
            </Box>
          </Typography>

          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{
              maxWidth: 680,
              animation: "pr-rise 700ms ease both",
              animationDelay: "220ms",
            }}
          >
            SkillSync scores your real chances at top companies, pinpoints the
            gaps holding you back, and builds a week-by-week roadmap so you walk
            into every interview prepared, not hopeful.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{
              pt: 1,
              animation: "pr-rise 700ms ease both",
              animationDelay: "320ms",
            }}
          >
            <Button
              component={Link}
              to="/analyze"
              variant="hero"
              size="large"
              endIcon={<ArrowForwardRoundedIcon />}
            >
              Get my placement score
            </Button>
            <Button
              component={Link}
              to="/dashboard"
              variant="subtle"
              size="large"
            >
              See a sample report
            </Button>
          </Stack>

          <Typography
            variant="body2"
            sx={{
              opacity: 0.7,
              animation: "pr-rise 700ms ease both",
              animationDelay: "420ms",
            }}
          >
            No credit card · Takes under 2 minutes
          </Typography>
        </Stack>

        {/* Floating preview card */}
        <Box
          sx={{
            mt: { xs: 6, md: 10 },
            mx: "auto",
            maxWidth: 960,
            animation: "pr-float-in 900ms cubic-bezier(0.22,1,0.36,1) both",
            animationDelay: "500ms",
          }}
        >
          <PreviewCard />
        </Box>
      </Container>

      <Box
        sx={{
          "@keyframes pr-rise": {
            from: { opacity: 0, transform: "translateY(14px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
          "@keyframes pr-float-in": {
            from: { opacity: 0, transform: "translateY(28px) scale(0.98)" },
            to: { opacity: 1, transform: "translateY(0) scale(1)" },
          },
          "@keyframes pr-card-in": {
            from: { opacity: 0, transform: "translateY(18px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      />
    </Box>
  );
}

function PreviewCard() {
  return (
    <Card
      variant="gradient"
      sx={{
        p: { xs: 2.5, md: 3.5 },
        position: "relative",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 2.5, md: 4 }}
        alignItems={{ md: "center" }}
      >
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            width: { xs: "100%", md: 200 },
            aspectRatio: "1 / 1",
            maxWidth: 220,
            borderRadius: "999px",
            border: "2px solid #2563EB",
            position: "relative",
            mx: { xs: "auto", md: 0 },
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 12,
              borderRadius: "999px",
              bgcolor: "background.paper",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography variant="overline" color="text.secondary">
              Placement score
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "2.75rem", md: "3.25rem" },
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                color: "#2563EB",
              }}
            >
              78
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Top 18% · CS '26
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={1.5} sx={{ flex: 1, width: "100%" }}>
          <Typography variant="overline" color="text.secondary">
            Live snapshot
          </Typography>
          <Typography variant="h5">You're tracking well for SDE roles</Typography>
          <Stack spacing={1.25}>
            {[
              { label: "DSA fundamentals", value: 86 },
              { label: "System design", value: 54 },
              { label: "Resume strength", value: 72 },
            ].map((row) => (
              <Stack key={row.label} spacing={0.75}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    {row.label}
                  </Typography>
                  <Typography variant="body2">{row.value}%</Typography>
                </Stack>
                <Box
                  sx={{
                    height: 6,
                    borderRadius: 999,
                    bgcolor: "rgba(255,255,255,0.06)",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: `${row.value}%`,
                      height: "100%",
                      borderRadius: 999,
                      backgroundColor: "#2563EB",
                    }}
                  />
                </Box>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}

function Features() {
  return (
    <Section
      eyebrow="Why SkillSync"
      title="Built like the prep tool you wish existed."
      description="Three things, done seriously well — so you stop guessing and start improving."
      spacing="lg"
      centered
    >
      <Box
        sx={{
          display: "grid",
          gap: { xs: 2.5, md: 3 },
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)",
          },
        }}
      >
        {FEATURES.map((f, i) => (
          <Card
            key={f.title}
            variant="interactive"
            sx={{
              opacity: 0,
              animation: "pr-card-in 600ms ease both",
              animationDelay: `${120 + i * 120}ms`,
              "@keyframes pr-card-in": {
                from: { opacity: 0, transform: "translateY(18px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            <CardContent>
              <Stack spacing={2}>
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
                  }}
                >
                  {f.icon}
                </Box>
                <Typography
                  variant="overline"
                  sx={{ color: "primary.light" }}
                >
                  {f.accent}
                </Typography>
                <Typography variant="h5">{f.title}</Typography>
                <Typography variant="body2">{f.body}</Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Section>
  );
}

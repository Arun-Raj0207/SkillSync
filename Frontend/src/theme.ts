import { createTheme, alpha } from "@mui/material/styles";

const PRIMARY = "#2563EB";
const PRIMARY_GLOW = "#1E40AF";
const BG = "#0D1117";
const SURFACE = "#161B22";
const SURFACE_2 = "#1C2128";
const BORDER = "#30363D";
const BORDER_STRONG = "#3D444D";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: PRIMARY, light: PRIMARY_GLOW, contrastText: "#FFFFFF" },
    secondary: { main: "#2563EB" },
    success: { main: "#22C55E" },
    warning: { main: "#F59E0B" },
    error: { main: "#EF4444" },
    background: { default: BG, paper: SURFACE },
    divider: BORDER,
    text: {
      primary: "#F8FAFC",
      secondary: "#94A3B8",
      disabled: "#475569",
    },
  },

  shape: { borderRadius: 12 },

  spacing: 8,

  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },

  typography: {
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
      lineHeight: 1.1,
      letterSpacing: "-0.03em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "clamp(1.875rem, 3vw, 2.5rem)",
      lineHeight: 1.15,
      letterSpacing: "-0.025em",
    },
    h3: {
      fontWeight: 600,
      fontSize: "clamp(1.5rem, 2.2vw, 2rem)",
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h4: { fontWeight: 600, fontSize: "1.5rem", letterSpacing: "-0.015em" },
    h5: { fontWeight: 600, fontSize: "1.25rem", letterSpacing: "-0.01em" },
    h6: { fontWeight: 600, fontSize: "1rem", letterSpacing: "-0.005em" },
    subtitle1: { fontSize: "1.125rem", fontWeight: 500, lineHeight: 1.5 },
    subtitle2: { fontSize: "0.9375rem", fontWeight: 500, color: "#9CA3AF" },
    body1: { fontSize: "1rem", lineHeight: 1.65 },
    body2: { fontSize: "0.875rem", lineHeight: 1.6, color: "#9CA3AF" },
    button: {
      textTransform: "none",
      fontWeight: 500,
      letterSpacing: "-0.005em",
    },
    overline: {
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      fontSize: "0.75rem",
      fontWeight: 600,
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { WebkitFontSmoothing: "antialiased" },
        body: {
          backgroundColor: BG,
          backgroundImage: "none",
        },
        "::selection": {
          backgroundColor: alpha(PRIMARY, 0.25),
        },
        "*::-webkit-scrollbar": { width: 10, height: 10 },
        "*::-webkit-scrollbar-thumb": {
          background: BORDER_STRONG,
          borderRadius: 8,
        },
      },
    },

    MuiContainer: {
      defaultProps: { maxWidth: "lg" },
      styleOverrides: {
        root: {
          paddingLeft: 20,
          paddingRight: 20,
          "@media (min-width:900px)": {
            paddingLeft: 32,
            paddingRight: 32,
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0, color: "transparent" },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: SURFACE,
          borderBottom: `1px solid ${BORDER}`,
        },
      },
    },

    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          transition:
            "all 200ms ease",
        },
      },
      variants: [
        {
          props: { variant: "outlined" },
          style: { backgroundColor: SURFACE, border: `1px solid ${BORDER}` },
        },
        {
          props: { variant: "elevated" as never },
          style: {
            backgroundColor: SURFACE_2,
            border: `1px solid ${BORDER}`,
            boxShadow: `0 1px 3px ${alpha("#000", 0.12)}, 0 1px 2px ${alpha("#000", 0.24)}`,
          },
        },
        {
          props: { variant: "interactive" as never },
          style: {
            cursor: "pointer",
            "&:hover": {
              borderColor: BORDER_STRONG,
              boxShadow: `0 4px 12px ${alpha("#000", 0.15)}`,
              backgroundColor: alpha(SURFACE_2, 0.5),
            },
          },
        },
        {
          props: { variant: "gradient" as never },
          style: {
            border: `1px solid ${BORDER}`,
            backgroundColor: SURFACE,
          },
        },
      ],
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          "&:last-child": { paddingBottom: 24 },
        },
      },
    },

    MuiCardHeader: {
      styleOverrides: {
        root: { padding: 24, paddingBottom: 8 },
        title: { fontSize: "1.125rem", fontWeight: 600 },
        subheader: { fontSize: "0.875rem", color: "#9CA3AF" },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: false },
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 18,
          paddingBlock: 9,
          fontWeight: 500,
          transition: "all 200ms ease",
        },
        sizeSmall: { paddingInline: 14, paddingBlock: 6, fontSize: "0.8125rem" },
        sizeLarge: {
          paddingInline: 24,
          paddingBlock: 12,
          fontSize: "1rem",
          borderRadius: 12,
        },
        containedPrimary: {
          backgroundColor: PRIMARY,
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: PRIMARY_GLOW,
            boxShadow: `0 4px 12px ${alpha(PRIMARY, 0.3)}`,
          },
        },
        outlined: {
          borderColor: BORDER_STRONG,
          color: "#F8FAFC",
          "&:hover": {
            borderColor: PRIMARY,
            backgroundColor: alpha(PRIMARY, 0.08),
          },
        },
        text: {
          color: "#F8FAFC",
          "&:hover": { backgroundColor: alpha("#fff", 0.06) },
        },
      },
      variants: [
        {
          props: { variant: "hero" as never },
          style: {
            paddingInline: 26,
            paddingBlock: 12,
            borderRadius: 12,
            color: "#FFFFFF",
            backgroundColor: PRIMARY,
            "&:hover": {
              backgroundColor: PRIMARY_GLOW,
              boxShadow: `0 8px 24px ${alpha(PRIMARY, 0.4)}`,
            },
          },
        },
        {
          props: { variant: "subtle" as never },
          style: {
            color: "#F8FAFC",
            backgroundColor: alpha("#fff", 0.05),
            border: `1px solid ${BORDER}`,
            "&:hover": {
              backgroundColor: alpha("#fff", 0.08),
              borderColor: BORDER_STRONG,
            },
          },
        },
      ],
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          color: "#F8FAFC",
          "&:hover": { backgroundColor: alpha("#fff", 0.06) },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          backgroundColor: alpha("#fff", 0.06),
          border: `1px solid ${BORDER}`,
        },
      },
    },

    MuiDivider: {
      styleOverrides: { root: { borderColor: BORDER } },
    },

    MuiLink: {
      defaultProps: { underline: "none" },
      styleOverrides: {
        root: {
          color: "#F8FAFC",
          transition: "color 150ms ease",
          "&:hover": { color: PRIMARY },
        },
      },
    },

    MuiTextField: {
      defaultProps: { variant: "outlined", size: "medium" },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: alpha("#fff", 0.03),
          "& .MuiOutlinedInput-notchedOutline": { borderColor: BORDER_STRONG },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(PRIMARY, 0.4),
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: PRIMARY,
            borderWidth: 1,
          },
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: SURFACE_2,
          border: `1px solid ${BORDER}`,
          fontSize: "0.75rem",
          padding: "6px 10px",
          borderRadius: 8,
        },
      },
    },
  },
});

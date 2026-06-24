
import { defineConfig } from "@lovable.dev/vite-tanstack-config";



export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    resolve: {
      alias: [
        {
          find: /^react-transition-group\/TransitionGroupContext$/,
          replacement: "react-transition-group/esm/TransitionGroupContext.js",
        },
        {
          find: /^react-transition-group\/TransitionGroupContext\.js$/,
          replacement: "react-transition-group/esm/TransitionGroupContext.js",
        },
      ],
    },
    ssr: {
      noExternal: [
        "@mui/material",
        "@mui/system",
        "@mui/icons-material",
        "@mui/utils",
        "@mui/base",
        "@mui/private-theming",
        "@mui/styled-engine",
        "@emotion/react",
        "@emotion/styled",
        "react-transition-group",
      ],
    },
  },
});



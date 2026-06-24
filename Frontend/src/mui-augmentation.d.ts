import "@mui/material/Button";
import "@mui/material/Card";
import "@mui/material/Paper";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    hero: true;
    subtle: true;
  }
}

declare module "@mui/material/Card" {
  interface CardPropsVariantOverrides {
    elevated: true;
    interactive: true;
    gradient: true;
  }
}

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    elevated: true;
    interactive: true;
    gradient: true;
  }
}


// src/theme/theme.js

import { createTheme } from "@mui/material/styles";

// Suas variáveis de cor
const primaryColor = "#242734";
const textColor = "#464A53";
const subtleGray = "#f0f2f5";

// Crie e exporte o tema
const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
    background: {
      default: subtleGray,
      paper: "#ffffff",
    },
    text: {
      primary: textColor,
    },
  },
  typography: {
    fontFamily: "inherit", // Ou sua fonte preferida
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        }
      }
    },
    MuiTab: {
       styleOverrides: {
        root: {
          textTransform: 'none',
        }
      }
    }
  }
});

export default theme;
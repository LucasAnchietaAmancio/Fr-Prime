import AppRouter from "./routes/AppRouter";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./config/theme";
import './index.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box className="App">
        <AppRouter />
      </Box>
    </ThemeProvider>
  );
} 

export default App;
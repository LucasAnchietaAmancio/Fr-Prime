"use client"

import { Box, Typography, Button, ThemeProvider } from "@mui/material"
import { useNavigate } from "react-router-dom"
import theme from "../config/theme"

export default function NotFound() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate("/")
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
          p: 4,
          bgcolor: theme.palette.background.default,
        }}
      >
        <Typography variant="h1" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
          404
        </Typography>
        <Typography variant="h4" fontWeight="medium" color="text.primary" sx={{ mb: 1 }}>
          Página não encontrada 😞
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: "500px" }}>
          Parece que você tentou acessar uma página que não existe. Não se preocupe, isso acontece!
        </Typography>
        <Button variant="contained" color="primary" onClick={handleGoHome}>
          Voltar para o Dashboard
        </Button>
      </Box>
    </ThemeProvider>
  )
}
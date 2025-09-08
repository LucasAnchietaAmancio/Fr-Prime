"use client"

import { useState } from "react"

// Importações adicionais para ícones e InputAdornment
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { AlternateEmail, LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Suas cores originais foram mantidas
  const primaryColor = "#242734"
  const textColor = "#464A53"
  const subtleGray = "#f0f2f5" // Um cinza claro para o fundo

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // Fundo com gradiente sutil para dar profundidade
        background: `linear-gradient(to bottom right, ${subtleGray}, #ffffff)`,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: "448px",
          boxShadow: "0px 8px 40px -12px rgba(0,0,0,0.2)", // Sombra mais suave
          p: { xs: 2, sm: 4 }, // Padding responsivo
          borderRadius: 2, // Bordas mais arredondadas
          border: 'none'
        }}
      >
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <Avatar sx={{ m: 1, bgcolor: primaryColor }}>
              <LockOutlined />
            </Avatar>
            <Typography component="h1" variant="h5" fontWeight="bold" color={primaryColor}>
              FR Prime
            </Typography>
            <Typography variant="body2" color={textColor}>
              Faça login para continuar
            </Typography>
          </Stack>

          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Stack spacing={3}>
              <TextField
                id="email"
                name="email"
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AlternateEmail sx={{ color: textColor }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: textColor }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Link
                  href="#"
                  underline="hover"
                  variant="body2"
                  sx={{ color: textColor }}
                >
                  Esqueceu a senha?
                </Link>
              </Box>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  py: 1.5,
                  backgroundColor: primaryColor,
                  color: "white",
                  fontWeight: "bold",
                  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: primaryColor,
                    transform: "translateY(-2px)",
                    boxShadow: "0px 4px 20px -8px rgba(0,0,0,0.4)",
                  },
                }}
              >
                Entrar
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" color={textColor} align="center" sx={{ mt: 4 }}>
            Não tem uma conta?{" "}
            <Link href="#" fontWeight="bold" sx={{ color: primaryColor }}>
              Cadastre-se
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
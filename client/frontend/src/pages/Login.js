"use client"

import { useState } from "react"
import { apiLogin } from "../api/EndpointsApi"
import { useNavigate } from "react-router-dom"
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
  Alert
} from "@mui/material"
import { AlternateEmail, LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState({ isOpen: false, field: "", message: "" })

  const navigate = useNavigate()

  // As variáveis de cor foram removidas daqui, pois virão do tema.

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const validateForm = () => {
    if (!email) {
      setError({ isOpen: true, field: "email", message: "Por favor, preencha o campo E-mail." })
      return false
    }
    if (!isEmail(email)) {
      setError({ isOpen: true, field: "email", message: "Por favor, insira um email válido." })
      return false
    }
    if (!password) {
      setError({ isOpen: true, field: "password", message: "Por favor, preencha o campo Senha." })
      return false
    }
    if (password.length < 8) {
      setError({ isOpen: true, field: "password", message: "A senha deve ter no mínimo 8 caracteres." })
      return false
    }
    setError({ isOpen: false, field: "", message: "" })
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const response = await apiLogin(email, password)
      navigate("/dashboard", { replace: true })
    } catch (err) {
      setError({ isOpen: true, field: "general", message: err.response?.data?.message || "Erro ao fazer login." })
    }
  }

  return (
    <Box
      sx={(theme) => ({ // Usando uma função para acessar o tema
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // O gradiente agora usa as cores do background do tema
        background: `linear-gradient(to bottom right, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
      })}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: "448px",
          boxShadow: "0px 8px 40px -12px rgba(0,0,0,0.2)",
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
          border: "none",
        }}
      >
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}> {/* Usa a cor primária do tema */}
              <LockOutlined />
            </Avatar>
            <Typography component="h1" variant="h5" fontWeight="bold" color="primary.main"> {/* Usa a cor primária do tema */}
              FR Prime
            </Typography>
            <Typography variant="body2" color="text.secondary"> {/* Usa a cor secundária de texto do tema */}
              Faça login para continuar
            </Typography>
          </Stack>

          <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {error.isOpen && error.field === "general" && (
                <Alert severity="error">{error.message}</Alert>
              )}

              <TextField
                id="email"
                name="email"
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                error={error.isOpen && error.field === "email"}
                helperText={error.isOpen && error.field === "email" ? error.message : ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {/* Cor padrão para ícones de ação */}
                      <AlternateEmail color="action" />
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
                error={error.isOpen && error.field === "password"}
                helperText={error.isOpen && error.field === "password" ? error.message : ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined color="action" />
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
                <Link href="#" underline="hover" variant="body2" color="text.primary"> {/* Usa a cor primária de texto */}
                  Esqueceu a senha?
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary" // O MUI aplicará as cores primárias do tema aqui
                fullWidth
                sx={{
                  py: 1.5,
                  fontWeight: "bold",
                  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    // O hover padrão do MUI já escurece a cor. Mantemos apenas os efeitos customizados.
                    transform: "translateY(-2px)",
                    boxShadow: "0px 4px 20px -8px rgba(0,0,0,0.4)",
                  },
                }}
              >
                Entrar
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
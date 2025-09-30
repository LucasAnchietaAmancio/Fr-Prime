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
  Typography
} from "@mui/material"
import { AlternateEmail, LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material"

import { isEmailValid, isLoginPasswordValid } from '../utils/validators'
import { useNotification } from "../contexts/NotificationContext"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState({ isOpen: false, field: "", message: "" })
  
  const navigate = useNavigate()
  const { showNotification } = useNotification()

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  
  const validateForm = () => {
    const emailValidation = isEmailValid(email);
    if (!emailValidation.isValid) {
      setError({ isOpen: true, field: "email", message: emailValidation.message });
      return false;
    }

    const passwordValidation = isLoginPasswordValid(password);
    if (!passwordValidation.isValid) {
      setError({ isOpen: true, field: "password", message: passwordValidation.message });
      return false;
    }
    
    setError({ isOpen: false, field: "", message: "" })
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      await apiLogin(email, password)
      showNotification("Login realizado com sucesso!", "success")
      navigate("/", { replace: true })
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao fazer login. Verifique suas credenciais."
      showNotification(errorMessage, "error")
    }
  }

  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <LockOutlined />
            </Avatar>
            <Typography component="h1" variant="h5" fontWeight="bold" color="primary.main">
              FR Prime
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Faça login para continuar
            </Typography>
          </Stack>

          <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
            <Stack spacing={2}>
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
                <Link href="#" underline="hover" variant="body2" color="text.primary">
                  Esqueceu a senha?
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  py: 1.5,
                  fontWeight: "bold",
                  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
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
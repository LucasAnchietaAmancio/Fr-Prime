import { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { apiCreateUser, apiUpdateUser } from "../api/EndpointsApi";
import InputMask from "react-input-mask";

export default function PublisherFormDrawer({ open, onClose, publicadorData }) {
  const [formData, setFormData] = useState({
    cpf: "",
    nome: "",
    email: "",
    telefone: "",
    nivelAcesso: "",
    senha: "",
    senhaAtual: "",
    novaSenha: "",
  });

  const niveisAcesso = [
    { value: "USER", label: "Colaborador" },
    { value: "ADMIN", label: "Administrador" },
  ];

  const [initialData, setInitialData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };


  useEffect(() => {
    if (publicadorData) {
      const data = {
        cpf: publicadorData.cpf || "",
        nome: publicadorData.nome || "",
        email: publicadorData.email || "",
        telefone: publicadorData.telefone || "",
        nivelAcesso: publicadorData.role || "",
        senha: "",
        senhaAtual: "",
        novaSenha: "",
      };
      setFormData(data);
      setInitialData(data);
    } else {
      const emptyData = {
        cpf: "",
        nome: "",
        email: "",
        telefone: "",
        nivelAcesso: "",
        senha: "",
        senhaAtual: "",
        novaSenha: "",
      };
      setFormData(emptyData);
      setInitialData(emptyData);
    }
  }, [publicadorData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  const senhaRegras = {
    minLength: formData.senha.length >= 8,
    upperLower: /[a-z]/.test(formData.senha) && /[A-Z]/.test(formData.senha),
    number: /\d/.test(formData.senha),
    specialChar: /[@$!%*?&]/.test(formData.senha),
  };
  const senhaForte = Object.values(senhaRegras).every(Boolean);

  const novaSenhaRegras = {
    minLength: formData.novaSenha.length >= 8,
    upperLower: /[a-z]/.test(formData.novaSenha) && /[A-Z]/.test(formData.novaSenha),
    number: /\d/.test(formData.novaSenha),
    specialChar: /[@$!%*?&]/.test(formData.novaSenha),
  };
  const novaSenhaForte = Object.values(novaSenhaRegras).every(Boolean);

  const isChanged = JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleSalvar = async () => {
    try {
      const payload = {
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        telefone: formData.telefone,
        role: formData.nivelAcesso,
      };

      if (publicadorData) {

        if (formData.senhaAtual && formData.novaSenha) {
          payload.senhaAtual = formData.senhaAtual;
          payload.novaSenha = formData.novaSenha;
        }

        await apiUpdateUser(publicadorData.email, payload);
        setSnackbar({
          open: true,
          message: "Usuário atualizado com sucesso!",
          severity: "success",
        });
      } else {
        
        await apiCreateUser({
          ...payload,
          senha: formData.senha,
        });
        setSnackbar({
          open: true,
          message: "Usuário cadastrado com sucesso!",
          severity: "success",
        });
      }

      onClose();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      setSnackbar({
        open: true,
        message: `Erro ao salvar usuário. ${error.response?.data?.message || error.message}`,
        severity: "error",
      });
    }
  };

  const title = publicadorData ? "Editar usuário" : "Cadastrar Publicador";

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 450, p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight="bold">
              {title}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              Dados pessoais
            </Typography>

            <InputMask
              mask="999.999.999-99"
              value={formData.cpf}
              onChange={(e) => handleChange("cpf", e.target.value)}
            >
              {() => <TextField label="CPF*" fullWidth size="small" />}
            </InputMask>

            <TextField
              label="Nome completo*"
              value={formData.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              fullWidth
              size="small"
            />

            <TextField
              label="E-mail*"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              fullWidth
              size="small"
            />

            <InputMask
              mask="(99) 99999-9999"
              value={formData.telefone}
              onChange={(e) => handleChange("telefone", e.target.value)}
            >
              {() => <TextField label="Telefone*" fullWidth size="small" />}
            </InputMask>

            {/* Senha obrigatória apenas na criação */}
            {!publicadorData && (
              <>
                <TextField
                  label="Crie sua senha de acesso*"
                  type={showPassword ? "text" : "password"}
                  value={formData.senha}
                  onChange={(e) => handleChange("senha", e.target.value)}
                  fullWidth
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={formData.senha.length > 0 && !senhaForte}
                />
                {formData.senha.length > 0 && (
                  <Box sx={{ pl: 1 }}>
                    <Typography
                      variant="body2"
                      color={senhaRegras.minLength ? "success.main" : "error"}
                    >
                      {senhaRegras.minLength ? "✔" : "✖"} 8 caracteres ou mais
                    </Typography>
                    <Typography
                      variant="body2"
                      color={senhaRegras.upperLower ? "success.main" : "error"}
                    >
                      {senhaRegras.upperLower ? "✔" : "✖"} Letras maiúsculas e minúsculas
                    </Typography>
                    <Typography
                      variant="body2"
                      color={senhaRegras.number ? "success.main" : "error"}
                    >
                      {senhaRegras.number ? "✔" : "✖"} Pelo menos um número
                    </Typography>
                    <Typography
                      variant="body2"
                      color={senhaRegras.specialChar ? "success.main" : "error"}
                    >
                      {senhaRegras.specialChar ? "✔" : "✖"} Pelo menos um caractere especial
                    </Typography>
                    {!senhaForte && (
                      <Typography variant="body2" color="error">
                        Esta senha ainda não é forte
                      </Typography>
                    )}
                  </Box>
                )}
              </>
            )}

            {/* Redefinir senha apenas ao editar */}
            {publicadorData && (
              <>
                <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                  Redefinir senha (opcional)
                </Typography>
                <TextField
                  label="Senha atual"
                  type={showSenhaAtual ? "text" : "password"}
                  value={formData.senhaAtual}
                  onChange={(e) => handleChange("senhaAtual", e.target.value)}
                  fullWidth
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowSenhaAtual((prev) => !prev)} edge="end">
                          {showSenhaAtual ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Nova senha"
                  type={showNovaSenha ? "text" : "password"}
                  value={formData.novaSenha}
                  onChange={(e) => handleChange("novaSenha", e.target.value)}
                  fullWidth
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowNovaSenha((prev) => !prev)} edge="end">
                          {showNovaSenha ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={formData.novaSenha.length > 0 && !novaSenhaForte}
                />
                {formData.novaSenha.length > 0 && (
                  <Box sx={{ pl: 1 }}>
                    <Typography
                      variant="body2"
                      color={novaSenhaRegras.minLength ? "success.main" : "error"}
                    >
                      {novaSenhaRegras.minLength ? "✔" : "✖"} 8 caracteres ou mais
                    </Typography>
                    <Typography
                      variant="body2"
                      color={novaSenhaRegras.upperLower ? "success.main" : "error"}
                    >
                      {novaSenhaRegras.upperLower ? "✔" : "✖"} Letras maiúsculas e minúsculas
                    </Typography>
                    <Typography
                      variant="body2"
                      color={novaSenhaRegras.number ? "success.main" : "error"}
                    >
                      {novaSenhaRegras.number ? "✔" : "✖"} Pelo menos um número
                    </Typography>
                    <Typography
                      variant="body2"
                      color={novaSenhaRegras.specialChar ? "success.main" : "error"}
                    >
                      {novaSenhaRegras.specialChar ? "✔" : "✖"} Pelo menos um caractere especial
                    </Typography>
                    {!novaSenhaForte && (
                      <Typography variant="body2" color="error">
                        Esta senha ainda não é forte
                      </Typography>
                    )}
                  </Box>
                )}
              </>
            )}

            <Typography variant="subtitle1" fontWeight="bold" mt={2}>
              Dados profissionais
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Nível de acesso*</InputLabel>
              <Select
                value={formData.nivelAcesso}
                label="Nível de acesso*"
                onChange={(e) => handleChange("nivelAcesso", e.target.value)}
              >
                {niveisAcesso.map((nivel) => (
                  <MenuItem key={nivel.value} value={nivel.value}>
                    {nivel.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSalvar}
              sx={{ mt: 2 }}
              disabled={
                (!publicadorData && (!isChanged || !senhaForte)) || 
                (publicadorData && !isChanged)
              }
            >
              {publicadorData ? "Salvar Alterações" : "Cadastrar"}
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}


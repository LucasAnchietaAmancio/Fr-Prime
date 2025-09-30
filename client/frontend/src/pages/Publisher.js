import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  IconButton,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import PublisherFormDrawer from "../components/PublisherFormDrawer";
import { apiGetUsers, apiDeleteUser } from "../api/EndpointsApi";

export default function Publisher() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPublicador, setSelectedPublicador] = useState(null);
  const [publicadores, setPublicadores] = useState([]);
  const [filteredPublicadores, setFilteredPublicadores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await apiGetUsers();
        if (result && result.data) {
          setPublicadores(result.data);
          setFilteredPublicadores(result.data);
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredPublicadores(publicadores);
    } else {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      setFilteredPublicadores(
        publicadores.filter(
          (p) =>
            p.nome.toLowerCase().includes(lowercasedSearchTerm) ||
            (p.email && p.email.toLowerCase().includes(lowercasedSearchTerm)) ||
            (p.telefone && p.telefone.includes(lowercasedSearchTerm))
        )
      );
    }
  }, [searchTerm, publicadores]);

  const handleOpenDrawer = (publicador) => {
    setSelectedPublicador(publicador);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedPublicador(null);
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleClearSearch = () => setSearchTerm("");

 
  const handleDeletePublisher = async (id_usuario) => {
    if (!window.confirm("Deseja realmente excluir este publicador?")) return;

    try {
      await apiDeleteUser(id_usuario); // Função de DELETE no EndpointsApi (ainda em integração)
      setPublicadores((prev) => prev.filter((p) => p.id_usuario !== id_usuario));
      setFilteredPublicadores((prev) => prev.filter((p) => p.id_usuario !== id_usuario));
      setSnackbar({
        open: true,
        message: "Publicador excluído com sucesso!",
        severity: "success",
      });
    } catch (error) {
      console.error("Erro ao excluir publicador:", error);
      setSnackbar({
        open: true,
        message: "Erro ao excluir publicador. Tente novamente.",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Cabeçalho */}
      <Box mb={2}>
        <Typography variant="body2" color="text.secondary">
          Páginas / Publicadores
        </Typography>
      </Box>

      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Publicadores
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Consulte seus publicadores
        </Typography>
      </Box>

      {/* Botão Novo */}
      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDrawer(null)}
        >
          Novo Publicador
        </Button>
      </Box>

      {/* Busca */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          placeholder="Buscar por nome, e-mail ou telefone"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {searchTerm && (
                  <IconButton onClick={handleClearSearch} edge="end" size="small">
                    <ClearIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Lista de publicadores estilo cards */}
      <Box display="flex" flexDirection="column" gap={2}>
        {filteredPublicadores.map((pub) => (
          <Card
            key={pub.id_usuario}
            variant="outlined"
            sx={{ borderRadius: 3 }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                {/* Esquerda: Nome + Nível */}
                <Box width="200px">
                  <Typography variant="body1" fontWeight="bold">
                    {pub.nome}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {pub.role === "ADMIN" ? "Administrador" : "Colaborador"}
                  </Typography>
                </Box>

                {/* Meio: E-mail e Telefone */}
                <Box width="200px">
                  <Typography variant="body2">{pub.email}</Typography>
                  <Typography variant="body2">{pub.telefone}</Typography>
                </Box>

                {/* Direita: ação */}
                <Box width="200px" display="flex" justifyContent="end" gap={1}>
                  <IconButton onClick={() => handleOpenDrawer(pub)}>
                    <MoreVertIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeletePublisher(pub.id_usuario)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Drawer */}
      <PublisherFormDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        publicadorData={selectedPublicador}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

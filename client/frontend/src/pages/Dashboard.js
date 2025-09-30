"use client"

import { useState, useEffect } from "react"
import {
  Box,
  TextField,
  Card,
  CardContent,
  Chip,
  Tabs,
  Tab,
  IconButton,
  Typography,
  ThemeProvider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  InputAdornment,
  Stack,
  Pagination
} from "@mui/material"
import { Search as SearchIcon, Filter as FilterIcon } from "lucide-react"
import ClearIcon from "@mui/icons-material/Clear"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import theme from "../config/theme"
import { apiCreateSessionFretebras, apiCreateFrete, apiGetUsers } from "../api/EndpointsApi"
import { useNotification } from "../contexts/NotificationContext" // PASSO 1: Importar o hook

export default function Dashboard() {
  const { showNotification } = useNotification() // PASSO 2: Instanciar o hook

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [selectedFreight, setSelectedFreight] = useState(null)
  const [selectedUserId, setSelectedUserId] = useState("")
  const [aliquota, setAliquota] = useState("")
  const [tabValue, setTabValue] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [publicadores, setPublicadores] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const result = await apiCreateSessionFretebras(currentPage, false)
        console.log("Fretes carregados:", currentPage)
        const freights = result?.data?.loads?.data || []
        const meta = result?.data?.loads?.meta || {}
        setData(freights)
        const totalRegistros = meta.total?.enabled || freights.length
        const registrosPorPagina = 15
        setTotalPages(Math.max(1, Math.ceil(totalRegistros / registrosPorPagina)))
      } catch (error) {
        
        showNotification("Erro ao buscar os fretes da página", "error")
        setData([])
      } finally {
        setLoading(false)
      }
    }

    const fetchPublicadores = async () => {
      try {
        const users = await apiGetUsers()
        setPublicadores(users.data)
      } catch (error) {
        
        showNotification("Erro ao carregar publicadores", "error")
      }
    }

    fetchData()
    fetchPublicadores()
  }, [currentPage]) 

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
    setCurrentPage(1)
  }

  const handleOpenModal = (freight) => {
    setSelectedFreight(freight)
    setSelectedUserId("")
    setAliquota("")
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedFreight(null)
    setSelectedUserId("")
    setAliquota("")
  }

  const handleSearchChange = (event) => setSearchTerm(event.target.value)

  const handleSalvar = async () => {
    if (!selectedFreight) return
    try {
      let rawValue = selectedFreight.price?.value ?? 0
      const valorOriginal = selectedFreight.price?.originalValue ?? rawValue
      const valorUsar = !selectedFreight.price?.originalValue && selectedFreight.price?.editedValue !== undefined
        ? selectedFreight.price.editedValue
        : valorOriginal

      const valorBase = typeof valorUsar === 'string' ? parseFloat(valorUsar.replace(",", ".")) || 0 : Number(valorUsar) || 0
      const valorTotal = aliquota ? valorBase + valorBase * (Number(aliquota) / 100) : valorBase

      const payload = {
        id: selectedFreight.id,
        companyId: selectedFreight.companyId,
        freightCode: selectedFreight.freightCode,
        freightType: selectedFreight.freightType,
        tag: selectedFreight.tag,
        publisher: selectedUserId ? { id: selectedUserId } : null,
        product: selectedFreight.product,
        createdDate: selectedFreight.createdDate,
        route: {
          origin: selectedFreight.route?.origin,
          destination: selectedFreight.route?.destination
        },
        vehicles: selectedFreight.vehicles || [],
        bodyWorks: selectedFreight.bodyWorks || [],
        price: {
          value: valorBase,
          type: selectedFreight.price?.type || "unidade",
          originalValue: selectedFreight.price?.originalValue,
          editedValue: selectedFreight.price?.editedValue
        },
        aliquota: Number(aliquota) || 0,
        valorTotal,
      }

      const response = await apiCreateFrete(payload)
      if (response.success == true) {
        
        showNotification("Frete cadastrado com sucesso!", "success")
      } else {
        
        const errorMessage = response.data?.message || "Erro desconhecido"
        showNotification(`Erro ao cadastrar frete: ${errorMessage}`, "error")
      }
      handleClose()
    } catch (error) {
      console.log("Erro ao salvar carga:", error)
      
      const errorMessage = error.response?.data?.message || error.message || "Erro desconhecido"
      showNotification(`Erro ao salvar carga: ${errorMessage}`, "error")
    }
  }

  const handleChangePage = (event, value) => {
    setCurrentPage(value)
  }

  return (
    <ThemeProvider theme={theme}>
      <Box flexGrow={1} display="flex" flexDirection="column" height="500vh" sx={{ p: 4 }}>
        {/* Cabeçalho */}
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary">Páginas / Fretes</Typography>
        </Box>
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold">Fretes</Typography>
          <Typography variant="body1" color="text.secondary">Consulte suas movimentações de cargas</Typography>
        </Box>

        {/* Busca + Filtro + Paginação */}
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={2}>
          <Box display="flex" gap={1.5} alignItems="center" flexGrow={1}>
            <TextField
              size="small"
              placeholder="Buscar frete"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon size={16} style={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {searchTerm && (
                      <IconButton onClick={() => setSearchTerm("")} size="small">
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
            <IconButton sx={{ border: "1px solid #e0e0e0" }}>
              <FilterIcon size={20} />
            </IconButton>
          </Box>
          <Stack spacing={2} alignItems="center">
            <Pagination count={totalPages} page={currentPage} onChange={handleChangePage} color="primary" />
          </Stack>
        </Box>

        {/* Tabs */}
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Fretes Ativos" sx={{ textTransform: "none" }} />
        </Tabs>

        {/* Conteúdo principal */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
          </Box>
        ) : (
          <Box overflow="auto" p={2} sx={{ maxHeight: "calc(100vh - 300px)" }}>
            {data.length === 0 ? (
              <Typography sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}>
                Nenhum frete encontrado
              </Typography>
            ) : (
              data
                .filter((freight) => {
                  if (!searchTerm) return true
                  const termo = searchTerm.toLowerCase()
                  const valorFrete = typeof freight.price?.value === "string" ? freight.price.value.replace(",", ".") : freight.price?.value ?? 0
                  return (
                    freight.product?.toLowerCase().includes(termo) ||
                    freight.route?.origin?.city?.toLowerCase().includes(termo) ||
                    freight.route?.destination?.city?.toLowerCase().includes(termo) ||
                    freight.freightCode?.toLowerCase().includes(termo) ||
                    String(valorFrete).includes(termo)
                  )
                })
                .slice(0, 15)
                .map((freight) => (
                  <Card key={freight.id} variant="outlined" sx={{ mb: 2, borderRadius: "12px", border: "1px solid #e0e0e0", boxShadow: "none" }}>
                    <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                        <Box flex={1} minWidth={200}>
                          <Typography variant="body2" sx={{color:"#000000", display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                            <strong>Frete Plus</strong>
                            <Chip label="Alta exposição" size="small" sx={{ color:"primary", bgcolor: "#e0e0e0", fontWeight: "bold", fontSize: "0.75rem", border: "none", ml: 1 }} />
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {freight.route?.origin?.city}, {freight.route?.origin?.state}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            {freight.route?.destination?.city}, {freight.route?.destination?.state}
                          </Typography>
                        </Box>
                        <Box flex={1} minWidth={200}>
                          <Typography variant="body1" fontWeight="medium">{freight.product || "Produto não informado"}</Typography>
                          <Typography variant="body1" color="text.secondary">
                            {freight.vehicles?.join(" + ") || "Sem veículo"} | {freight.bodyWorks?.join(" + ") || "Sem carroceria"}
                          </Typography>
                        </Box>
                        <Box flex={1} minWidth={150} textAlign="right">
                          <Typography variant="h6" fontWeight="bold" color="text.primary">
                            R$ {freight.price?.value ?? "0,00"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Por {freight.price?.type || "unidade"}
                          </Typography>
                        </Box>
                        <IconButton onClick={() => handleOpenModal(freight)}>
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))
            )}
          </Box>
        )}

        {/* Modal */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Salvar Carga</DialogTitle>
          <DialogContent>
            {selectedFreight && (
              <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                select
                label="Selecionar Publicador"
                fullWidth
                value={selectedUserId ?? ""}
                onChange={(e) => setSelectedUserId(Number(e.target.value))}
                SelectProps={{ native: true }}
                variant="outlined"
                helperText="Selecione um publicador para vincular à carga"
                InputLabelProps={{ shrink: true }}
                displayEmpty
              >
                <option value="" disabled>
                  Selecione um publicador
                </option>
                {publicadores.map((user, index) => (
                  <option key={index} value={user.id_usuario}>
                    {user.nome} ({user.email})
                  </option>
                ))}
              </TextField>

                <TextField
                  label="Valor da carga (R$)"
                  type="number"
                  fullWidth
                  value={selectedFreight.price?.value ?? selectedFreight.price?.editedValue ?? ""}
                  onChange={(e) => {
                    if (!selectedFreight.price?.value) {
                      const valor = e.target.value;
                      setSelectedFreight({
                        ...selectedFreight,
                        price: {
                          ...selectedFreight.price,
                          editedValue: valor,
                          originalValue: selectedFreight.price?.value ?? undefined,
                          type: selectedFreight.price?.type ?? "unidade",
                        },
                      });
                    }
                  }}
                  disabled={!!selectedFreight.price?.value}
                  helperText={selectedFreight.price?.value ? "Valor não pode ser alterado" : "Informe o valor da carga"}
                />

                <TextField
                  label="Alíquota (%)"
                  type="number"
                  fullWidth
                  value={aliquota}
                  onChange={(e) => setAliquota(e.target.value)}
                />

                <Typography variant="body2">
                  <strong>Valor total com alíquota:</strong>{" "}
                  R${" "}
                  {(() => {
                    const rawValue = selectedFreight.price?.value ?? selectedFreight.price?.editedValue ?? 0
                    const valorBase = typeof rawValue === "string" ? parseFloat(rawValue.replace(",", ".")) || 0 : Number(rawValue) || 0
                    return (aliquota ? valorBase + valorBase * (Number(aliquota) / 100) : valorBase).toFixed(2)
                  })()}
                </Typography>

                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button onClick={handleClose} color="inherit">Cancelar</Button>
                  <Button onClick={handleSalvar} variant="contained" color="primary">Salvar</Button>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* PASSO 4: O componente Snackbar foi completamente REMOVIDO daqui */}

      </Box>
    </ThemeProvider>
  )
}
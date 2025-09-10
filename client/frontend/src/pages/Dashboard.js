"use client"

import {
  Search as SearchIcon,
  Filter as FilterIcon,
} from "lucide-react"
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
  AppBar,
  Toolbar,
  ThemeProvider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Menu,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button
} from "@mui/material"

import theme from "../config/theme"
import { useState, useEffect } from "react"
import { apiCreateSessionFretebras, apiGetTruckersFretebras } from "../api/EndpointsApi"

export default function Dashboard() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [truckers, setTruckers] = useState([])
  const [selectedFreight, setSelectedFreight] = useState(null)
  const [truckersLoading, setTruckersLoading] = useState(false)
  const [selectedTrucker, setSelectedTrucker] = useState('') // Estado para o motorista selecionado

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiCreateSessionFretebras()
        console.log("📦 Retorno da API:", result)
        const freights = result?.data?.loads?.data || []
        setData(freights)
      } catch (error) {
        console.error("Erro ao criar sessão:", error)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleOpenTruckers = async (freightId) => {
    setOpen(true)
    setTruckersLoading(true)
    setSelectedFreight(freightId)

    try {
      const result = await apiGetTruckersFretebras(freightId)
      console.log("🚚 Motoristas da carga:", result)
      // Ajuste para acessar o array correto de motoristas
      const truckersData = result?.data?.truckers?.data || []
      setTruckers(truckersData)
    } catch (error) {
      console.error("Erro ao buscar motoristas:", error)
      setTruckers([])
    } finally {
      setTruckersLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setTruckers([])
    setSelectedFreight(null)
    setSelectedTrucker('')
  }

  const handleTruckerChange = (event) => {
    setSelectedTrucker(event.target.value)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <Box flexGrow={1} display="flex" flexDirection="column" height="100vh">
        {/* Header */}
        <AppBar
          position="static"
          elevation={0}
          sx={{ bgcolor: "background.paper", borderBottom: 1, borderColor: "divider" }}
        >
          <Toolbar sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Box display="flex" width="100%" gap={2} my={2}>
              <TextField
                size="small"
                placeholder="Buscar frete"
                fullWidth
                InputProps={{
                  startAdornment: <SearchIcon size={16} style={{ marginRight: 8, color: theme.palette.text.secondary }} />,
                }}
              />
              <IconButton>
                <FilterIcon size={20} />
              </IconButton>
            </Box>
            <Tabs value={0} textColor="primary" indicatorColor="primary">
              <Tab label={`Ativos: ${data.length}`} />
              <Tab label="Agendados" />
              <Tab label="Desativados: 8" />
            </Tabs>
          </Toolbar>
        </AppBar>

        {/* Conteúdo principal */}
        <Box flexGrow={1} overflow="auto" p={3}>
          {data.length === 0 ? (
            <Typography>Nenhum frete encontrado</Typography>
          ) : (
            data.map((freight) => (
              <Card
                key={freight.id}
                variant="outlined"
                sx={{ mb: 2, "&:hover": { boxShadow: 3 } }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box flexGrow={1}>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Typography variant="subtitle2" color="primary">
                          {`Frete ${freight.freightType}` || "N/A"}
                        </Typography>
                        <Chip
                          label={
                            freight.situation === 1
                              ? "Ativo"
                              : freight.situation === 0
                              ? "Inativo"
                              : "Desconhecido"
                          }
                          color={freight.situation === 1 ? "success" : "default"}
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4}>
                        <Box>
                          <Typography variant="body2" fontWeight="medium" color="text.primary">
                            {freight.route?.origin?.city}, {freight.route?.origin?.state}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {freight.route?.destination?.city}, {freight.route?.destination?.state}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight="medium" color="text.primary">
                            {freight.product || "Produto não informado"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {freight.vehicles?.join(" + ") || "Sem veículo"} |{" "}
                            {freight.bodyWorks?.join(" + ") || "Sem carroceria"}
                          </Typography>
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="h6" color="text.primary">
                            R$ {freight.price?.value || "0,00"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Por {freight.price?.type || "unidade"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <IconButton onClick={() => handleOpenTruckers(freight.id)}>
                      <Typography variant="h6">⋮</Typography>
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>

        {/* Modal com dropdown de motoristas */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Motoristas do Frete {selectedFreight}</DialogTitle>
          <DialogContent>
            {truckersLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : truckers.length === 0 ? (
              <Typography>Nenhum motorista encontrado</Typography>
            ) : (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="trucker-select-label">Selecione um motorista</InputLabel>
                <Select
                  labelId="trucker-select-label"
                  id="trucker-select"
                  value={selectedTrucker}
                  label="Selecione um motorista"
                  onChange={handleTruckerChange}
                >
                  <MenuItem value="">
                    <em>Selecione um motorista</em>
                  </MenuItem>
                  {truckers.map((trucker) => (
                    <MenuItem key={trucker.person?.id || trucker.id} value={trucker.person?.id || trucker.id}>
                      {`${trucker.person?.name || trucker.name} - ${trucker.person?.whereIs || `${trucker.originCity}, ${trucker.originState}`}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            
            {/* Informações adicionais do motorista selecionado */}
            {selectedTrucker && (
              <Box sx={{ mt: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Informações do Motorista
                </Typography>
                {truckers
                  .filter(trucker => (trucker.person?.id || trucker.id) === selectedTrucker)
                  .map((trucker) => (
                    <Box key={trucker.person?.id || trucker.id}>
                      <Typography variant="body2">
                        <strong>Nome:</strong> {trucker.person?.name || trucker.name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Localização:</strong> {trucker.person?.whereIs || `${trucker.originCity}, ${trucker.originState}`}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Veículo:</strong> {trucker.vehicle?.typeName} - {trucker.vehicle?.bodyName}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Destino:</strong> {trucker.destination}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Última localização:</strong> {trucker.lastLocation?.date}
                      </Typography>
                      <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mt: 1}}>
                        <Typography variant="body2">
                        <strong>Entrar em contato</strong>
                        </Typography>
                        <Button sx={{backgroundColor:'green'}}>WhatsApp</Button>
                      </Box>
                    </Box>
                  ))}
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  )
}
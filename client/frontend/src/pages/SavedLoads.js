// frontend/SavedLoads.js
"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  IconButton,
  Stack,
  Pagination,
  MenuItem,
  Button,
  Grid,
  Chip,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  InputAdornment,
  DialogContentText,
  Avatar,
} from "@mui/material"
import { useTheme } from '@mui/material/styles'
import { Search as SearchIcon, Filter as FilterIcon } from "lucide-react"
import ClearIcon from "@mui/icons-material/Clear"
import MoreVertIcon from '@mui/icons-material/MoreVert'
import theme from "../config/theme"
// Importe a nova função de API aqui
import { apiGetAllFretes, apiGetTruckersFretebras, apiSendMessageToTrucker } from "../api/EndpointsApi" 
import { useNotification } from "../contexts/NotificationContext"

const PAGE_SIZE = 15

// Status chip component using theme
const StatusChip = ({ status }) => {
  const muiTheme = useTheme()
  const statusConfig = {
    A: { label: 'Aguardando Motorista', paletteColor: 'warning', bg: '#fff8e1' },
    S: { label: 'Motorista Selecionado', paletteColor: 'success', bg: '#e8f5e9' },
    C: { label: 'Carga Concluída', paletteColor: 'info', bg: '#e3f2fd' },
    X: { label: 'Cancelado', paletteColor: 'error', bg: '#ffebee' },
  }
  const config = statusConfig[status] || { label: 'Desconhecido', paletteColor: 'grey', bg: '#f5f5f5' }
  const color = muiTheme.palette[config.paletteColor]?.main || muiTheme.palette.text.primary

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        bgcolor: config.bg,
        color,
        fontWeight: 700,
        fontSize: '0.75rem',
        borderRadius: 999,
        height: 28,
        px: 1.2,
      }}
    />
  )
}

export default function SavedLoads() {
  const { showNotification } = useNotification()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedFreight, setSelectedFreight] = useState(null)

  const [isModalWhatsAppOpen, setIsModalWhatsAppOpen] = useState(false)
  const [selectedDrivers, setSelectedDrivers] = useState([])

  const [fretebrasDrivers, setFretebrasDrivers] = useState([])
  const [loadingDrivers, setLoadingDrivers] = useState(false)

  const [isModalStatusOpen, setIsModalStatusOpen] = useState(false)
  const [newStatus, setNewStatus] = useState('')

  const [isWhatsappPreviewOpen, setIsWhatsappPreviewOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await apiGetAllFretes()
        const fretes = response.data?.fretes || []
        const mapped = fretes.map(f => ({
          id: f.id_fretebras,
          codigo_frete: f.codigo_frete,
          data_criacao: f.data_criacao,
          product: f.produto,
          status: f.status,
          valorTotal: f.valorTotal,
          rotas: f.rotas || [],
          veiculos: (f.veiculos || []).map(v => v.nome),
          carrocerias: (f.carrocerias || []).map(c => c.nome),
          precos: f.precos || [],
          tag: f.tag || ''
        }))
        if (!mounted) return
        setData(mapped)
      } catch (error) {
        showNotification("Erro ao carregar fretes salvos", "error")
        setData([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchData()
    return () => { mounted = false }
  }, [])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }

  const handleChangePage = (event, value) => setCurrentPage(value)

  const handleMenuOpen = (event, freight) => {
    setAnchorEl(event.currentTarget)
    setSelectedFreight(freight)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const clearSelection = () => {
    setSelectedFreight(null)
    setAnchorEl(null)
    setSelectedDrivers([])
    setFretebrasDrivers([])
  }

  const handleOpenWhatsAppModal = async () => {
    if (!selectedFreight) return
    setIsModalWhatsAppOpen(true)
    setLoadingDrivers(true)
    handleMenuClose() 
    
    try {
      const response = await apiGetTruckersFretebras(selectedFreight.id)
      const truckers = response.data?.truckers?.data?.map(t => ({
        id: t.person.id,
        name: t.person.name,
        location: t.person.whereIs || '',
        vehicle: t.vehicle?.bodyName || 'N/A',
        selfie: t.person.selfieUri,
        type: t.vehicle?.typeName || 'N/A',
      })) || []

      setFretebrasDrivers(truckers)
    } catch (error) {
      console.error("Erro ao buscar motoristas:", error)
      showNotification("Erro ao carregar motoristas para este frete.", "error")
      setFretebrasDrivers([])
    } finally {
      setLoadingDrivers(false)
    }
  }

  const handleCloseWhatsAppModal = () => {
    setIsModalWhatsAppOpen(false)
    clearSelection()
  }

  const handleDriverToggle = (driverId) => {
    setSelectedDrivers(prev => {
      const exists = prev.indexOf(driverId) !== -1
      if (exists) return prev.filter(id => id !== driverId)
      return [...prev, driverId]
    })
  }

  const handleOpenWhatsappPreview = () => {
    if (selectedDrivers.length === 0) {
      showNotification("Selecione ao menos um motorista.", "warning")
      return
    }
    setIsModalWhatsAppOpen(false)
    setIsWhatsappPreviewOpen(true)
  }

  const handleCloseWhatsappPreview = () => {
    setIsWhatsappPreviewOpen(false)
    clearSelection()
  }

  const handleConfirmSend = async () => {
    if (!selectedFreight || selectedDrivers.length === 0) {
      showNotification("Nenhum frete ou motorista selecionado.", "error");
      return;
    }

    try {
      const result = await apiSendMessageToTrucker(
        selectedFreight.id,
        selectedDrivers,
      );
      console.log("freightId:", selectedFreight.id, "truckerIds:", selectedDrivers, "result:", result);
      if (result.success) {
        showNotification('Mensagem enviada com sucesso!', 'success');
      } else {
        showNotification(`Erro: ${result.message}`, 'error');
      }
    } catch (error) {
      console.error('Erro ao chamar a API de envio de mensagens:', error);
      showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
    } finally {
      handleCloseWhatsappPreview();
    }
  };
  const handleOpenStatusModal = () => {
    if (!selectedFreight) return
    setIsModalStatusOpen(true)
    setNewStatus(selectedFreight?.status || '')
    handleMenuClose()
  }
  const handleCloseStatusModal = () => {
    setIsModalStatusOpen(false)
    setNewStatus('')
    clearSelection()
  }
  const handleSaveStatus = () => {
    if (!selectedFreight) return
    setData(prev => prev.map(p => p.id === selectedFreight.id ? { ...p, status: newStatus } : p))
    showNotification("Status atualizado com sucesso!", "success")
    handleCloseStatusModal()
  }

  const generateMessageContent = (freight) => {
    if (!freight) return null;
    const { product, rotas = [], veiculos = [], carrocerias = [], valorTotal = 0, tag } = freight;
    const origem = `${rotas[0]?.cidade_origem || '-'} / ${rotas[0]?.estado_origem || '-'}`;
    const destino = `${rotas[0]?.cidade_destino || '-'} / ${rotas[0]?.estado_destino || '-'}`;
    const precoTexto = `R$ ${(Number(valorTotal) || 0).toFixed(2)}`;
    const detalhesLink = tag ? `https://fretebras.com.br/${tag}` : 'N/A';

    return (
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>CARGAS RS LOG</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Olá, tudo bem?{"\n"}
          Nova oportunidade de frete disponível:
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2">📍 Origem: {origem}</Typography>
          <Typography variant="body2">📍 Destino: {destino}</Typography>
          <Typography variant="body2">🚚 Veículo: {veiculos.join(" + ") || 'Não informado'}</Typography>
          <Typography variant="body2">🚛 Carroceria: {carrocerias.join(" + ") || 'Não informado'}</Typography>
          <Typography variant="body2">📦 Produto: {product || 'Não informado'}</Typography>
          <Typography variant="body2">💰 Preço: {precoTexto}</Typography>
          {tag && <Typography variant="body2">🔗 Detalhes: {detalhesLink}</Typography>}
        </Box>
      </Box>
    );
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data
    const termo = searchTerm.toLowerCase()
    return data.filter(f => {
      const productMatch = f.product?.toLowerCase().includes(termo)
      const routeMatch = (f.rotas || []).some(r =>
        (r.cidade_origem || '').toLowerCase().includes(termo) ||
        (r.cidade_destino || '').toLowerCase().includes(termo)
      )
      return productMatch || routeMatch
    })
  }, [data, searchTerm])

  const pageCount = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE))
  const visibleItems = filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <Box flexGrow={1} display="flex" flexDirection="column" sx={{ p: { xs: 2, md: 4 } }}>
      <Box mb={2}>
        <Typography variant="body2" color="text.secondary">Páginas / Fretes Salvos</Typography>
      </Box>

      <Box mb={3}>
        <Typography variant="h4" fontWeight="bold">Fretes Salvos</Typography>
        <Typography variant="body1" color="text.secondary">Gerencie suas cargas cadastradas no sistema</Typography>
      </Box>

      {/* Busca + Paginação */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={2}>
        <Box display="flex" gap={1.5} alignItems="center" flexGrow={1}>
          <TextField
            size="small"
            placeholder="Buscar por produto ou cidade..."
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
                    <IconButton onClick={() => setSearchTerm("")} size="small" aria-label="limpar busca">
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
          <IconButton sx={{ border: "1px solid #e0e0e0" }} aria-label="filtros">
            <FilterIcon size={20} />
          </IconButton>
        </Box>

        <Stack spacing={2} alignItems="center">
          <Pagination count={pageCount} page={currentPage} onChange={handleChangePage} color="primary" />
        </Stack>
      </Box>

      {/* Lista de cargas */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="40vh">
          <CircularProgress />
        </Box>
      ) : (
        <Box overflow="auto" paddingTop={2} paddingRight={2} sx={{ maxHeight: "calc(100vh - 300px)" }}>
          {visibleItems.length === 0 ? (
            <Typography sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}>
              Nenhum frete encontrado.
            </Typography>
          ) : (
            visibleItems.map(freight => (
              <Card key={freight.id} variant="outlined" sx={{ mb: 2, borderRadius: "12px", border: "1px solid #e9e9e9", boxShadow: 'none' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" mb={1} gap={1}>
                      <Typography variant="body2" sx={{ color: '#000', fontWeight: 700 }}>Frete Salvo</Typography>
                      <StatusChip status={freight.status} />
                    </Box>
                    <Typography variant="body1" fontWeight="600">{freight.rotas?.[0]?.cidade_origem || '-'}, {freight.rotas?.[0]?.estado_origem || '-'}</Typography>
                    <Typography variant="body2" color="text.secondary">{freight.rotas?.[0]?.cidade_destino || '-'}, {freight.rotas?.[0]?.estado_destino || '-'}</Typography>
                    <Typography variant="body2" color="text.secondary">Código da carga: <strong>{freight.id}</strong></Typography>
                  </Box>

                  <Box flex={1}>
                    <Typography variant="body1" fontWeight={600}>{freight.product || "Produto não informado"}</Typography>
                    <Typography variant="body2" color="text.secondary">{freight.veiculos.join(" + ") || "Sem veículo"} | {freight.carrocerias.join(" + ") || "Sem carroceria"}</Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2}>
                    <Box textAlign="right">
                      <Typography variant="h6" fontWeight="bold" color="text.primary">R$ {Number(freight.valorTotal || 0).toFixed(2)}</Typography>
                      <Typography variant="body2" color="text.secondary">Valor total</Typography>
                    </Box>

                    <IconButton aria-label="actions" onClick={(e) => handleMenuOpen(e, freight)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}

      {/* Menu de Ações */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { handleOpenWhatsAppModal(); }}>Enviar por WhatsApp</MenuItem>
        <MenuItem onClick={() => { handleOpenStatusModal(); }}>Alterar Status</MenuItem>
        <MenuItem onClick={() => { /* implementar edição */ handleMenuClose(); }}>Editar Carga</MenuItem>
        <MenuItem onClick={() => { /* implementar exclusão */ handleMenuClose(); }} sx={{ color: 'error.main' }}>Excluir</MenuItem>
      </Menu>

      {/* Modal WhatsApp - Seleção de Motoristas */}
      <Dialog open={isModalWhatsAppOpen} onClose={handleCloseWhatsAppModal} fullWidth maxWidth="xs">
        <DialogTitle>Enviar Frete por WhatsApp</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>Selecione os motoristas para quem deseja enviar os detalhes deste frete.</Typography>
          {loadingDrivers ? (
            <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
          ) : fretebrasDrivers.length > 0 ? (
            <List>
              {fretebrasDrivers.map((driver) => (
                <ListItem key={driver.id} dense disablePadding secondaryAction={null} sx={{ cursor: 'pointer' }}>
                  <ListItemIcon>
                    <Checkbox edge="start" checked={selectedDrivers.indexOf(driver.id) !== -1} tabIndex={-1} disableRipple onChange={() => handleDriverToggle(driver.id)} />
                  </ListItemIcon>
                  <Avatar src={driver.selfie || '/default-profile.png'} alt={driver.name} sx={{ width: 40, height: 40, mr: 2 }} />
                  <ListItemText primary={driver.name} secondary={driver.location} />
                  <Box sx={{ ml: 2, textAlign: 'right' }}>
                    <Typography variant="body2">{driver.vehicle}</Typography>
                    <Typography variant="caption" color="text.secondary">{driver.type}</Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>Nenhum motorista encontrado para este frete.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWhatsAppModal}>Cancelar</Button>
          <Button onClick={handleOpenWhatsappPreview} variant="contained" color="primary" disabled={selectedDrivers.length === 0}>Próximo</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Pré-visualização do WhatsApp */}
      <Dialog open={isWhatsappPreviewOpen} onClose={handleCloseWhatsappPreview} fullWidth maxWidth="sm">
        <DialogTitle>Visualizar Mensagem</DialogTitle>
        <DialogContent>
          <DialogContentText color="text.secondary">A mensagem a seguir será enviada para o(s) motorista(s) selecionado(s).</DialogContentText>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Card variant="outlined" sx={{ p: 2, bgcolor: '#F7FFEE', borderRadius: 2, maxWidth: 520 }}>
              {selectedFreight ? generateMessageContent(selectedFreight) : null}
              <Box display="flex" justifyContent="flex-end" mt={1}>
                <Typography variant="caption" color="text.secondary">
                  {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} ✓
                </Typography>
              </Box>
            </Card>
          </Box>
          <Box display="flex" justifyContent="center" mt={3}>
            <Typography variant="body2" color="text.secondary">
              {selectedDrivers.map(id => {
                const driver = fretebrasDrivers.find(d => d.id === id)
                return driver ? driver.name : ''
              }).join(', ')}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWhatsappPreview}>Cancelar</Button>
          <Button onClick={handleConfirmSend} variant="contained" color="primary">Enviar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Alterar Status */}
      <Dialog open={isModalStatusOpen} onClose={handleCloseStatusModal} fullWidth maxWidth="xs">
        <DialogTitle>Alterar Status do Frete</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
          >
            <MenuItem value="A">Aguardando Motorista</MenuItem>
            <MenuItem value="S">Motorista Selecionado</MenuItem>
            <MenuItem value="C">Carga Concluída</MenuItem>
            <MenuItem value="X">Cancelado</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusModal}>Cancelar</Button>
          <Button onClick={handleSaveStatus} variant="contained" color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
"use client"

import {
  Search as SearchIcon,
  Filter as FilterIcon,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { apiLogout } from "../api/EndpointsApi"
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Chip,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Typography,
  AppBar,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
} from "@mui/material"

const freightData = [
  {
    id: 1,
    type: "Frete Plus",
    status: "Alta exposição",
    origin: "Lucas do Rio Verde, MT",
    destination: "Botucatu, SP",
    cargo: "Carrego de Algodão - J - BOFE",
    vehicle: "Carreta LS +2 | Graneleiro +1",
    price: "R$ 370,00",
    unit: "Por tonelada",
  },
  {
    id: 2,
    type: "Frete Plus",
    status: "Alta exposição",
    origin: "Ipiranga do Norte, MT",
    destination: "Botucatu, SP",
    cargo: "Carrego de Algodão - J - BOFE",
    vehicle: "Carreta LS +2 | Graneleiro +1",
    price: "R$ 370,00",
    unit: "Por tonelada",
  },
  {
    id: 3,
    type: "Frete Plus",
    status: "Alta exposição",
    origin: "Lucas do Rio Verde, MT",
    destination: "Patrocínio, MG",
    cargo: "Carrego de Algodão - J - C D F",
    vehicle: "Carreta LS +3 | Graneleiro +1",
    price: "R$ 320,00",
    unit: "Por tonelada",
  },
  {
    id: 4,
    type: "Frete Plus",
    status: "Alta exposição",
    origin: "Sorriso, MT",
    destination: "Patrocínio, MG",
    cargo: "Carrego de Algodão - J - C D F",
    vehicle: "Carreta LS +3 | Graneleiro +1",
    price: "R$ 320,00",
    unit: "Por tonelada",
  },
  {
    id: 5,
    type: "Frete Plus",
    status: "Alta exposição",
    origin: "Sinop, MT",
    destination: "Patrocínio, MG",
    cargo: "Carrego de Algodão - J - C D F",
    vehicle: "Carreta LS +3 | Graneleiro +1",
    price: "R$ 320,00",
    unit: "Por tonelada",
  },
  {
    id: 6,
    type: "Frete Plus",
    status: "Alta exposição",
    origin: "Ipiranga do Norte, MT",
    destination: "Patrocínio, MG",
    cargo: "Carrego de Algodão - J - C D F",
    vehicle: "Carreta LS +3 | Graneleiro +1",
    price: "R$ 320,00",
    unit: "Por tonelada",
  },
]

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiLogout();
      navigate("/login", { replace: true });
    }
    catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  }

  return (
    <Box display="flex" height="100vh" bgcolor="grey.50">
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: "border-box",
            bgcolor: "grey.900",
            color: "white",
          },
        }}
      >
        <Toolbar>
          <Box display="flex" alignItems="center" gap={1}>
            <BarChart3 size={22} />
            <Typography variant="h6" fontWeight="bold">
              FR Prime
            </Typography>
          </Box>
        </Toolbar>
        <Divider />
        <List>
          <ListItemButton selected>
            <ListItemIcon>
              <BarChart3 size={20} color="white" />
            </ListItemIcon>
            <ListItemText primary="Fretes" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <Settings size={20} color="white" />
            </ListItemIcon>
            <ListItemText primary="Gestão" />
          </ListItemButton>
        </List>
        <Box flexGrow={1} />
        <Divider />
        <List>
          <ListItemButton
            onClick={handleLogout}
            >
            <ListItemIcon>
              <LogOut size={20} color="red" />
            </ListItemIcon>
            <ListItemText
              primary="Sair do sistema"
              primaryTypographyProps={{ color: "error" }}
            />
          </ListItemButton>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box flexGrow={1} display="flex" flexDirection="column">
        {/* Header */}
        <AppBar
          position="static"
          elevation={0}
          sx={{ bgcolor: "white", borderBottom: 1, borderColor: "grey.200" }}
        >
          <Toolbar sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Box display="flex" width="100%" gap={2} mb={2}>
              <TextField
                size="small"
                placeholder="Buscar frete"
                fullWidth
                InputProps={{
                  startAdornment: <SearchIcon size={16} style={{ marginRight: 8, color: "#9CA3AF" }} />,
                }}
              />
              <IconButton>
                <FilterIcon size={20} />
              </IconButton>
            </Box>
            <Tabs value={0} textColor="inherit">
              <Tab
                label="Ativos: 39"
                sx={{ borderBottom: 2, borderColor: "black", fontWeight: "bold" }}
              />
              <Tab label="Agendados" />
              <Tab label="Desativados: 8" />
            </Tabs>
          </Toolbar>
        </AppBar>

        {/* Freight Listings */}
        <Box flexGrow={1} overflow="auto" p={3}>
          {freightData.map((freight) => (
            <Card
              key={freight.id}
              variant="outlined"
              sx={{ mb: 2, "&:hover": { boxShadow: 2, transition: "0.3s" } }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box flexGrow={1}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Typography variant="subtitle2">{freight.type}</Typography>
                      <Chip
                        label={freight.status}
                        color="success"
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                    <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4}>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {freight.origin}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {freight.destination}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {freight.cargo}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {freight.vehicle}
                        </Typography>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="h6">{freight.price}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {freight.unit}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <IconButton>
                    <Typography variant="h6">⋮</Typography>
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

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
} from "@mui/material"
import theme from "../config/theme"

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
]

export default function Dashboard() {
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
              <Tab label="Ativos: 39" />
              <Tab label="Agendados" />
              <Tab label="Desativados: 8" />
            </Tabs>
          </Toolbar>
        </AppBar>

        {/* Conteúdo principal */}
        <Box flexGrow={1} overflow="auto" p={3}>
          {freightData.map((freight) => (
            <Card
              key={freight.id}
              variant="outlined"
              sx={{ mb: 2, "&:hover": { boxShadow: 3 } }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box flexGrow={1}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Typography variant="subtitle2" color="primary">{freight.type}</Typography>
                      <Chip
                        label={freight.status}
                        color="success"
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                    <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4}>
                      <Box>
                        <Typography variant="body2" fontWeight="medium" color="text.primary">
                          {freight.origin}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {freight.destination}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight="medium" color="text.primary">
                          {freight.cargo}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {freight.vehicle}
                        </Typography>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="h6" color="text.primary">{freight.price}</Typography>
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
    </ThemeProvider>
  )
}
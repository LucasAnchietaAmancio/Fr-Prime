import {
  BarChart3,
  Settings,
  LogOut
} from "lucide-react"
import {
  Box,
  Divider,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Typography
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import theme from "../config/theme"
import { apiLogout } from "../api/EndpointsApi"

export default function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await apiLogout()
      navigate("/login", { replace: true })
    } catch (err) {
      console.error("Erro ao fazer logout:", err)
    }
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: "border-box",
          bgcolor: "primary.main",
          color: "primary.contrastText",
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
      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />

      <List>
        <ListItemButton onClick={() => navigate("/dashboard")}>
          <ListItemIcon>
            <BarChart3 size={20} color="white"/>
          </ListItemIcon>
          <ListItemText primary="Fretes" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/gestao")}>
          <ListItemIcon>
            <Settings size={20} color="white" />
          </ListItemIcon>
          <ListItemText primary="Gestão" />
        </ListItemButton>
      </List>

      <Box flexGrow={1} />
      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />

      <List>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <LogOut size={20} color={theme.palette.error.main} />
          </ListItemIcon>
          <ListItemText
            primary="Sair do sistema"
            primaryTypographyProps={{ color: "error" }}
          />
        </ListItemButton>
      </List>
    </Drawer>
  )
}

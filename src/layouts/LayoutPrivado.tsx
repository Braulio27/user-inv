'use client'

import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemButton, 
  ListItemIcon,
  Avatar,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material'
import GroupIcon from '@mui/icons-material/Group';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const drawerWidth = 240

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, href: '/' },
  { text: 'Usuarios', icon: <GroupIcon />, href: '/users' },
  { text: 'Configuración', icon: <SettingsApplicationsIcon />, href: '/config' },
]

export default function LayoutPrivado({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const handleLogout = () => {
        // TODO: Implementar logout
        alert('Cerrar sesión')
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6" noWrap>
                        Sistema de Inventario de Usuarios
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                            A
                        </Avatar>
                        <Tooltip title="Cerrar sesión">
                            <IconButton color="inherit" onClick={handleLogout}>
                                <LogoutIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton 
                                    component={Link} 
                                    href={item.href}
                                    selected={pathname === item.href}
                                    sx={{
                                        '&.Mui-selected': {
                                            backgroundColor: 'primary.light',
                                            '&:hover': {
                                                backgroundColor: 'primary.light',
                                            }
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ color: pathname === item.href ? 'primary.main' : 'inherit' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={item.text} 
                                        sx={{ 
                                            color: pathname === item.href ? 'primary.main' : 'inherit',
                                            fontWeight: pathname === item.href ? 'bold' : 'normal'
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                            Versión 1.0.0
                        </Typography>
                    </Box>
                </Box>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {children}
            </Box>
        </Box>
    )
}

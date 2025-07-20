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
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material'
import GroupIcon from '@mui/icons-material/Group';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const drawerWidth = 240

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, href: '/' },
  { text: 'Usuarios', icon: <GroupIcon />, href: '/users' },
  { text: 'Configuración', icon: <SettingsApplicationsIcon />, href: '/config' },
]

export default function LayoutPrivado({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const handleLogout = () => {
        // TODO: Implementar logout
        alert('Cerrar sesión')
    }

    const drawer = (
        <Box sx={{ overflow: 'auto' }}>
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton 
                            component={Link} 
                            href={item.href}
                            selected={pathname === item.href}
                            onClick={() => isMobile && setMobileOpen(false)}
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
    )

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{ 
                    width: { md: `calc(100% - ${drawerWidth}px)` }, 
                    ml: { md: `${drawerWidth}px` },
                    zIndex: theme.zIndex.drawer + 1
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            color="inherit"
                            aria-label="abrir menú"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            Sistema de Inventario de Usuarios
                        </Typography>
                    </Box>
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

            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
            >
                {/* Drawer móvil */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Mejor performance en móviles
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { 
                            boxSizing: 'border-box', 
                            width: drawerWidth 
                        },
                    }}
                >
                    <Toolbar />
                    {drawer}
                </Drawer>

                {/* Drawer desktop */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { 
                            boxSizing: 'border-box', 
                            width: drawerWidth 
                        },
                    }}
                    open
                >
                    <Toolbar />
                    {drawer}
                </Drawer>
            </Box>

            <Box 
                component="main" 
                sx={{ 
                    flexGrow: 1, 
                    p: 3,
                    width: { md: `calc(100% - ${drawerWidth}px)` }
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    )
}

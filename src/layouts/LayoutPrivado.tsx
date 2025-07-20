'use client'

import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, ListItemButton, ListItemIcon } from '@mui/material'
import GroupIcon from '@mui/icons-material/Group';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import Link from 'next/link'

const drawerWidth = 240

export default function LayoutPrivado({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        Panel de Administración
                    </Typography>
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
                <List>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="/">
                            <ListItemIcon>
                                <GroupIcon />
                            </ListItemIcon>
                            <ListItemText primary="Usuarios" />
                        </ListItemButton>

                    </ListItem>
                    <ListItem disablePadding>

                        <ListItemButton component={Link} href="/">
                            <ListItemIcon>
                                <SettingsApplicationsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Configuracion" />
                        </ListItemButton>
                    </ListItem>
                    {/* Puedes agregar más menús aquí */}
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {children}
            </Box>
        </Box>
    )
}

'use client'

import LayoutPrivado from '@/layouts/LayoutPrivado'
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider
} from '@mui/material'
import ConstructionIcon from '@mui/icons-material/Construction'
import LanguageIcon from '@mui/icons-material/Language'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SecurityIcon from '@mui/icons-material/Security'
import StorageIcon from '@mui/icons-material/Storage'

export default function ConfigPage() {
  const upcomingFeatures = [
    {
      title: 'Cambio de Idioma',
      description: 'Soporte para múltiples idiomas (Español, Inglés)',
      icon: <LanguageIcon />,
      status: 'Pendiente'
    },
    {
      title: 'Modo Nocturno',
      description: 'Tema oscuro para mejor experiencia visual',
      icon: <DarkModeIcon />,
      status: 'Pendiente'
    },
    {
      title: 'Notificaciones',
      description: 'Sistema de alertas y notificaciones en tiempo real',
      icon: <NotificationsIcon />,
      status: 'Pendiente'
    },
    {
      title: 'Configuración de Seguridad',
      description: 'Gestión de permisos y políticas de seguridad',
      icon: <SecurityIcon />,
      status: 'Pendiente'
    },
    {
      title: 'Backup y Restauración',
      description: 'Configuración de respaldos automáticos',
      icon: <StorageIcon />,
      status: 'Pendiente'
    }
  ]

  return (
    <LayoutPrivado>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Configuración del Sistema
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardHeader
          avatar={<ConstructionIcon sx={{ fontSize: 40, color: 'warning.main' }} />}
          title="Funcionalidad en Construcción"
          subheader="Esta sección está siendo desarrollada"
        />
        <CardContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            La página de configuración está actualmente en desarrollo. Aquí podrás gestionar 
            todas las opciones del sistema una vez que esté completamente implementada.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Mientras tanto, puedes continuar utilizando las funcionalidades de gestión de usuarios 
            y el dashboard que ya están disponibles.
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Próximas Funcionalidades" />
        <CardContent>
          <List>
            {upcomingFeatures.map((feature, index) => (
              <Box key={feature.title}>
                <ListItem>
                  <ListItemIcon sx={{ color: 'primary.main' }}>
                    {feature.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={feature.title}
                    secondary={feature.description}
                  />
                  <Chip 
                    label={feature.status} 
                    color="warning" 
                    size="small"
                    variant="outlined"
                  />
                </ListItem>
                {index < upcomingFeatures.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>
    </LayoutPrivado>
  )
} 
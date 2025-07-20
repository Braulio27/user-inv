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
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material'
import { mockUsers } from '@/data/users'
import GroupIcon from '@mui/icons-material/Group'
import ComputerIcon from '@mui/icons-material/Computer'
import WarningIcon from '@mui/icons-material/Warning'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export default function DashboardPage() {
  const totalUsers = mockUsers.length
  const activeUsers = mockUsers.filter(user => user.estadoUsuario === 'Activo').length
  const activeEquipment = mockUsers.filter(user => user.estadoEquipo === 'Activo').length
  const repairEquipment = mockUsers.filter(user => user.estadoEquipo === 'En reparación').length

  const recentUsers = mockUsers.slice(0, 5)

  return (
    <LayoutPrivado>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
        gap: 3, 
        mb: 4 
      }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <GroupIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">{totalUsers}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total de Usuarios
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">{activeUsers}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Usuarios Activos
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <ComputerIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">{activeEquipment}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Equipos Activos
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <WarningIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">{repairEquipment}</Typography>
                <Typography variant="body2" color="text.secondary">
                  En Reparación
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
        gap: 3 
      }}>
        <Card>
          <CardHeader title="Usuarios Recientes" />
          <CardContent>
            <List>
              {recentUsers.map((user) => (
                <ListItem key={user.numeroEmpleado} divider>
                  <ListItemIcon>
                    <GroupIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={user.nombreCompleto}
                    secondary={`${user.departamento} • ${user.puesto}`}
                  />
                  <Chip 
                    label={user.estadoUsuario} 
                    color={user.estadoUsuario === 'Activo' ? 'success' : 'error'}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Resumen por Departamento" />
          <CardContent>
            <List>
              {Array.from(new Set(mockUsers.map(user => user.departamento))).map((dept) => {
                const count = mockUsers.filter(user => user.departamento === dept).length
                return (
                  <ListItem key={dept} divider>
                    <ListItemText
                      primary={dept}
                      secondary={`${count} usuario${count !== 1 ? 's' : ''}`}
                    />
                    <Chip label={count} color="primary" size="small" />
                  </ListItem>
                )
              })}
            </List>
          </CardContent>
        </Card>
      </Box>
    </LayoutPrivado>
  )
}

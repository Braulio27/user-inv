'use client'

import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Collapse,
  Divider,
  Chip,
  Stack,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { useState } from 'react'
import { UserData } from '@/types/user'
import ConfirmDialog from './ConfirmDialog'

interface UserItemProps {
  user: UserData
  onEdit?: (user: UserData) => void
  onDelete?: (user: UserData) => void
}

export default function UserItem({ user, onEdit, onDelete }: UserItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const {
    numeroEmpleado,
    nombreCompleto,
    usuario,
    edificio,
    departamento,
    puesto,
    estadoEquipo,
    estadoUsuario,
    sistemaOperativo,
    serviceTag,
    fabricante,
    tipo,
    modelo,
    direccionMac,
  } = user

  const handleEdit = () => {
    if (onEdit) {
      onEdit(user)
    } else {
      alert(`Editar ${nombreCompleto}`)
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(user)
    } else {
      alert(`Eliminar ${nombreCompleto}`)
    }
    setShowDeleteConfirm(false)
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
  }

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activo':
        return 'success'
      case 'inactivo':
        return 'error'
      case 'en reparación':
        return 'warning'
      default:
        return 'default'
    }
  }

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6">{nombreCompleto}</Typography>
              <Typography variant="body2" color="text.secondary">
                Nº Empleado: {numeroEmpleado}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Usuario: {usuario}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip 
                  label={`Equipo: ${estadoEquipo}`} 
                  color={getEstadoColor(estadoEquipo) as 'success' | 'error' | 'warning' | 'default'}
                  size="small"
                />
                <Chip 
                  label={`Usuario: ${estadoUsuario}`} 
                  color={getEstadoColor(estadoUsuario) as 'success' | 'error' | 'warning' | 'default'}
                  size="small"
                />
              </Stack>
            </Box>
            <Box>
              <IconButton
                color="primary"
                onClick={handleEdit}
                aria-label={`Editar usuario ${nombreCompleto}`}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={handleDeleteClick}
                aria-label={`Eliminar usuario ${nombreCompleto}`}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton 
                onClick={() => setExpanded(!expanded)}
                aria-label={expanded ? "Ocultar detalles" : "Mostrar detalles"}
                aria-expanded={expanded}
              >
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Box>

          <Collapse in={expanded}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
              gap: 2 
            }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Edificio</Typography>
                <Typography variant="body1">{edificio}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Departamento</Typography>
                <Typography variant="body1">{departamento}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Puesto</Typography>
                <Typography variant="body1">{puesto}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Sistema Operativo</Typography>
                <Typography variant="body1">{sistemaOperativo}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Service Tag</Typography>
                <Typography variant="body1">{serviceTag}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Fabricante</Typography>
                <Typography variant="body1">{fabricante}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Tipo</Typography>
                <Typography variant="body1">{tipo}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Modelo</Typography>
                <Typography variant="body1">{modelo}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Dirección MAC</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>{direccionMac}</Typography>
              </Box>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* Modal de confirmación para eliminar */}
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar al usuario "${nombreCompleto}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        severity="warning"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  )
}

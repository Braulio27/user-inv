'use client'

import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Collapse,
  Divider,
  Grid,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { useState } from 'react'

interface UserData {
  numeroEmpleado: string
  nombreCompleto: string
  usuario: string
  edificio: string
  departamento: string
  puesto: string
  estadoEquipo: string
  estadoUsuario:string
  sistemaOperativo: string
  serviceTag: string
  fabricante: string
  tipo: string
  modelo: string
  direccionMac: string
}

interface UserItemProps {
  user: UserData
}

export default function UserItem({ user }: UserItemProps) {
  const [expanded, setExpanded] = useState(false)

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

  return (
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
          </Box>
          <Box>
            <IconButton
              color="primary"
              onClick={() => alert(`Editar ${nombreCompleto}`)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => alert(`Eliminar ${nombreCompleto}`)}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={expanded}>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography>Edificio: {edificio}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography>Departamento: {departamento}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography>Puesto: {puesto}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography>Estado del equipo: {estadoEquipo}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography>Estado del usuario: {estadoUsuario}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography>Sistema Operativo: {sistemaOperativo}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography>Service Tag: {serviceTag}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography>Fabricante: {fabricante}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography>Tipo: {tipo}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography>Modelo: {modelo}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography>Dirección MAC: {direccionMac}</Typography>
            </Grid>
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  )
}

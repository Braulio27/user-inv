'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material'
import { useState, useEffect } from 'react'
import { UserData } from '@/types/user'

interface UserModalProps {
  open: boolean
  onClose: () => void
  onSave: (user: UserData) => void
  user?: UserData | null
  mode: 'create' | 'edit'
}

const initialUserData: UserData = {
  numeroEmpleado: '',
  nombreCompleto: '',
  usuario: '',
  edificio: '',
  departamento: '',
  puesto: '',
  estadoEquipo: 'Activo',
  estadoUsuario: 'Activo',
  sistemaOperativo: 'Windows 11',
  serviceTag: '',
  fabricante: 'Dell',
  tipo: 'Laptop',
  modelo: '',
  direccionMac: '',
}

const edificios = ['Edificio A', 'Edificio B', 'Edificio C', 'Edificio D']
const departamentos = [
  'Recursos Humanos',
  'Tecnologías de la Información',
  'Finanzas',
  'Ventas',
  'Marketing',
  'Operaciones',
  'Legal',
  'Administración'
]
const puestos = [
  'Analista',
  'Desarrollador',
  'Soporte Técnico',
  'Gerente',
  'Director',
  'Asistente',
  'Coordinador',
  'Especialista'
]
const sistemasOperativos = ['Windows 11', 'Windows 10', 'macOS Sonoma', 'Linux']
const fabricantes = ['Dell', 'HP', 'Apple', 'Lenovo', 'Asus', 'Acer']
const tiposEquipo = ['Laptop', 'Desktop', 'Tablet']
const estados = ['Activo', 'Inactivo', 'En reparación']

export default function UserModal({ open, onClose, onSave, user, mode }: UserModalProps) {
  const [formData, setFormData] = useState<UserData>(initialUserData)
  const [errors, setErrors] = useState<Partial<Record<keyof UserData, string>>>({})

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData(user)
    } else {
      setFormData(initialUserData)
    }
    setErrors({})
  }, [user, mode, open])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserData, string>> = {}

    if (!formData.numeroEmpleado.trim()) {
      newErrors.numeroEmpleado = 'El número de empleado es requerido'
    }

    if (!formData.nombreCompleto.trim()) {
      newErrors.nombreCompleto = 'El nombre completo es requerido'
    }

    if (!formData.usuario.trim()) {
      newErrors.usuario = 'El usuario es requerido'
    }

    if (!formData.edificio.trim()) {
      newErrors.edificio = 'El edificio es requerido'
    }

    if (!formData.departamento.trim()) {
      newErrors.departamento = 'El departamento es requerido'
    }

    if (!formData.puesto.trim()) {
      newErrors.puesto = 'El puesto es requerido'
    }

    if (!formData.serviceTag.trim()) {
      newErrors.serviceTag = 'El Service Tag es requerido'
    }

    if (!formData.modelo.trim()) {
      newErrors.modelo = 'El modelo es requerido'
    }

    if (!formData.direccionMac.trim()) {
      newErrors.direccionMac = 'La dirección MAC es requerida'
    } else if (!/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(formData.direccionMac)) {
      newErrors.direccionMac = 'Formato de dirección MAC inválido (ej: 00:1B:44:11:3A:B7)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData)
      onClose()
    }
  }

  const handleChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleClose = () => {
    setFormData(initialUserData)
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(12, 1fr)' 
            }, 
            gap: 2 
          }}>
            {/* Información Personal */}
            <Box gridColumn={{ xs: '1', md: 'span 12' }}>
              <TextField
                fullWidth
                label="Número de Empleado"
                value={formData.numeroEmpleado}
                onChange={(e) => handleChange('numeroEmpleado', e.target.value)}
                error={!!errors.numeroEmpleado}
                helperText={errors.numeroEmpleado}
                required
              />
            </Box>
            <Box gridColumn={{ xs: '1', md: 'span 6' }}>
              <TextField
                fullWidth
                label="Nombre Completo"
                value={formData.nombreCompleto}
                onChange={(e) => handleChange('nombreCompleto', e.target.value)}
                error={!!errors.nombreCompleto}
                helperText={errors.nombreCompleto}
                required
              />
            </Box>
            <Box gridColumn={{ xs: '1', md: 'span 6' }}>
              <TextField
                fullWidth
                label="Usuario"
                value={formData.usuario}
                onChange={(e) => handleChange('usuario', e.target.value)}
                error={!!errors.usuario}
                helperText={errors.usuario}
                required
              />
            </Box>

            {/* Información Laboral */}
            <Box gridColumn={{ xs: '1', md: 'span 4' }}>
              <FormControl fullWidth error={!!errors.edificio} required>
                <InputLabel>Edificio</InputLabel>
                <Select
                  value={formData.edificio}
                  label="Edificio"
                  onChange={(e) => handleChange('edificio', e.target.value)}
                >
                  {edificios.map((edificio) => (
                    <MenuItem key={edificio} value={edificio}>
                      {edificio}
                    </MenuItem>
                  ))}
                </Select>
                {errors.edificio && <FormHelperText>{errors.edificio}</FormHelperText>}
              </FormControl>
            </Box>
            <Box gridColumn={{ xs: '1', md: 'span 4' }}>
              <FormControl fullWidth error={!!errors.departamento} required>
                <InputLabel>Departamento</InputLabel>
                <Select
                  value={formData.departamento}
                  label="Departamento"
                  onChange={(e) => handleChange('departamento', e.target.value)}
                >
                  {departamentos.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
                {errors.departamento && <FormHelperText>{errors.departamento}</FormHelperText>}
              </FormControl>
            </Box>
            <Box gridColumn={{ xs: '1', md: 'span 4' }}>
              <FormControl fullWidth error={!!errors.puesto} required>
                <InputLabel>Puesto</InputLabel>
                <Select
                  value={formData.puesto}
                  label="Puesto"
                  onChange={(e) => handleChange('puesto', e.target.value)}
                >
                  {puestos.map((puesto) => (
                    <MenuItem key={puesto} value={puesto}>
                      {puesto}
                    </MenuItem>
                  ))}
                </Select>
                {errors.puesto && <FormHelperText>{errors.puesto}</FormHelperText>}
              </FormControl>
            </Box>

            {/* Estados */}
            <Box gridColumn={{ xs: '1', md: 'span 6' }}>
              <FormControl fullWidth>
                <InputLabel>Estado del Usuario</InputLabel>
                <Select
                  value={formData.estadoUsuario}
                  label="Estado del Usuario"
                  onChange={(e) => handleChange('estadoUsuario', e.target.value)}
                >
                  {estados.map((estado) => (
                    <MenuItem key={estado} value={estado}>
                      {estado}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box gridColumn={{ xs: '1', md: 'span 6' }}>
              <FormControl fullWidth>
                <InputLabel>Estado del Equipo</InputLabel>
                <Select
                  value={formData.estadoEquipo}
                  label="Estado del Equipo"
                  onChange={(e) => handleChange('estadoEquipo', e.target.value)}
                >
                  {estados.map((estado) => (
                    <MenuItem key={estado} value={estado}>
                      {estado}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Información del Equipo */}
            <Box gridColumn={{ xs: '1', md: 'span 6' }}>
              <FormControl fullWidth>
                <InputLabel>Sistema Operativo</InputLabel>
                <Select
                  value={formData.sistemaOperativo}
                  label="Sistema Operativo"
                  onChange={(e) => handleChange('sistemaOperativo', e.target.value)}
                >
                  {sistemasOperativos.map((os) => (
                    <MenuItem key={os} value={os}>
                      {os}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box gridColumn={{ xs: '1', md: 'span 6' }}>
              <TextField
                fullWidth
                label="Service Tag"
                value={formData.serviceTag}
                onChange={(e) => handleChange('serviceTag', e.target.value)}
                error={!!errors.serviceTag}
                helperText={errors.serviceTag}
                required
              />
            </Box>
            <Box gridColumn={{ xs: '1', md: 'span 4' }}>
              <FormControl fullWidth>
                <InputLabel>Fabricante</InputLabel>
                <Select
                  value={formData.fabricante}
                  label="Fabricante"
                  onChange={(e) => handleChange('fabricante', e.target.value)}
                >
                  {fabricantes.map((fabricante) => (
                    <MenuItem key={fabricante} value={fabricante}>
                      {fabricante}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box gridColumn={{ xs: '1', md: 'span 4' }}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Equipo</InputLabel>
                <Select
                  value={formData.tipo}
                  label="Tipo de Equipo"
                  onChange={(e) => handleChange('tipo', e.target.value)}
                >
                  {tiposEquipo.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box gridColumn={{ xs: '1', md: 'span 4' }}>
              <TextField
                fullWidth
                label="Modelo"
                value={formData.modelo}
                onChange={(e) => handleChange('modelo', e.target.value)}
                error={!!errors.modelo}
                helperText={errors.modelo}
                required
              />
            </Box>
            <Box gridColumn={{ xs: '1', md: 'span 12' }}>
              <TextField
                fullWidth
                label="Dirección MAC"
                value={formData.direccionMac}
                onChange={(e) => handleChange('direccionMac', e.target.value)}
                error={!!errors.direccionMac}
                helperText={errors.direccionMac || 'Formato: 00:1B:44:11:3A:B7'}
                required
                placeholder="00:1B:44:11:3A:B7"
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
        >
          {mode === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  )
} 
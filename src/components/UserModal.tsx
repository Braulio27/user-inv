'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useState, useEffect } from 'react'
import { UserData } from '@/types/user'
import { validateUserData, safeValidateUserData, validateField } from '@/schemas/user'
import { validateAndSanitizeInput } from '@/utils/security'

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

export default function UserModal({ open, onClose, onSave, user, mode }: UserModalProps) {
  const [formData, setFormData] = useState<UserData>(initialUserData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData(user)
    } else {
      setFormData(initialUserData)
    }
    setErrors({})
    setTouched({})
  }, [user, mode, open])

  const handleInputChange = (field: keyof UserData, value: string) => {
    // Sanitizar entrada del usuario
    const sanitizedValue = validateAndSanitizeInput(value)
    if (sanitizedValue.success) {
      setFormData(prev => ({ ...prev, [field]: sanitizedValue.data }))
      
      // Marcar campo como tocado
      setTouched(prev => ({ ...prev, [field]: true }))
      
      // Validar campo individual si ya fue tocado
      if (touched[field]) {
        const fieldValidation = validateField(field, sanitizedValue.data)
        if (fieldValidation.isValid) {
          setErrors(prev => ({ ...prev, [field]: '' }))
        } else {
          setErrors(prev => ({ ...prev, [field]: fieldValidation.error || '' }))
        }
      }
    } else {
      setErrors(prev => ({ ...prev, [field]: sanitizedValue.error }))
    }
  }

  const handleFieldBlur = (field: keyof UserData) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    
    const value = formData[field]
    if (typeof value === 'string') {
      const fieldValidation = validateField(field, value)
      if (fieldValidation.isValid) {
        setErrors(prev => ({ ...prev, [field]: '' }))
      } else {
        setErrors(prev => ({ ...prev, [field]: fieldValidation.error || '' }))
      }
    }
  }

  const validateForm = (): boolean => {
    try {
      validateUserData(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof Error) {
        const validationErrors: Record<string, string> = {}
        // Parsear errores de Zod
        if (error.message.includes('ZodError')) {
          // Manejar errores específicos de Zod
          validationErrors.general = 'Por favor, corrige los errores en el formulario'
        } else {
          validationErrors.general = error.message
        }
        setErrors(validationErrors)
      }
      return false
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Marcar todos los campos como tocados
      const allFields = Object.keys(formData) as (keyof UserData)[]
      const newTouched: Record<string, boolean> = {}
      allFields.forEach(field => {
        newTouched[field] = true
      })
      setTouched(newTouched)
      
      // Validar formulario
      if (!validateForm()) {
        setIsSubmitting(false)
        return
      }

      // Validar datos con Zod
      const validationResult = safeValidateUserData(formData)
      if (!validationResult.success) {
        setErrors({ general: validationResult.error })
        setIsSubmitting(false)
        return
      }

      // Simular delay para mostrar estado de carga
      await new Promise(resolve => setTimeout(resolve, 500))

      onSave(validationResult.data)
      onClose()
    } catch (error) {
      setErrors({ general: 'Error al guardar el usuario' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData(initialUserData)
      setErrors({})
      setTouched({})
      onClose()
    }
  }

  const hasErrors = Object.values(errors).some(error => error !== '')

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1
      }}>
        <Typography variant="h6">
          {mode === 'create' ? 'Crear Usuario' : 'Editar Usuario'}
        </Typography>
        <IconButton
          onClick={handleClose}
          disabled={isSubmitting}
          sx={{ color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {errors.general && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.general}
          </Alert>
        )}

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
          gap: 2 
        }}>
          <TextField
            label="Número de Empleado"
            value={formData.numeroEmpleado}
            onChange={(e) => handleInputChange('numeroEmpleado', e.target.value)}
            onBlur={() => handleFieldBlur('numeroEmpleado')}
            error={touched.numeroEmpleado && !!errors.numeroEmpleado}
            helperText={touched.numeroEmpleado ? errors.numeroEmpleado : ''}
            fullWidth
            required
            disabled={isSubmitting}
          />

          <TextField
            label="Nombre Completo"
            value={formData.nombreCompleto}
            onChange={(e) => handleInputChange('nombreCompleto', e.target.value)}
            onBlur={() => handleFieldBlur('nombreCompleto')}
            error={touched.nombreCompleto && !!errors.nombreCompleto}
            helperText={touched.nombreCompleto ? errors.nombreCompleto : ''}
            fullWidth
            required
            disabled={isSubmitting}
          />

          <TextField
            label="Usuario"
            value={formData.usuario}
            onChange={(e) => handleInputChange('usuario', e.target.value)}
            onBlur={() => handleFieldBlur('usuario')}
            error={touched.usuario && !!errors.usuario}
            helperText={touched.usuario ? errors.usuario : 'Mínimo 3 caracteres, solo letras minúsculas, números, guiones y guiones bajos'}
            fullWidth
            required
            disabled={isSubmitting}
          />

          <TextField
            label="Edificio"
            value={formData.edificio}
            onChange={(e) => handleInputChange('edificio', e.target.value)}
            onBlur={() => handleFieldBlur('edificio')}
            error={touched.edificio && !!errors.edificio}
            helperText={touched.edificio ? errors.edificio : ''}
            fullWidth
            required
            disabled={isSubmitting}
          />

          <TextField
            label="Departamento"
            value={formData.departamento}
            onChange={(e) => handleInputChange('departamento', e.target.value)}
            onBlur={() => handleFieldBlur('departamento')}
            error={touched.departamento && !!errors.departamento}
            helperText={touched.departamento ? errors.departamento : ''}
            fullWidth
            required
            disabled={isSubmitting}
          />

          <TextField
            label="Puesto"
            value={formData.puesto}
            onChange={(e) => handleInputChange('puesto', e.target.value)}
            onBlur={() => handleFieldBlur('puesto')}
            error={touched.puesto && !!errors.puesto}
            helperText={touched.puesto ? errors.puesto : ''}
            fullWidth
            required
            disabled={isSubmitting}
          />

          <FormControl fullWidth required disabled={isSubmitting}>
            <InputLabel>Estado del Equipo</InputLabel>
            <Select
              value={formData.estadoEquipo}
              onChange={(e) => handleInputChange('estadoEquipo', e.target.value)}
              label="Estado del Equipo"
            >
              <MenuItem value="Activo">Activo</MenuItem>
              <MenuItem value="Inactivo">Inactivo</MenuItem>
              <MenuItem value="En reparación">En reparación</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth required disabled={isSubmitting}>
            <InputLabel>Estado del Usuario</InputLabel>
            <Select
              value={formData.estadoUsuario}
              onChange={(e) => handleInputChange('estadoUsuario', e.target.value)}
              label="Estado del Usuario"
            >
              <MenuItem value="Activo">Activo</MenuItem>
              <MenuItem value="Inactivo">Inactivo</MenuItem>
              <MenuItem value="En reparación">En reparación</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth required disabled={isSubmitting}>
            <InputLabel>Sistema Operativo</InputLabel>
            <Select
              value={formData.sistemaOperativo}
              onChange={(e) => handleInputChange('sistemaOperativo', e.target.value)}
              label="Sistema Operativo"
            >
              <MenuItem value="Windows 11">Windows 11</MenuItem>
              <MenuItem value="Windows 10">Windows 10</MenuItem>
              <MenuItem value="macOS Sonoma">macOS Sonoma</MenuItem>
              <MenuItem value="Linux">Linux</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Service Tag"
            value={formData.serviceTag}
            onChange={(e) => handleInputChange('serviceTag', e.target.value)}
            onBlur={() => handleFieldBlur('serviceTag')}
            error={touched.serviceTag && !!errors.serviceTag}
            helperText={touched.serviceTag ? errors.serviceTag : ''}
            fullWidth
            required
            disabled={isSubmitting}
          />

          <FormControl fullWidth required disabled={isSubmitting}>
            <InputLabel>Fabricante</InputLabel>
            <Select
              value={formData.fabricante}
              onChange={(e) => handleInputChange('fabricante', e.target.value)}
              label="Fabricante"
            >
              <MenuItem value="Dell">Dell</MenuItem>
              <MenuItem value="HP">HP</MenuItem>
              <MenuItem value="Apple">Apple</MenuItem>
              <MenuItem value="Lenovo">Lenovo</MenuItem>
              <MenuItem value="Asus">Asus</MenuItem>
              <MenuItem value="Acer">Acer</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth required disabled={isSubmitting}>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={formData.tipo}
              onChange={(e) => handleInputChange('tipo', e.target.value)}
              label="Tipo"
            >
              <MenuItem value="Laptop">Laptop</MenuItem>
              <MenuItem value="Desktop">Desktop</MenuItem>
              <MenuItem value="Tablet">Tablet</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Modelo"
            value={formData.modelo}
            onChange={(e) => handleInputChange('modelo', e.target.value)}
            onBlur={() => handleFieldBlur('modelo')}
            error={touched.modelo && !!errors.modelo}
            helperText={touched.modelo ? errors.modelo : ''}
            fullWidth
            required
            disabled={isSubmitting}
          />

          <TextField
            label="Dirección MAC"
            value={formData.direccionMac}
            onChange={(e) => handleInputChange('direccionMac', e.target.value)}
            onBlur={() => handleFieldBlur('direccionMac')}
            error={touched.direccionMac && !!errors.direccionMac}
            helperText={touched.direccionMac ? errors.direccionMac : 'Formato: 00:1B:44:11:3A:B7'}
            fullWidth
            required
            disabled={isSubmitting}
            placeholder="00:1B:44:11:3A:B7"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={isSubmitting}
          sx={{ minWidth: 100 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting || hasErrors}
          sx={{ minWidth: 100 }}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
} 
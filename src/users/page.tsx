'use client'

import LayoutPrivado from '@/layouts/LayoutPrivado'
import { Typography, TextField, Box, Button, Stack, Snackbar, Alert } from '@mui/material'
import UserItem from '../components/userItem'
import UserModal from '../components/UserModal'
import { mockUsers } from '@/data/users'
import { UserData } from '@/types/user'
import { useState, useMemo } from 'react'
import AddIcon from '@mui/icons-material/Add'

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState<UserData[]>(mockUsers)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error' | 'info' | 'warning'
  }>({
    open: false,
    message: '',
    severity: 'success'
  })

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users
    
    return users.filter(user => 
      user.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.departamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.numeroEmpleado.includes(searchTerm)
    )
  }, [users, searchTerm])

  const handleEdit = (user: UserData) => {
    setSelectedUser(user)
    setModalMode('edit')
    setModalOpen(true)
  }

  const handleDelete = (user: UserData) => {
    if (confirm(`¿Estás seguro de que deseas eliminar a ${user.nombreCompleto}?`)) {
      setUsers(users.filter(u => u.numeroEmpleado !== user.numeroEmpleado))
      showSnackbar('Usuario eliminado exitosamente', 'success')
    }
  }

  const handleAddUser = () => {
    setSelectedUser(null)
    setModalMode('create')
    setModalOpen(true)
  }

  const handleSaveUser = (userData: UserData) => {
    if (modalMode === 'create') {
      // Verificar que el número de empleado no exista
      if (users.some(u => u.numeroEmpleado === userData.numeroEmpleado)) {
        showSnackbar('El número de empleado ya existe', 'error')
        return
      }
      
      setUsers([...users, userData])
      showSnackbar('Usuario creado exitosamente', 'success')
    } else {
      // Modo edición
      setUsers(users.map(u => 
        u.numeroEmpleado === userData.numeroEmpleado ? userData : u
      ))
      showSnackbar('Usuario actualizado exitosamente', 'success')
    }
  }

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({
      open: true,
      message,
      severity
    })
  }

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  return (
    <LayoutPrivado>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Gestión de Usuarios
        </Typography>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            label="Buscar usuarios..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddUser}
          >
            Agregar Usuario
          </Button>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {filteredUsers.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No se encontraron usuarios que coincidan con la búsqueda.
        </Typography>
      ) : (
        filteredUsers.map((user) => (
          <UserItem 
            key={user.numeroEmpleado} 
            user={user} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      )}

      {/* Modal para crear/editar usuarios */}
      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
        mode={modalMode}
      />

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </LayoutPrivado>
  )
}

'use client'

import LayoutPrivado from '@/layouts/LayoutPrivado'
import { Typography, TextField, Box, Button, Stack } from '@mui/material'
import UserItem from '../components/userItem'
import { mockUsers } from '@/data/users'
import { UserData } from '@/types/user'
import { useState, useMemo } from 'react'
import AddIcon from '@mui/icons-material/Add'

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState<UserData[]>(mockUsers)

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
    // TODO: Implementar modal de edición
    alert(`Editar usuario: ${user.nombreCompleto}`)
  }

  const handleDelete = (user: UserData) => {
    if (confirm(`¿Estás seguro de que deseas eliminar a ${user.nombreCompleto}?`)) {
      setUsers(users.filter(u => u.numeroEmpleado !== user.numeroEmpleado))
    }
  }

  const handleAddUser = () => {
    // TODO: Implementar modal de creación
    alert('Agregar nuevo usuario')
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
    </LayoutPrivado>
  )
}

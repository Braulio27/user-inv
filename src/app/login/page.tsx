'use client'

import { Box, TextField, Button, Typography, Container } from '@mui/material'
import { useState } from 'react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Iniciar sesión con:', email, password)
    // Aquí puedes agregar lógica de autenticación
  }
  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Iniciar sesión
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Correo"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Ingresar
          </Button>
        </form>
      </Box>
    </Container>
  )
}
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserModal from '../UserModal';
import { UserData } from '@/types/user';

// Mock de las dependencias
jest.mock('@/schemas/user', () => ({
  validateUserData: jest.fn(),
  safeValidateUserData: jest.fn(),
  validateField: jest.fn(),
}));

jest.mock('@/utils/security', () => ({
  validateAndSanitizeInput: jest.fn(),
}));

const mockUser: UserData = {
  numeroEmpleado: 'EMP001',
  nombreCompleto: 'Juan Pérez',
  usuario: 'juan.perez',
  edificio: 'Edificio A',
  departamento: 'IT',
  puesto: 'Desarrollador',
  estadoEquipo: 'Activo',
  estadoUsuario: 'Activo',
  sistemaOperativo: 'Windows 11',
  serviceTag: 'ST123456',
  fabricante: 'Dell',
  tipo: 'Laptop',
  modelo: 'Latitude 5520',
  direccionMac: '00:1B:44:11:3A:B7',
};

describe('UserModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock por defecto para validación exitosa
    const { validateAndSanitizeInput } = require('@/utils/security');
    validateAndSanitizeInput.mockReturnValue({ success: true, data: 'test' });
    
    const { validateField } = require('@/schemas/user');
    validateField.mockReturnValue({ isValid: true });
  });

  describe('Renderizado', () => {
    it('debe renderizar el modal de crear usuario correctamente', () => {
      render(
        <UserModal
          open={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      );

      expect(screen.getByText('Crear Usuario')).toBeInTheDocument();
      expect(screen.getByLabelText('Número de Empleado')).toBeInTheDocument();
      expect(screen.getByLabelText('Nombre Completo')).toBeInTheDocument();
      expect(screen.getByLabelText('Usuario')).toBeInTheDocument();
      expect(screen.getByText('Guardar')).toBeInTheDocument();
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });

    it('debe renderizar el modal de editar usuario con datos prellenados', () => {
      render(
        <UserModal
          open={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          user={mockUser}
          mode="edit"
        />
      );

      expect(screen.getByText('Editar Usuario')).toBeInTheDocument();
      expect(screen.getByDisplayValue('EMP001')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByDisplayValue('juan.perez')).toBeInTheDocument();
    });

    it('no debe renderizar cuando open es false', () => {
      render(
        <UserModal
          open={false}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      );

      expect(screen.queryByText('Crear Usuario')).not.toBeInTheDocument();
    });
  });

  describe('Interacciones del Usuario', () => {
    it('debe cerrar el modal al hacer clic en Cancelar', async () => {
      render(
        <UserModal
          open={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      );

      const cancelButton = screen.getByText('Cancelar');
      await userEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('debe cerrar el modal al hacer clic en el botón X', async () => {
      render(
        <UserModal
          open={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      );

      const closeButton = screen.getByRole('button', { name: /close/i });
      await userEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('debe actualizar el valor del campo al escribir', async () => {
      render(
        <UserModal
          open={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      );

      const nombreInput = screen.getByLabelText('Nombre Completo');
      await userEvent.type(nombreInput, 'María García');

      expect(nombreInput).toHaveValue('María García');
    });

    it('debe cambiar el valor del select', async () => {
      render(
        <UserModal
          open={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      );

      const fabricanteSelect = screen.getByLabelText('Fabricante');
      await userEvent.click(fabricanteSelect);
      
      const hpOption = screen.getByText('HP');
      await userEvent.click(hpOption);

      expect(fabricanteSelect).toHaveValue('HP');
    });
  });

  describe('Validación de Campos', () => {
    it('debe mostrar error cuando la validación falla', async () => {
      const { validateAndSanitizeInput } = require('@/utils/security');
      validateAndSanitizeInput.mockReturnValue({ 
        success: false, 
        error: 'Entrada inválida' 
      });

      render(
        <UserModal
          open={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      );

      const nombreInput = screen.getByLabelText('Nombre Completo');
      await userEvent.type(nombreInput, 'test');
      fireEvent.blur(nombreInput);

      expect(screen.getByText('Entrada inválida')).toBeInTheDocument();
    });

    it('debe mostrar texto de ayuda para campos complejos', () => {
      render(
        <UserModal
          open={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      );

      expect(screen.getByText(/Mínimo 3 caracteres/)).toBeInTheDocument();
      expect(screen.getByText(/Formato: 00:1B:44:11:3A:B7/)).toBeInTheDocument();
    });

    it('debe validar campo individual al perder el foco', async () => {
      const { validateField } = require('@/schemas/user');
      validateField.mockReturnValue({ isValid: false, error: 'Campo requerido' });

      render(
        <UserModal
          open={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      );

      const nombreInput = screen.getByLabelText('Nombre Completo');
      fireEvent.blur(nombreInput);

      expect(validateField).toHaveBeenCalledWith('nombreCompleto', '');
    });
  });

  describe('Envío del Formulario', () => {
    it('debe llamar onSave con datos válidos', async () => {
      const { safeValidateUserData } = require('@/schemas/user');
      safeValidateUserData.mockReturnValue({ success: true, data: mockUser });

      render(
        <UserModal
          open={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      );

      // Llenar campos requeridos
      await userEvent.type(screen.getByLabelText('Número de Empleado'), 'EMP001');
      await userEvent.type(screen.getByLabelText('Nombre Completo'), 'Juan Pérez');
      await userEvent.type(screen.getByLabelText('Usuario'), 'juan.perez');
      await userEvent.type(screen.getByLabelText('Edificio'), 'Edificio A');
      await userEvent.type(screen.getByLabelText('Departamento'), 'IT');
      await userEvent.type(screen.getByLabelText('Puesto'), 'Desarrollador');
      await userEvent.type(screen.getByLabelText('Service Tag'), 'ST123456');
      await userEvent.type(screen.getByLabelText('Modelo'), 'Latitude 5520');
      await userEvent.type(screen.getByLabelText('Dirección MAC'), '00:1B:44:11:3A:B7');

      const saveButton = screen.getByText('Guardar');
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(mockUser);
      });
    });

    it('debe mostrar error general cuando la validación falla', async () => {
      const { safeValidateUserData } = require('@/schemas/user');
      safeValidateUserData.mockReturnValue({ 
        success: false, 
        error: 'Datos inválidos' 
      });

      render(
        <UserModal
          open={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      );

      const saveButton = screen.getByText('Guardar');
      await userEvent.click(saveButton);

      expect(screen.getByText('Datos inválidos')).toBeInTheDocument();
    });

    it('debe deshabilitar el botón de guardar cuando hay errores', async () => {
      const { validateField } = require('@/schemas/user');
      validateField.mockReturnValue({ isValid: false, error: 'Error' });

      render(
        <UserModal
          open={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      );

      const nombreInput = screen.getByLabelText('Nombre Completo');
      fireEvent.blur(nombreInput);

      const saveButton = screen.getByText('Guardar');
      expect(saveButton).toBeDisabled();
    });

    it('debe mostrar estado de carga durante el envío', async () => {
      const { safeValidateUserData } = require('@/schemas/user');
      safeValidateUserData.mockReturnValue({ success: true, data: mockUser });

      render(
        <UserModal
          open={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      );

      // Llenar campos requeridos
      await userEvent.type(screen.getByLabelText('Número de Empleado'), 'EMP001');
      await userEvent.type(screen.getByLabelText('Nombre Completo'), 'Juan Pérez');
      await userEvent.type(screen.getByLabelText('Usuario'), 'juan.perez');
      await userEvent.type(screen.getByLabelText('Edificio'), 'Edificio A');
      await userEvent.type(screen.getByLabelText('Departamento'), 'IT');
      await userEvent.type(screen.getByLabelText('Puesto'), 'Desarrollador');
      await userEvent.type(screen.getByLabelText('Service Tag'), 'ST123456');
      await userEvent.type(screen.getByLabelText('Modelo'), 'Latitude 5520');
      await userEvent.type(screen.getByLabelText('Dirección MAC'), '00:1B:44:11:3A:B7');

      const saveButton = screen.getByText('Guardar');
      await userEvent.click(saveButton);

      expect(screen.getByText('Guardando...')).toBeInTheDocument();
    });
  });

  describe('Accesibilidad', () => {
    it('debe tener labels apropiados para todos los campos', () => {
      render(
        <UserModal
          open={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      );

      expect(screen.getByLabelText('Número de Empleado')).toBeInTheDocument();
      expect(screen.getByLabelText('Nombre Completo')).toBeInTheDocument();
      expect(screen.getByLabelText('Usuario')).toBeInTheDocument();
      expect(screen.getByLabelText('Edificio')).toBeInTheDocument();
      expect(screen.getByLabelText('Departamento')).toBeInTheDocument();
      expect(screen.getByLabelText('Puesto')).toBeInTheDocument();
      expect(screen.getByLabelText('Service Tag')).toBeInTheDocument();
      expect(screen.getByLabelText('Modelo')).toBeInTheDocument();
      expect(screen.getByLabelText('Dirección MAC')).toBeInTheDocument();
    });

    it('debe tener roles ARIA apropiados', () => {
      render(
        <UserModal
          open={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });
  });
}); 
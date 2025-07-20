import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserItem from '../userItem';
import { UserData } from '@/types/user';

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

describe('UserItem', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizado', () => {
    it('debe renderizar la información básica del usuario', () => {
      render(
        <UserItem
          user={mockUser}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('Nº Empleado: EMP001')).toBeInTheDocument();
      expect(screen.getByText('Usuario: juan.perez')).toBeInTheDocument();
    });

    it('debe mostrar los estados como chips', () => {
      render(
        <UserItem
          user={mockUser}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Equipo: Activo')).toBeInTheDocument();
      expect(screen.getByText('Usuario: Activo')).toBeInTheDocument();
    });

    it('debe mostrar botones de acción', () => {
      render(
        <UserItem
          user={mockUser}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByLabelText(/editar usuario/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/eliminar usuario/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mostrar detalles/i)).toBeInTheDocument();
    });
  });

  describe('Interacciones', () => {
    it('debe expandir/contraer detalles al hacer clic en el botón', async () => {
      render(
        <UserItem
          user={mockUser}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const expandButton = screen.getByLabelText(/mostrar detalles/i);
      await userEvent.click(expandButton);

      // Verificar que se muestran los detalles
      expect(screen.getByText('Edificio')).toBeInTheDocument();
      expect(screen.getByText('Departamento')).toBeInTheDocument();
      expect(screen.getByText('Puesto')).toBeInTheDocument();
      expect(screen.getByText('Sistema Operativo')).toBeInTheDocument();
      expect(screen.getByText('Service Tag')).toBeInTheDocument();
      expect(screen.getByText('Fabricante')).toBeInTheDocument();
      expect(screen.getByText('Tipo')).toBeInTheDocument();
      expect(screen.getByText('Modelo')).toBeInTheDocument();
      expect(screen.getByText('Dirección MAC')).toBeInTheDocument();

      // Verificar que el botón cambió
      expect(screen.getByLabelText(/ocultar detalles/i)).toBeInTheDocument();
    });

    it('debe llamar onEdit cuando se hace clic en el botón editar', async () => {
      render(
        <UserItem
          user={mockUser}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const editButton = screen.getByLabelText(/editar usuario/i);
      await userEvent.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
    });

    it('debe mostrar modal de confirmación al hacer clic en eliminar', async () => {
      render(
        <UserItem
          user={mockUser}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByLabelText(/eliminar usuario/i);
      await userEvent.click(deleteButton);

      expect(screen.getByText('Confirmar Eliminación')).toBeInTheDocument();
      expect(screen.getByText(/¿Estás seguro de que deseas eliminar al usuario "Juan Pérez"/)).toBeInTheDocument();
    });

    it('debe llamar onDelete cuando se confirma la eliminación', async () => {
      render(
        <UserItem
          user={mockUser}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByLabelText(/eliminar usuario/i);
      await userEvent.click(deleteButton);

      const confirmButton = screen.getByText('Eliminar');
      await userEvent.click(confirmButton);

      expect(mockOnDelete).toHaveBeenCalledWith(mockUser);
    });

    it('debe cerrar el modal de confirmación al cancelar', async () => {
      render(
        <UserItem
          user={mockUser}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByLabelText(/eliminar usuario/i);
      await userEvent.click(deleteButton);

      const cancelButton = screen.getByText('Cancelar');
      await userEvent.click(cancelButton);

      expect(screen.queryByText('Confirmar Eliminación')).not.toBeInTheDocument();
      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });

  describe('Estados del Usuario', () => {
    it('debe mostrar colores correctos para diferentes estados', () => {
      const inactiveUser = { ...mockUser, estadoEquipo: 'Inactivo', estadoUsuario: 'Inactivo' };
      
      render(
        <UserItem
          user={inactiveUser}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Equipo: Inactivo')).toBeInTheDocument();
      expect(screen.getByText('Usuario: Inactivo')).toBeInTheDocument();
    });

    it('debe mostrar estado de reparación', () => {
      const repairUser = { ...mockUser, estadoEquipo: 'En reparación', estadoUsuario: 'En reparación' };
      
      render(
        <UserItem
          user={repairUser}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Equipo: En reparación')).toBeInTheDocument();
      expect(screen.getByText('Usuario: En reparación')).toBeInTheDocument();
    });
  });

  describe('Detalles Expandidos', () => {
    it('debe mostrar todos los detalles del usuario cuando está expandido', async () => {
      render(
        <UserItem
          user={mockUser}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const expandButton = screen.getByLabelText(/mostrar detalles/i);
      await userEvent.click(expandButton);

      // Verificar valores específicos
      expect(screen.getByText('Edificio A')).toBeInTheDocument();
      expect(screen.getByText('IT')).toBeInTheDocument();
      expect(screen.getByText('Desarrollador')).toBeInTheDocument();
      expect(screen.getByText('Windows 11')).toBeInTheDocument();
      expect(screen.getByText('ST123456')).toBeInTheDocument();
      expect(screen.getByText('Dell')).toBeInTheDocument();
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getByText('Latitude 5520')).toBeInTheDocument();
      expect(screen.getByText('00:1B:44:11:3A:B7')).toBeInTheDocument();
    });

    it('debe mostrar la dirección MAC con fuente monoespaciada', async () => {
      render(
        <UserItem
          user={mockUser}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const expandButton = screen.getByLabelText(/mostrar detalles/i);
      await userEvent.click(expandButton);

      const macElement = screen.getByText('00:1B:44:11:3A:B7');
      expect(macElement).toHaveStyle({ fontFamily: 'monospace' });
    });
  });

  describe('Accesibilidad', () => {
    it('debe tener aria-labels apropiados', () => {
      render(
        <UserItem
          user={mockUser}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByLabelText(/editar usuario Juan Pérez/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/eliminar usuario Juan Pérez/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mostrar detalles/i)).toBeInTheDocument();
    });

    it('debe tener aria-expanded apropiado', async () => {
      render(
        <UserItem
          user={mockUser}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const expandButton = screen.getByLabelText(/mostrar detalles/i);
      expect(expandButton).toHaveAttribute('aria-expanded', 'false');

      await userEvent.click(expandButton);
      expect(expandButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Casos Edge', () => {
    it('debe manejar usuarios sin callbacks', async () => {
      render(<UserItem user={mockUser} />);

      const editButton = screen.getByLabelText(/editar usuario/i);
      const deleteButton = screen.getByLabelText(/eliminar usuario/i);

      await userEvent.click(editButton);
      await userEvent.click(deleteButton);

      // No debe fallar, solo mostrar el modal de confirmación
      expect(screen.getByText('Confirmar Eliminación')).toBeInTheDocument();
    });

    it('debe manejar nombres muy largos', () => {
      const longNameUser = {
        ...mockUser,
        nombreCompleto: 'Dr. María José de los Ángeles García-López y Martínez de la Cruz',
      };

      render(
        <UserItem
          user={longNameUser}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Dr. María José de los Ángeles García-López y Martínez de la Cruz')).toBeInTheDocument();
    });
  });
}); 
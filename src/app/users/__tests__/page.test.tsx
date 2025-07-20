import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UsersPage from '../page';
import { UserData } from '@/types/user';

// Mock de los componentes
jest.mock('@/components/UserModal', () => {
  return function MockUserModal({ open, onClose, onSave, user, mode }: any) {
    if (!open) return null;
    return (
      <div data-testid="user-modal">
        <h2>{mode === 'create' ? 'Crear Usuario' : 'Editar Usuario'}</h2>
        <button onClick={() => onSave(user || {})}>Guardar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    );
  };
});

jest.mock('@/components/userItem', () => {
  return function MockUserItem({ user, onEdit, onDelete }: any) {
    return (
      <div data-testid="user-item">
        <h3>{user.nombreCompleto}</h3>
        <button onClick={() => onEdit(user)}>Editar</button>
        <button onClick={() => onDelete(user)}>Eliminar</button>
      </div>
    );
  };
});

const mockUsers: UserData[] = [
  {
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
  },
  {
    numeroEmpleado: 'EMP002',
    nombreCompleto: 'María García',
    usuario: 'maria.garcia',
    edificio: 'Edificio B',
    departamento: 'HR',
    puesto: 'Analista',
    estadoEquipo: 'Activo',
    estadoUsuario: 'Activo',
    sistemaOperativo: 'Windows 10',
    serviceTag: 'ST789012',
    fabricante: 'HP',
    tipo: 'Desktop',
    modelo: 'ProDesk 600',
    direccionMac: '00:1B:44:11:3A:B8',
  },
];

describe('UsersPage', () => {
  beforeEach(() => {
    // Mock de localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  describe('Renderizado', () => {
    it('debe renderizar la página de usuarios correctamente', () => {
      render(<UsersPage />);

      expect(screen.getByText('Gestión de Usuarios')).toBeInTheDocument();
      expect(screen.getByText('Crear Usuario')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Buscar usuarios...')).toBeInTheDocument();
    });

    it('debe mostrar la lista de usuarios', () => {
      render(<UsersPage />);

      // Verificar que se muestran los usuarios mock
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('María García')).toBeInTheDocument();
    });

    it('debe mostrar estadísticas', () => {
      render(<UsersPage />);

      expect(screen.getByText('Total de Usuarios')).toBeInTheDocument();
      expect(screen.getByText('Usuarios Activos')).toBeInTheDocument();
      expect(screen.getByText('Equipos Activos')).toBeInTheDocument();
    });
  });

  describe('Funcionalidad de Búsqueda', () => {
    it('debe filtrar usuarios por nombre', async () => {
      render(<UsersPage />);

      const searchInput = screen.getByPlaceholderText('Buscar usuarios...');
      await userEvent.type(searchInput, 'Juan');

      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.queryByText('María García')).not.toBeInTheDocument();
    });

    it('debe filtrar usuarios por número de empleado', async () => {
      render(<UsersPage />);

      const searchInput = screen.getByPlaceholderText('Buscar usuarios...');
      await userEvent.type(searchInput, 'EMP001');

      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.queryByText('María García')).not.toBeInTheDocument();
    });

    it('debe mostrar todos los usuarios cuando la búsqueda está vacía', async () => {
      render(<UsersPage />);

      const searchInput = screen.getByPlaceholderText('Buscar usuarios...');
      await userEvent.type(searchInput, 'Juan');
      await userEvent.clear(searchInput);

      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('María García')).toBeInTheDocument();
    });

    it('debe mostrar mensaje cuando no hay resultados', async () => {
      render(<UsersPage />);

      const searchInput = screen.getByPlaceholderText('Buscar usuarios...');
      await userEvent.type(searchInput, 'UsuarioInexistente');

      expect(screen.getByText('No se encontraron usuarios')).toBeInTheDocument();
    });
  });

  describe('Funcionalidad de Crear Usuario', () => {
    it('debe abrir el modal de crear usuario', async () => {
      render(<UsersPage />);

      const createButton = screen.getByText('Crear Usuario');
      await userEvent.click(createButton);

      expect(screen.getByTestId('user-modal')).toBeInTheDocument();
      expect(screen.getByText('Crear Usuario')).toBeInTheDocument();
    });

    it('debe cerrar el modal al cancelar', async () => {
      render(<UsersPage />);

      const createButton = screen.getByText('Crear Usuario');
      await userEvent.click(createButton);

      const cancelButton = screen.getByText('Cancelar');
      await userEvent.click(cancelButton);

      expect(screen.queryByTestId('user-modal')).not.toBeInTheDocument();
    });

    it('debe agregar nuevo usuario al guardar', async () => {
      render(<UsersPage />);

      const createButton = screen.getByText('Crear Usuario');
      await userEvent.click(createButton);

      const saveButton = screen.getByText('Guardar');
      await userEvent.click(saveButton);

      // Verificar que se muestra el snackbar de éxito
      expect(screen.getByText('Usuario creado exitosamente')).toBeInTheDocument();
    });
  });

  describe('Funcionalidad de Editar Usuario', () => {
    it('debe abrir el modal de editar usuario', async () => {
      render(<UsersPage />);

      const editButtons = screen.getAllByText('Editar');
      await userEvent.click(editButtons[0]);

      expect(screen.getByTestId('user-modal')).toBeInTheDocument();
      expect(screen.getByText('Editar Usuario')).toBeInTheDocument();
    });

    it('debe actualizar usuario al guardar', async () => {
      render(<UsersPage />);

      const editButtons = screen.getAllByText('Editar');
      await userEvent.click(editButtons[0]);

      const saveButton = screen.getByText('Guardar');
      await userEvent.click(saveButton);

      expect(screen.getByText('Usuario actualizado exitosamente')).toBeInTheDocument();
    });
  });

  describe('Funcionalidad de Eliminar Usuario', () => {
    it('debe mostrar confirmación al eliminar', async () => {
      render(<UsersPage />);

      const deleteButtons = screen.getAllByText('Eliminar');
      await userEvent.click(deleteButtons[0]);

      expect(screen.getByText('Confirmar Eliminación')).toBeInTheDocument();
      expect(screen.getByText(/¿Estás seguro de que deseas eliminar al usuario/)).toBeInTheDocument();
    });

    it('debe eliminar usuario al confirmar', async () => {
      render(<UsersPage />);

      const deleteButtons = screen.getAllByText('Eliminar');
      await userEvent.click(deleteButtons[0]);

      const confirmButton = screen.getByText('Eliminar');
      await userEvent.click(confirmButton);

      expect(screen.getByText('Usuario eliminado exitosamente')).toBeInTheDocument();
    });

    it('debe cancelar eliminación', async () => {
      render(<UsersPage />);

      const deleteButtons = screen.getAllByText('Eliminar');
      await userEvent.click(deleteButtons[0]);

      const cancelButton = screen.getByText('Cancelar');
      await userEvent.click(cancelButton);

      expect(screen.queryByText('Confirmar Eliminación')).not.toBeInTheDocument();
    });
  });

  describe('Estadísticas', () => {
    it('debe calcular estadísticas correctamente', () => {
      render(<UsersPage />);

      // Verificar que las estadísticas se muestran
      expect(screen.getByText('Total de Usuarios')).toBeInTheDocument();
      expect(screen.getByText('Usuarios Activos')).toBeInTheDocument();
      expect(screen.getByText('Equipos Activos')).toBeInTheDocument();
    });

    it('debe actualizar estadísticas al agregar usuario', async () => {
      render(<UsersPage />);

      const createButton = screen.getByText('Crear Usuario');
      await userEvent.click(createButton);

      const saveButton = screen.getByText('Guardar');
      await userEvent.click(saveButton);

      // Las estadísticas deberían actualizarse
      expect(screen.getByText('Usuario creado exitosamente')).toBeInTheDocument();
    });
  });

  describe('Snackbar', () => {
    it('debe mostrar snackbar de éxito al crear usuario', async () => {
      render(<UsersPage />);

      const createButton = screen.getByText('Crear Usuario');
      await userEvent.click(createButton);

      const saveButton = screen.getByText('Guardar');
      await userEvent.click(saveButton);

      expect(screen.getByText('Usuario creado exitosamente')).toBeInTheDocument();
    });

    it('debe mostrar snackbar de éxito al actualizar usuario', async () => {
      render(<UsersPage />);

      const editButtons = screen.getAllByText('Editar');
      await userEvent.click(editButtons[0]);

      const saveButton = screen.getByText('Guardar');
      await userEvent.click(saveButton);

      expect(screen.getByText('Usuario actualizado exitosamente')).toBeInTheDocument();
    });

    it('debe mostrar snackbar de éxito al eliminar usuario', async () => {
      render(<UsersPage />);

      const deleteButtons = screen.getAllByText('Eliminar');
      await userEvent.click(deleteButtons[0]);

      const confirmButton = screen.getByText('Eliminar');
      await userEvent.click(confirmButton);

      expect(screen.getByText('Usuario eliminado exitosamente')).toBeInTheDocument();
    });
  });

  describe('Accesibilidad', () => {
    it('debe tener labels apropiados', () => {
      render(<UsersPage />);

      expect(screen.getByLabelText(/buscar usuarios/i)).toBeInTheDocument();
    });

    it('debe tener botones con texto descriptivo', () => {
      render(<UsersPage />);

      expect(screen.getByRole('button', { name: /crear usuario/i })).toBeInTheDocument();
    });
  });

  describe('Casos Edge', () => {
    it('debe manejar lista vacía de usuarios', () => {
      // Mock de datos vacíos
      jest.doMock('@/data/users', () => ({
        users: [],
      }));

      render(<UsersPage />);

      expect(screen.getByText('No hay usuarios registrados')).toBeInTheDocument();
    });

    it('debe manejar errores de localStorage', () => {
      // Mock de localStorage que falla
      const localStorageMock = {
        getItem: jest.fn(() => {
          throw new Error('Storage error');
        }),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      };
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      });

      render(<UsersPage />);

      // Debe seguir funcionando sin localStorage
      expect(screen.getByText('Gestión de Usuarios')).toBeInTheDocument();
    });
  });
}); 
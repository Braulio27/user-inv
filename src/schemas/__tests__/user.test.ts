import {
  UserDataSchema,
  validateUserData,
  safeValidateUserData,
  validateField,
  CreateUserSchema,
  UpdateUserSchema,
  SearchUserSchema,
  PaginationSchema,
} from '../user';
import { UserData } from '@/types/user';

const validUserData: UserData = {
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

describe('UserDataSchema', () => {
  describe('Validación Exitosa', () => {
    it('debe validar datos de usuario completos y válidos', () => {
      const result = UserDataSchema.safeParse(validUserData);
      expect(result.success).toBe(true);
    });

    it('debe validar con diferentes estados', () => {
      const inactiveUser = { ...validUserData, estadoEquipo: 'Inactivo', estadoUsuario: 'Inactivo' };
      const result = UserDataSchema.safeParse(inactiveUser);
      expect(result.success).toBe(true);
    });

    it('debe validar con estado de reparación', () => {
      const repairUser = { ...validUserData, estadoEquipo: 'En reparación', estadoUsuario: 'En reparación' };
      const result = UserDataSchema.safeParse(repairUser);
      expect(result.success).toBe(true);
    });
  });

  describe('Validación de Campos Individuales', () => {
    describe('numeroEmpleado', () => {
      it('debe rechazar número de empleado vacío', () => {
        const invalidData = { ...validUserData, numeroEmpleado: '' };
        const result = UserDataSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('El número de empleado es requerido');
        }
      });

      it('debe rechazar número de empleado muy largo', () => {
        const invalidData = { ...validUserData, numeroEmpleado: 'A'.repeat(21) };
        const result = UserDataSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('El número de empleado no puede exceder 20 caracteres');
        }
      });

      it('debe rechazar caracteres especiales', () => {
        const invalidData = { ...validUserData, numeroEmpleado: 'EMP@001' };
        const result = UserDataSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('El número de empleado solo puede contener letras, números y guiones');
        }
      });
    });

    describe('nombreCompleto', () => {
      it('debe rechazar nombre vacío', () => {
        const invalidData = { ...validUserData, nombreCompleto: '' };
        const result = UserDataSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('El nombre completo es requerido');
        }
      });

      it('debe rechazar nombre muy largo', () => {
        const invalidData = { ...validUserData, nombreCompleto: 'A'.repeat(101) };
        const result = UserDataSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('El nombre completo no puede exceder 100 caracteres');
        }
      });

      it('debe aceptar nombres con acentos', () => {
        const validData = { ...validUserData, nombreCompleto: 'María José García-López' };
        const result = UserDataSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('debe rechazar números en el nombre', () => {
        const invalidData = { ...validUserData, nombreCompleto: 'Juan123' };
        const result = UserDataSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    describe('usuario', () => {
      it('debe rechazar usuario vacío', () => {
        const invalidData = { ...validUserData, usuario: '' };
        const result = UserDataSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('El usuario es requerido');
        }
      });

      it('debe rechazar usuario muy corto', () => {
        const invalidData = { ...validUserData, usuario: 'ab' };
        const result = UserDataSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('El usuario debe tener al menos 3 caracteres');
        }
      });

      it('debe rechazar mayúsculas en usuario', () => {
        const invalidData = { ...validUserData, usuario: 'Juan.Perez' };
        const result = UserDataSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('El usuario solo puede contener letras minúsculas, números, guiones y guiones bajos');
        }
      });

      it('debe aceptar usuario válido con guiones y guiones bajos', () => {
        const validData = { ...validUserData, usuario: 'juan_perez-123' };
        const result = UserDataSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('direccionMac', () => {
      it('debe rechazar dirección MAC vacía', () => {
        const invalidData = { ...validUserData, direccionMac: '' };
        const result = UserDataSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('La dirección MAC es requerida');
        }
      });

      it('debe rechazar formato de MAC inválido', () => {
        const invalidData = { ...validUserData, direccionMac: 'invalid-mac' };
        const result = UserDataSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Formato de dirección MAC inválido. Use el formato: 00:1B:44:11:3A:B7');
        }
      });

      it('debe aceptar MAC con dos puntos', () => {
        const validData = { ...validUserData, direccionMac: '00:1B:44:11:3A:B7' };
        const result = UserDataSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('debe aceptar MAC con guiones', () => {
        const validData = { ...validUserData, direccionMac: '00-1B-44-11-3A-B7' };
        const result = UserDataSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('Enums', () => {
      it('debe rechazar estado de equipo inválido', () => {
        const invalidData = { ...validUserData, estadoEquipo: 'Inválido' as any };
        const result = UserDataSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Estado de equipo inválido');
        }
      });

      it('debe rechazar sistema operativo inválido', () => {
        const invalidData = { ...validUserData, sistemaOperativo: 'Windows 95' as any };
        const result = UserDataSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Sistema operativo inválido');
        }
      });

      it('debe rechazar fabricante inválido', () => {
        const invalidData = { ...validUserData, fabricante: 'Samsung' as any };
        const result = UserDataSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Fabricante inválido');
        }
      });
    });
  });
});

describe('validateUserData', () => {
  it('debe retornar datos válidos', () => {
    const result = validateUserData(validUserData);
    expect(result).toEqual(validUserData);
  });

  it('debe lanzar error con datos inválidos', () => {
    const invalidData = { ...validUserData, numeroEmpleado: '' };
    expect(() => validateUserData(invalidData)).toThrow();
  });
});

describe('safeValidateUserData', () => {
  it('debe retornar éxito con datos válidos', () => {
    const result = safeValidateUserData(validUserData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validUserData);
    }
  });

  it('debe retornar error con datos inválidos', () => {
    const invalidData = { ...validUserData, numeroEmpleado: '' };
    const result = safeValidateUserData(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('numeroEmpleado: El número de empleado es requerido');
    }
  });

  it('debe formatear múltiples errores correctamente', () => {
    const invalidData = { ...validUserData, numeroEmpleado: '', usuario: 'ab' };
    const result = safeValidateUserData(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('numeroEmpleado: El número de empleado es requerido');
      expect(result.error).toContain('usuario: El usuario debe tener al menos 3 caracteres');
    }
  });
});

describe('validateField', () => {
  it('debe validar campo individual correctamente', () => {
    const result = validateField('nombreCompleto', 'Juan Pérez');
    expect(result.isValid).toBe(true);
  });

  it('debe retornar error para campo inválido', () => {
    const result = validateField('nombreCompleto', '');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('El nombre completo es requerido');
  });

  it('debe manejar campos que no existen', () => {
    const result = validateField('campoInexistente' as any, 'valor');
    expect(result.isValid).toBe(true);
  });
});

describe('Esquemas Adicionales', () => {
  describe('CreateUserSchema', () => {
    it('debe ser igual a UserDataSchema', () => {
      expect(CreateUserSchema).toBe(UserDataSchema);
    });
  });

  describe('UpdateUserSchema', () => {
    it('debe permitir campos opcionales', () => {
      const partialData = { nombreCompleto: 'Nuevo Nombre' };
      const result = UpdateUserSchema.safeParse(partialData);
      expect(result.success).toBe(true);
    });

    it('debe validar campos cuando están presentes', () => {
      const partialData = { nombreCompleto: '' };
      const result = UpdateUserSchema.safeParse(partialData);
      expect(result.success).toBe(false);
    });
  });

  describe('SearchUserSchema', () => {
    it('debe validar búsqueda válida', () => {
      const searchData = { query: 'Juan', departamento: 'IT', estado: 'Activo' as const };
      const result = SearchUserSchema.safeParse(searchData);
      expect(result.success).toBe(true);
    });

    it('debe rechazar query muy larga', () => {
      const searchData = { query: 'A'.repeat(101) };
      const result = SearchUserSchema.safeParse(searchData);
      expect(result.success).toBe(false);
    });

    it('debe rechazar estado inválido', () => {
      const searchData = { estado: 'Inválido' as any };
      const result = SearchUserSchema.safeParse(searchData);
      expect(result.success).toBe(false);
    });
  });

  describe('PaginationSchema', () => {
    it('debe usar valores por defecto', () => {
      const result = PaginationSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
      }
    });

    it('debe validar valores personalizados', () => {
      const paginationData = { page: 5, limit: 25 };
      const result = PaginationSchema.safeParse(paginationData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(5);
        expect(result.data.limit).toBe(25);
      }
    });

    it('debe rechazar página inválida', () => {
      const paginationData = { page: 0 };
      const result = PaginationSchema.safeParse(paginationData);
      expect(result.success).toBe(false);
    });

    it('debe rechazar límite muy alto', () => {
      const paginationData = { limit: 101 };
      const result = PaginationSchema.safeParse(paginationData);
      expect(result.success).toBe(false);
    });
  });
}); 
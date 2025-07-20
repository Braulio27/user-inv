import { z } from 'zod';
import type { UserData } from '@/types/user';

// Esquemas de validación para datos de usuario
export const UserDataSchema = z.object({
  numeroEmpleado: z
    .string()
    .min(1, 'El número de empleado es requerido')
    .max(20, 'El número de empleado no puede exceder 20 caracteres')
    .regex(/^[A-Za-z0-9-]+$/, 'El número de empleado solo puede contener letras, números y guiones'),
  
  nombreCompleto: z
    .string()
    .min(1, 'El nombre completo es requerido')
    .max(100, 'El nombre completo no puede exceder 100 caracteres')
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  
  usuario: z
    .string()
    .min(1, 'El usuario es requerido')
    .min(3, 'El usuario debe tener al menos 3 caracteres')
    .max(50, 'El usuario no puede exceder 50 caracteres')
    .regex(/^[a-z0-9_-]+$/, 'El usuario solo puede contener letras minúsculas, números, guiones y guiones bajos'),
  
  edificio: z
    .string()
    .min(1, 'El edificio es requerido')
    .max(50, 'El edificio no puede exceder 50 caracteres'),
  
  departamento: z
    .string()
    .min(1, 'El departamento es requerido')
    .max(100, 'El departamento no puede exceder 100 caracteres'),
  
  puesto: z
    .string()
    .min(1, 'El puesto es requerido')
    .max(100, 'El puesto no puede exceder 100 caracteres'),
  
  estadoEquipo: z.enum(['Activo', 'Inactivo', 'En reparación'], {
    errorMap: () => ({ message: 'Estado de equipo inválido' }),
  }),
  
  estadoUsuario: z.enum(['Activo', 'Inactivo', 'En reparación'], {
    errorMap: () => ({ message: 'Estado de usuario inválido' }),
  }),
  
  sistemaOperativo: z.enum(['Windows 11', 'Windows 10', 'macOS Sonoma', 'Linux'], {
    errorMap: () => ({ message: 'Sistema operativo inválido' }),
  }),
  
  serviceTag: z
    .string()
    .min(1, 'El Service Tag es requerido')
    .max(50, 'El Service Tag no puede exceder 50 caracteres')
    .regex(/^[A-Za-z0-9-]+$/, 'El Service Tag solo puede contener letras, números y guiones'),
  
  fabricante: z.enum(['Dell', 'HP', 'Apple', 'Lenovo', 'Asus', 'Acer'], {
    errorMap: () => ({ message: 'Fabricante inválido' }),
  }),
  
  tipo: z.enum(['Laptop', 'Desktop', 'Tablet'], {
    errorMap: () => ({ message: 'Tipo de equipo inválido' }),
  }),
  
  modelo: z
    .string()
    .min(1, 'El modelo es requerido')
    .max(100, 'El modelo no puede exceder 100 caracteres')
    .regex(/^[A-Za-z0-9\s-]+$/, 'El modelo solo puede contener letras, números, espacios y guiones'),
  
  direccionMac: z
    .string()
    .min(1, 'La dirección MAC es requerida')
    .regex(
      /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
      'Formato de dirección MAC inválido. Use el formato: 00:1B:44:11:3A:B7'
    ),
}) satisfies z.ZodType<UserData>;

// Esquema para crear usuario (sin ID)
export const CreateUserSchema = UserDataSchema;

// Esquema para actualizar usuario (todos los campos opcionales)
export const UpdateUserSchema = UserDataSchema.partial();

// Esquema para búsqueda
export const SearchUserSchema = z.object({
  query: z
    .string()
    .min(1, 'La búsqueda debe tener al menos 1 carácter')
    .max(100, 'La búsqueda no puede exceder 100 caracteres')
    .optional(),
  departamento: z.string().optional(),
  estado: z.enum(['Activo', 'Inactivo', 'En reparación']).optional(),
});

// Esquema para paginación
export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

// Tipos derivados de los esquemas
export type CreateUserData = z.infer<typeof CreateUserSchema>;
export type UpdateUserData = z.infer<typeof UpdateUserSchema>;
export type SearchUserData = z.infer<typeof SearchUserSchema>;
export type PaginationData = z.infer<typeof PaginationSchema>;

// Función de validación segura
export const validateUserData = (data: unknown): UserData => {
  return UserDataSchema.parse(data);
};

// Función de validación segura con manejo de errores mejorado
export const safeValidateUserData = (data: unknown): { success: true; data: UserData } | { success: false; error: string } => {
  try {
    const validatedData = UserDataSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Formatear errores de manera más amigable
      const errorMessages = error.errors.map(err => {
        const fieldName = err.path.join('.');
        return `${fieldName}: ${err.message}`;
      });
      return { success: false, error: errorMessages.join(', ') };
    }
    return { success: false, error: 'Error de validación desconocido' };
  }
};

// Función para validar campos individuales
export const validateField = (field: keyof UserData, value: string): { isValid: boolean; error?: string } => {
  try {
    const fieldSchema = UserDataSchema.shape[field];
    if (fieldSchema) {
      fieldSchema.parse(value);
      return { isValid: true };
    }
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message };
    }
    return { isValid: false, error: 'Error de validación' };
  }
}; 
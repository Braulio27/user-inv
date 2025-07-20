// Definir UserData localmente para evitar importación circular
export interface UserData {
  numeroEmpleado: string;
  nombreCompleto: string;
  usuario: string;
  edificio: string;
  departamento: string;
  puesto: string;
  estadoEquipo: 'Activo' | 'Inactivo' | 'En reparación';
  estadoUsuario: 'Activo' | 'Inactivo' | 'En reparación';
  sistemaOperativo: 'Windows 11' | 'Windows 10' | 'macOS Sonoma' | 'Linux';
  serviceTag: string;
  fabricante: 'Dell' | 'HP' | 'Apple' | 'Lenovo' | 'Asus' | 'Acer';
  tipo: 'Laptop' | 'Desktop' | 'Tablet';
  modelo: string;
  direccionMac: string;
}

// Re-exportar otros tipos desde los esquemas de Zod
export type { CreateUserData, UpdateUserData, SearchUserData, PaginationData } from '@/schemas/user';

// Tipos adicionales para la aplicación
export interface UserStats {
  total: number;
  activos: number;
  inactivos: number;
  enReparacion: number;
}

export interface UserFilters {
  departamento?: string;
  estado?: 'Activo' | 'Inactivo' | 'En reparación';
  fabricante?: string;
  sistemaOperativo?: string;
}

export interface UserSort {
  field: keyof UserData;
  direction: 'asc' | 'desc';
}

export interface UserPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserSearchResult {
  users: UserData[];
  pagination: UserPagination;
  filters: UserFilters;
}

// Tipos para la base de datos (futuro)
export interface DatabaseUser extends UserData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface DatabaseUserCreate extends Omit<DatabaseUser, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

export interface DatabaseUserUpdate extends Partial<Omit<DatabaseUser, 'id' | 'createdAt' | 'updatedAt'>> {
  updatedBy: string;
}

// Tipos para auditoría
export interface UserAuditLog {
  id: string;
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW';
  changes?: Record<string, { old: unknown; new: unknown }>;
  timestamp: Date;
  performedBy: string;
  ipAddress?: string;
  userAgent?: string;
}

// Tipos para exportación
export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  includeFields: (keyof UserData)[];
  filters?: UserFilters;
  sort?: UserSort;
}

export interface ExportResult {
  success: boolean;
  data?: string | Blob;
  filename?: string;
  error?: string;
} 
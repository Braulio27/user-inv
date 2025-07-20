export interface UserData {
  numeroEmpleado: string
  nombreCompleto: string
  usuario: string
  edificio: string
  departamento: string
  puesto: string
  estadoEquipo: string
  estadoUsuario: string
  sistemaOperativo: string
  serviceTag: string
  fabricante: string
  tipo: string
  modelo: string
  direccionMac: string
}

export type EstadoType = 'Activo' | 'Inactivo' | 'En reparación'
export type SistemaOperativoType = 'Windows 11' | 'Windows 10' | 'macOS Sonoma' | 'Linux'
export type TipoEquipoType = 'Laptop' | 'Desktop' | 'Tablet'
export type FabricanteType = 'Dell' | 'HP' | 'Apple' | 'Lenovo' | 'Asus' | 'Acer' 
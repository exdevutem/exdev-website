export interface PublicMember {
  id: string;
  nombre: string;
  carrera: string;
  anio_ingreso_carrera: number | null;
  foto_publica: boolean;
  roles: string[];
  especialidades: string[];
}

export interface ProjectMember {
  id: string;
  nombre: string;
  funcion: string | null;
}

export interface PublicProject {
  id: string;
  nombre: string;
  descripcion_breve: string | null;
  descripcion: string | null;
  estado: 'planificacion' | 'activo' | 'bloqueado' | 'pausado' | 'completado' | 'cancelado';
  fecha_inicio: string | null;
  fecha_fin: string | null;
  destacado: boolean;
  miembros: ProjectMember[];
}

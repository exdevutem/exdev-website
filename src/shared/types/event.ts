export interface PublicEvent {
  id: string;
  tipo_evento: string;
  titulo_evento: string;
  descripcion: string | null;
  fecha_inicio: string;
  fecha_fin: string | null;
  fecha_texto: string | null;
  ubicacion: string | null;
  url_evento: string | null;
  tipo_accion: 'inscripcion' | 'postulacion' | 'acceso_libre' | null;
  url_accion: string | null;
  estado: 'programado' | 'cancelado' | 'finalizado';
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPublicEvents } from '../../services/eventService';
import { PublicEvent } from '../../types/event';
import './eventsAgenda.css';

const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
export function eventDateLabel(event: PublicEvent): string {
  if (event.fecha_texto?.trim()) return event.fecha_texto;
  const [year, month, day] = event.fecha_inicio.split('-');
  const start = `${day} ${months[Number(month) - 1]}`;
  if (!event.fecha_fin || event.fecha_fin === event.fecha_inicio) return start;
  const [endYear, endMonth, endDay] = event.fecha_fin.split('-');
  if (year === endYear && month === endMonth) return `${day}–${endDay} ${months[Number(month) - 1]}`;
  const end = `${endDay} ${months[Number(endMonth) - 1]}`;
  return year === endYear ? `${start} – ${end}` : `${start} ${year} – ${end} ${endYear}`;
}

// Reject executable schemes, protocol-relative URLs and backslash URL tricks.
export function safeEventUrl(value: string | null): string | null {
  if (!value || /[\s\\]/.test(value)) return null;
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

export function EventRow({ event }: { event: PublicEvent }) {
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
  const past = (event.fecha_fin ?? event.fecha_inicio) < today;
  const href = event.estado === 'programado' && !past ? safeEventUrl(event.url_accion) : null;
  const label = event.tipo_accion === 'postulacion' ? 'Postularse' : event.tipo_accion === 'inscripcion' ? 'Inscribirse' : null;
  const className = `event-action event-action-${event.tipo_accion}`;
  const status = event.estado === 'cancelado' ? 'Cancelado' : event.estado === 'finalizado' || past ? 'Finalizado' : null;
  return (
    <li className='event-row'>
      <div className='event-date' aria-label={`Desde ${event.fecha_inicio}${event.fecha_fin ? ` hasta ${event.fecha_fin}` : ''}`}>
        <time dateTime={event.fecha_inicio}>{eventDateLabel(event)}</time>
      </div>
      <div className='event-details'>
        <h3>{event.titulo_evento}</h3>
        {event.descripcion && <p>{event.descripcion}</p>}
      </div>
      <div className='event-trailing'>
        {href && label ? (href.startsWith('/')
          ? <Link className={className} to={href} aria-label={`${label}: ${event.titulo_evento}`}>{label}</Link>
          : <a className={className} href={href} target='_blank' rel='noopener noreferrer' aria-label={`${label}: ${event.titulo_evento} (abre otra pestaña)`}>{label}</a>)
          : <span className='event-note'>{status || (event.tipo_accion === 'acceso_libre' ? 'Abierto a todos' : '')}</span>}
      </div>
    </li>
  );
}

export default function EventsAgenda({ preview = false }: { preview?: boolean }) {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(false);
    getPublicEvents(preview, page * 20, controller.signal)
      .then(result => { if (!controller.signal.aborted) { setEvents(result.data); setHasMore(result.hasMore); } })
      .catch(() => { if (!controller.signal.aborted) setError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [preview, page, attempt]);
  if (loading) return <p className='events-message' role='status'>Cargando agenda…</p>;
  if (error) return <div className='events-message'><p role='alert'>No pudimos cargar la agenda en este momento.</p><button type='button' onClick={() => setAttempt(value => value + 1)}>Reintentar</button></div>;
  return <>
    {events.length ? <ul className='events-list'>{events.map(event => <EventRow key={event.id} event={event} />)}</ul>
      : <p className='events-message'>{preview ? 'Pronto anunciaremos nuevas actividades.' : 'No hay eventos publicados en esta página.'}</p>}
    {!preview && (page > 0 || hasMore) && <nav className='events-pagination' aria-label='Páginas de la agenda'>
      <button type='button' disabled={page === 0} onClick={() => setPage(value => value - 1)}>Anterior</button>
      <span>Página {page + 1}</span>
      <button type='button' disabled={!hasMore} onClick={() => setPage(value => value + 1)}>Siguiente</button>
    </nav>}
  </>;
}

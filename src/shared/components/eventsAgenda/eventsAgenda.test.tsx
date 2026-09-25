import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EventsAgenda, { EventRow, eventDateLabel, safeEventUrl } from './eventsAgenda';
import { PublicEvent } from '../../types/event';
import { getPublicEvents } from '../../services/eventService';
jest.mock('../../services/eventService');
// CRA's Jest resolver predates React Router 7 package exports. Isolate routing
// here; these unit tests verify the agenda and the destination rendered by Link.
jest.mock('react-router-dom', () => ({
  MemoryRouter: ({ children }: any) => children,
  Link: ({ to, children, ...props }: any) => <a href={to} {...props}>{children}</a>,
}), { virtual: true });
const getEvents = getPublicEvents as jest.MockedFunction<typeof getPublicEvents>;
const event: PublicEvent = {
  id: '1', tipo_evento: 'feria', titulo_evento: 'Feria Vive la Investigación',
  descripcion: 'Exhibición del club · sin inscripción', fecha_inicio: '2099-10-14',
  fecha_fin: '2099-10-15', fecha_texto: null, ubicacion: null, url_evento: null,
  tipo_accion: null, url_accion: null, estado: 'programado',
};
beforeEach(() => jest.resetAllMocks());
test('formats date-only ranges without timezone shifts and honors custom labels', () => {
  expect(eventDateLabel(event)).toBe('14–15 OCT');
  expect(eventDateLabel({ ...event, fecha_fin: null })).toBe('14 OCT');
  expect(eventDateLabel({ ...event, fecha_texto: '14 y 15 OCT' })).toBe('14 y 15 OCT');
});
test('rejects unsafe links', () => {
  for (const url of ['javascript:alert(1)', '//evil.test', '/\\evil.test', 'data:text/html,test']) expect(safeEventUrl(url)).toBeNull();
  expect(safeEventUrl('/apply')).toBe('/apply');
  expect(safeEventUrl('https://example.com/form')).toBe('https://example.com/form');
});
test('renders internal application action', () => {
  render(<MemoryRouter><ul><EventRow event={{ ...event, tipo_accion: 'postulacion', url_accion: '/apply' }} /></ul></MemoryRouter>);
  expect(screen.getByRole('link', { name: /Postularse/ }).getAttribute('href')).toBe('/apply');
});
test('renders external inscription safely', () => {
  render(<MemoryRouter><ul><EventRow event={{ ...event, tipo_accion: 'inscripcion', url_accion: 'https://example.com/form' }} /></ul></MemoryRouter>);
  expect(screen.getByRole('link', { name: /Inscribirse/ }).getAttribute('rel')).toBe('noopener noreferrer');
});
test('does not invent an action for an event without inscription', () => {
  render(<MemoryRouter><ul><EventRow event={event} /></ul></MemoryRouter>);
  expect(screen.queryByRole('link')).toBeNull();
});
test('hides actions for cancelled events', () => {
  render(<MemoryRouter><ul><EventRow event={{ ...event, estado: 'cancelado', tipo_accion: 'postulacion', url_accion: '/apply' }} /></ul></MemoryRouter>);
  expect(screen.queryByRole('link')).toBeNull();
  expect(screen.getByText('Cancelado')).toBeTruthy();
});
test('shows free access and description but hides location in the list', () => {
  const { container } = render(<MemoryRouter><ul><EventRow event={{ ...event, tipo_accion: 'acceso_libre', ubicacion: 'UTEM — campus Macul' }} /></ul></MemoryRouter>);
  expect(container.querySelector('.event-trailing')?.textContent).toBe('Abierto a todos');
  expect(container.querySelector('.event-details')?.textContent).toContain(event.descripcion);
  expect(screen.queryByText('UTEM — campus Macul')).toBeNull();
  expect(screen.queryByRole('link')).toBeNull();
});
test('does not substitute location for a missing action', () => {
  const { container } = render(<MemoryRouter><ul><EventRow event={{ ...event, ubicacion: 'Campus Macul' }} /></ul></MemoryRouter>);
  expect(container.querySelector('.event-trailing')?.textContent).toBe('');
  expect(screen.queryByText('Abierto a todos')).toBeNull();
});
test('cancelled free-access event shows cancellation instead', () => {
  render(<MemoryRouter><ul><EventRow event={{ ...event, tipo_accion: 'acceso_libre', estado: 'cancelado' }} /></ul></MemoryRouter>);
  expect(screen.getByText('Cancelado')).toBeTruthy();
  expect(screen.queryByText('Abierto a todos')).toBeNull();
});
test('loads the preview independently', async () => {
  getEvents.mockResolvedValue({ data: [event], hasMore: false });
  render(<MemoryRouter><EventsAgenda preview /></MemoryRouter>);
  expect(screen.getByRole('status')).toBeTruthy();
  expect(await screen.findByText(event.titulo_evento)).toBeTruthy();
  expect(getEvents.mock.calls[0][0]).toBe(true);
});
test('shows empty state', async () => {
  getEvents.mockResolvedValue({ data: [], hasMore: false });
  render(<MemoryRouter><EventsAgenda preview /></MemoryRouter>);
  expect(await screen.findByText('Pronto anunciaremos nuevas actividades.')).toBeTruthy();
});
test('allows retry after an error', async () => {
  getEvents.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ data: [event], hasMore: false });
  render(<MemoryRouter><EventsAgenda /></MemoryRouter>);
  await screen.findByRole('alert');
  fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
  expect(await screen.findByText(event.titulo_evento)).toBeTruthy();
});
test('paginates complete agenda', async () => {
  getEvents.mockResolvedValue({ data: [event], hasMore: true });
  render(<MemoryRouter><EventsAgenda /></MemoryRouter>);
  fireEvent.click(await screen.findByRole('button', { name: 'Siguiente' }));
  await waitFor(() => expect(getEvents.mock.calls[1][1]).toBe(20));
});

import { Link } from 'react-router-dom';
import EventsAgenda from '../../shared/components/eventsAgenda/eventsAgenda';

export default function Events() {
  return <main className='events-page'>
    <header className='events-page-header'>
      <Link to='/'>← Inicio</Link>
      <h1>Agenda del club</h1>
      <p>Charlas, talleres, ferias y convocatorias de ExDev. Fechas y horarios de Chile.</p>
    </header>
    <section aria-label='Eventos publicados'><EventsAgenda /></section>
  </main>;
}

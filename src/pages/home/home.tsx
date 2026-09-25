import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import GalleryIMG1 from '../../assets/img/IMG_9483.webp';
import GalleryIMG2 from '../../assets/img/IMG_9468.webp';
import GalleryIMG3 from '../../assets/img/feria-exdev-img4.webp';
import GalleryIMG4 from '../../assets/img/feria-exdev-5.webp';
import GitHubIcon from '../../shared/icons/GitHubIcon';
import LinkedInIcon from '../../shared/icons/LinkedIn';
import InstagramIcon from '../../shared/icons/InstagramIcon';
import { MemberCard, ProjectCard } from '../../shared/components/contentCards/contentCards';
import { getPublicMembers, getPublicProjects } from '../../shared/services/contentService';
import { PublicMember, PublicProject } from '../../shared/types/content';
import EventsAgenda from '../../shared/components/eventsAgenda/eventsAgenda';

function Home() {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [members, setMembers] = useState<PublicMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [contentError, setContentError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([getPublicProjects(4, controller.signal), getPublicMembers(4, controller.signal)])
      .then(([projectData, memberData]) => { setProjects(projectData); setMembers(memberData); })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setContentError(true);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  return (
    <main className='home-page'>
      <section className='presentation' aria-labelledby='home-title'>
        <div className='club-presentation'>
          <header className='text'>
            <p className='home-eyebrow fade-in-left'>UTEM · EXDEV</p>
            <h1 id='home-title' className='fade-in-left'>Club de Desarrollo Experimental</h1>
            <p className='home-subtitle fade-in-right'>Somos un club que une los conceptos <strong>experimentar</strong> y <strong>desarrollar</strong>.</p>
            <nav className='home-actions fade-in-right' aria-label='Acciones principales'>
              <Link className='home-action home-action-primary' to='/apply'>Postular al club</Link>
              <Link className='home-action home-action-secondary' to='/projects'>Ver proyectos</Link>
            </nav>
          </header>
          <nav className='social-icons delay-2' aria-label='Redes sociales de ExDev'>
            <a href='https://www.linkedin.com/company/exdevutem' target='_blank' rel='noopener noreferrer' aria-label='LinkedIn de ExDev'><LinkedInIcon className='social-icon' /></a>
            <a href='https://github.com/exdevutem' target='_blank' rel='noopener noreferrer' aria-label='GitHub de ExDev'><GitHubIcon className='social-icon' /></a>
            <a href='https://www.instagram.com/exdevutem' target='_blank' rel='noopener noreferrer' aria-label='Instagram de ExDev'><InstagramIcon className='social-icon instagram' /></a>
          </nav>
        </div>
        <figure className='gallery fade-in-bottom delay-2' aria-label='Actividades de ExDev'>
          <img src={GalleryIMG1} alt='Integrantes de ExDev en una actividad del club' />
          <img src={GalleryIMG2} alt='Comunidad ExDev participando en una actividad' />
          <img src={GalleryIMG3} alt='Presentación de ExDev en una feria universitaria' />
          <img src={GalleryIMG4} alt='Stand de proyectos de ExDev' />
        </figure>
      </section>

      <section className='content-preview' aria-labelledby='featured-projects-title'>
        <header className='section-heading'>
          <p className='section-kicker' id='featured-projects-title'>Proyectos</p>
          <Link to='/projects'>Todos los proyectos <span aria-hidden='true'>→</span></Link>
        </header>
        {loading && <p className='content-message' role='status'>Cargando proyectos…</p>}
        {!loading && contentError && <p className='content-message' role='alert'>No pudimos cargar los proyectos en este momento.</p>}
        {!loading && !contentError && projects.length === 0 && <p className='content-message'>Aún no hay proyectos publicados.</p>}
        {projects.length > 0 && <div className='content-grid projects-grid'>{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>}
      </section>

      <section className='content-preview events-preview' aria-labelledby='upcoming-events-title'>
        <header className='events-heading'>
          <h2 id='upcoming-events-title'>Lo que viene</h2>
          <Link to='/events'>Agenda completa <span aria-hidden='true'>→</span></Link>
        </header>
        <EventsAgenda preview />
      </section>

      <section className='content-preview' aria-labelledby='members-title'>
        <header className='section-heading'><div><p className='section-kicker'>Quiénes somos</p></div></header>
        {loading && <p className='content-message' role='status'>Cargando miembros…</p>}
        {!loading && contentError && <p className='content-message' role='alert'>No pudimos cargar los miembros en este momento.</p>}
        {!loading && !contentError && members.length === 0 && <p className='content-message'>Aún no hay perfiles públicos.</p>}
        {members.length > 0 && <div className='content-grid members-grid'>{members.map((member) => <MemberCard key={member.id} member={member} />)}</div>}
      </section>
    </main>
  );
}

export default Home;

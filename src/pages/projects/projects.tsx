import { useEffect, useState } from 'react';
import { ProjectCard } from '../../shared/components/contentCards/contentCards';
import { getPublicProjects } from '../../shared/services/contentService';
import { PublicProject } from '../../shared/types/content';
import './projects.css';

function Projects() {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getPublicProjects(100, controller.signal)
      .then(setProjects)
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        setError(true);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  return (
    <main className='projects-page'>
      <header className='projects-page-header'>
        <p className='section-kicker'>Portafolio ExDev</p>
        <h1>Proyectos</h1>
        <p>Ideas que llevamos desde la experimentación hasta soluciones reales.</p>
      </header>
      {loading && <p className='content-message' role='status'>Cargando proyectos…</p>}
      {!loading && error && <p className='content-message' role='alert'>No pudimos cargar los proyectos en este momento.</p>}
      {!loading && !error && projects.length === 0 && <p className='content-message'>Aún no hay proyectos publicados.</p>}
      {projects.length > 0 && <section className='content-grid projects-grid' aria-label='Proyectos publicados'>{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</section>}
    </main>
  );
}

export default Projects;

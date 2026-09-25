import { PublicMember, PublicProject } from '../../types/content';
import './contentCards.css';

export function ProjectCard({ project }: { project: PublicProject }) {
  const stateLabels: Record<PublicProject['estado'], string> = {
    planificacion: 'En planificación',
    activo: 'Activo',
    bloqueado: 'Bloqueado',
    pausado: 'Pausado',
    completado: 'Completado',
    cancelado: 'Cancelado',
  };
  const memberCount = project.miembros.length;
  const teamLabel = memberCount === 1 ? '1 persona' : `${memberCount} personas`;

  return (
    <article className={`project-preview-card status-${project.estado}`}>
      <p className='project-meta'>
        <span className='project-status-dot' aria-hidden='true' />
        <span>{stateLabels[project.estado]}{memberCount > 0 && ` · ${teamLabel}`}</span>
      </p>
      <h3>{project.nombre}</h3>
      <p className='project-description'>{project.descripcion_breve || project.descripcion || 'Proyecto de ExDev.'}</p>
    </article>
  );
}

export function MemberCard({ member }: { member: PublicMember }) {
  const initials = member.nombre.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  return (
    <article className='content-card member-preview-card'>
      <div className='member-avatar' aria-hidden='true'>{initials}</div>
      <h3>{member.nombre}</h3>
      {member.roles.length > 0 && <p className='member-role'>{member.roles.join(' · ')}</p>}
      {member.especialidades.length > 0 && <p className='member-specialties'>{member.especialidades.join(' · ')}</p>}
    </article>
  );
}

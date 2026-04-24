import ProjectPreview from './ProjectPreview'

function ProjectDetail({ project }) {
	if (!project) {
		return (
			<section className="project-detail project-detail--empty">
				<p>Sélectionne un projet pour afficher son aperçu.</p>
			</section>
		)
	}

	return (
		<section className="project-detail" aria-labelledby={`project-title-${project.id}`}>
			<div className="project-detail__header">
				<div>
					<p className="project-detail__label">Projet sélectionné</p>
					<h3 id={`project-title-${project.id}`} className="project-detail__title">
						{project.title}
					</h3>
				</div>

				<div className="project-detail__links">
					{project.github && (
						<a href={project.github} target="_blank" rel="noreferrer noopener">
							GitHub
						</a>
					)}
					{project.demo && (
						<a href={project.demo} target="_blank" rel="noreferrer noopener">
							Demo
						</a>
					)}
				</div>
			</div>

			<div className="project-detail__top">
				<div className="project-card-block project-trailer">
					<p className="project-card-block__label">Preview</p>
					<ProjectPreview project={project} />
				</div>

				<div className="project-card-block project-stack">
					<p className="project-card-block__label">Stack</p>
					<ul className="project-stack__list">
						{project.stack.map((tech) => (
							<li key={tech} className="project-stack__chip">
								{tech}
							</li>
						))}
					</ul>
				</div>
			</div>

			<div className="project-card-block project-description">
				<p className="project-card-block__label">Description</p>
				<p className="project-description__text">{project.description}</p>
			</div>
		</section>
	)
}

export default ProjectDetail

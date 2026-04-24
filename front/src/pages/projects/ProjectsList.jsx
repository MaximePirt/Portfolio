function ProjectsList({ projects, selectedProjectId, onSelect }) {
	if (!projects.length) {
		return (
			<aside className="projects-list projects-list--empty">
				<p>Aucun projet pour ce filtre.</p>
			</aside>
		)
	}

	return (
		<aside className="projects-list" aria-label="Liste des projets">
			{projects.map((project) => {
				const isActive = project.id === selectedProjectId

				return (
					<button
						key={project.id}
						type="button"
						className={`project-pill ${isActive ? 'is-active' : ''}`}
						onClick={() => onSelect(project.id)}
						aria-pressed={isActive}
					>
						<span className="project-pill__title">{project.title}</span>
						<span className="project-pill__meta">{project.meta}</span>
					</button>
				)
			})}
		</aside>
	)
}

export default ProjectsList

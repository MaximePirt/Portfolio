import { useTranslation } from "react-i18next"

function ProjectsList({ projects, selectedProjectId, onSelect }) {
	const { t } = useTranslation()

	if (!projects.length) {
		return (
			<aside className="projects-list projects-list--empty" aria-label="Liste des projets vide">
				<p>Aucun projet correspondant encore uploadé.</p>
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
						<span className="project-pill__title">{t(project.titleKey)}</span>
						<span className="project-pill__meta">{t(project.metaKey)}</span>
					</button>
				)
			})}
		</aside>
	)
}

export default ProjectsList

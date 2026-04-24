import { useMemo, useState } from 'react'
import { PROJECTS, PROJECT_FILTERS } from './projects.data'
import ProjectsList from './ProjectsList'
import ProjectDetail from './ProjectDetail'
import '../../styles/projects.css'

function ProjectsSection() {
	const [activeFilter, setActiveFilter] = useState('all')
	const [selectedProjectId, setSelectedProjectId] = useState(PROJECTS[0]?.id ?? null)

	const filteredProjects = useMemo(() => {
		if (activeFilter === 'all') return PROJECTS
		return PROJECTS.filter((project) => project.categories.includes(activeFilter))
	}, [activeFilter])

	const selectedProject =
		filteredProjects.find((project) => project.id === selectedProjectId) ||
		filteredProjects[0] ||
		null

	return (
		<section className="projects-section" id="project">
			<div className="projects-shell">
				<header className="projects-header">
					<h2 className="projects-header__title">PROJECTS</h2>
					<p className="projects-header__subtitle">
						Une sélection de mes projets techniques, scolaires et freelance.
					</p>
				</header>

				<div className="projects-toolbar" aria-label="Filtres projets">
					{PROJECT_FILTERS.map((filter) => {
						const isActive = filter.value === activeFilter

						return (
							<button
								key={filter.value}
								type="button"
								className={`projects-filter ${isActive ? 'is-active' : ''}`}
								onClick={() => {
									setActiveFilter(filter.value)

									const nextProjects =
										filter.value === 'all'
											? PROJECTS
											: PROJECTS.filter((project) =>
													project.categories.includes(filter.value)
											  )

									if (!nextProjects.some((project) => project.id === selectedProjectId)) {
										setSelectedProjectId(nextProjects[0]?.id ?? null)
									}
								}}
								aria-pressed={isActive}
							>
								{filter.label}
							</button>
						)
					})}
				</div>

				<div className="projects-layout">
					<ProjectsList
						projects={filteredProjects}
						selectedProjectId={selectedProject?.id ?? null}
						onSelect={setSelectedProjectId}
					/>

					<ProjectDetail project={selectedProject} />
				</div>
			</div>
		</section>
	)
}

export default ProjectsSection

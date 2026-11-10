import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PROJECTS } from './projects.data'
import { getAvailableFilters, matchesFilter } from './lib/projectFilters.js'
import ProjectFilters from './ProjectFilters'
import ProjectsList from './ProjectsList'
import ProjectDetail from './ProjectDetail'
import '../../styles/projects.css'

const AVAILABLE_FILTERS = getAvailableFilters(PROJECTS)

function ProjectsSection() {
	const [activeFilter, setActiveFilter] = useState('all')
	const [selectedProjectId, setSelectedProjectId] = useState(PROJECTS[0]?.id ?? null)
	const { t } = useTranslation()

	const filteredProjects = useMemo(
		() => PROJECTS.filter((project) => matchesFilter(project, activeFilter)),
		[activeFilter]
	)

	const selectedProject =
		filteredProjects.find((project) => project.id === selectedProjectId) ||
		filteredProjects[0] ||
		null

	return (
		<section className="projects-section" id="project">
			<div className="projects-shell">
				<header className="projects-header">
					<h2 className="projects-header__title">{t('projectsSection.title')}</h2>
					<p className="projects-header__subtitle">{t('projectsSection.subtitle')}</p>
				</header>

				<ProjectFilters
					filters={AVAILABLE_FILTERS}
					activeFilter={activeFilter}
					onChange={setActiveFilter}
				/>

				<div className="projects-layout">
					<ProjectsList
						key={activeFilter}
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

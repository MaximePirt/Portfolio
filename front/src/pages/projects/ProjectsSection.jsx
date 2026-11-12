import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useProjects from './useProjects'
import { getAvailableFilters, matchesFilter } from './lib/projectFilters.js'
import ProjectFilters from './ProjectFilters'
import ProjectsList from './ProjectsList'
import ProjectDetail from './ProjectDetail'
import '../../styles/projects.css'

/**
 * @brief Projects section: filters, list of projects and detail of the selected one.
 * @returns {JSX.Element} The section.
 */
function ProjectsSection() {
	const [activeFilter, setActiveFilter] = useState('all')
	const [selectedProjectId, setSelectedProjectId] = useState(null)
	const { t } = useTranslation()
	const { projects, status } = useProjects()

	const availableFilters = useMemo(() => getAvailableFilters(projects), [projects])

	const filteredProjects = useMemo(
		() => projects.filter((project) => matchesFilter(project, activeFilter)),
		[projects, activeFilter]
	)

	const selectedProject =
		filteredProjects.find((project) => project.id === selectedProjectId) ||
		filteredProjects[0] ||
		null

	return (
		<section className="projects-section" id="project" aria-busy={status === 'loading'}>
			<div className="projects-shell">
				<header className="projects-header">
					<h2 className="projects-header__title">{t('projectsSection.title')}</h2>
					<p className="projects-header__subtitle">{t('projectsSection.subtitle')}</p>
				</header>

				<ProjectFilters
					filters={availableFilters}
					activeFilter={activeFilter}
					onChange={setActiveFilter}
				/>

				<div className="projects-layout">
					<ProjectsList
						key={activeFilter}
						projects={filteredProjects}
						selectedProjectId={selectedProject?.id ?? null}
						onSelect={setSelectedProjectId}
						isLoading={status === 'loading'}
					/>

					<ProjectDetail project={selectedProject} />
				</div>
			</div>
		</section>
	)
}

export default ProjectsSection

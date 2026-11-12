import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useProjects from './useProjects'
import {
	getAvailableFilters,
	getAvailableLanguages,
	matchesFilter,
	matchesLanguages,
	toggleValue,
} from './lib/projectFilters.js'
import LanguageFilter from './LanguageFilter'
import ProjectFilters from './ProjectFilters'
import ProjectsList from './ProjectsList'
import ProjectDetail from './ProjectDetail'
import useReveal from '../../components/ui/useReveal'
import '../../styles/projects.css'

/**
 * @brief Projects section: filters, list of projects and detail of the selected one.
 * @returns {JSX.Element} The section.
 */
function ProjectsSection() {
	const [activeFilter, setActiveFilter] = useState('all')
	const [selectedLanguages, setSelectedLanguages] = useState([])
	const [selectedProjectId, setSelectedProjectId] = useState(null)
	const { t } = useTranslation()
	const { projects, status } = useProjects()
	const [shellRef, isRevealed] = useReveal()

	const availableFilters = useMemo(() => getAvailableFilters(projects), [projects])

	const categoryProjects = useMemo(
		() => projects.filter((project) => matchesFilter(project, activeFilter)),
		[projects, activeFilter]
	)

	const availableLanguages = useMemo(
		() => getAvailableLanguages(categoryProjects, selectedLanguages),
		[categoryProjects, selectedLanguages]
	)

	const filteredProjects = useMemo(
		() => categoryProjects.filter((project) => matchesLanguages(project, selectedLanguages)),
		[categoryProjects, selectedLanguages]
	)

	const selectedProject =
		filteredProjects.find((project) => project.id === selectedProjectId) ||
		filteredProjects[0] ||
		null

	/**
	 * @brief Selects or unselects a language of the language filter.
	 * @param {string} language - Clicked language.
	 */
	const toggleLanguage = (language) => {
		setSelectedLanguages((languages) => toggleValue(languages, language))
	}

	return (
		<section className="projects-section" id="project" aria-busy={status === 'loading'}>
			<div ref={shellRef} className={`projects-shell ${isRevealed ? 'is-revealed' : ''}`}>
				<header className="projects-header reveal">
					<h2 className="projects-header__title">{t('projectsSection.title')}</h2>
					<p className="projects-header__subtitle">{t('projectsSection.subtitle')}</p>
				</header>

				<LanguageFilter
					languages={availableLanguages}
					selected={selectedLanguages}
					onToggle={toggleLanguage}
					onReset={() => setSelectedLanguages([])}
				>
					<ProjectFilters
						filters={availableFilters}
						activeFilter={activeFilter}
						onChange={setActiveFilter}
					/>
				</LanguageFilter>

				<div className="projects-layout">
					<ProjectsList
						key={`${activeFilter}|${selectedLanguages.join(',')}`}
						projects={filteredProjects}
						selectedProjectId={selectedProject?.id ?? null}
						onSelect={setSelectedProjectId}
						isLoading={status === 'loading'}
					/>

					<ProjectDetail key={selectedProject?.id ?? 'empty'} project={selectedProject} />
				</div>
			</div>
		</section>
	)
}

export default ProjectsSection

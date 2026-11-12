import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence } from 'motion/react'
import useProjects from './useProjects'
import {
	getAvailableDomains,
	getAvailableLanguages,
	getAvailableOrigins,
	matchesDomains,
	matchesLanguages,
	matchesOrigin,
	toggleValue,
} from './lib/projectFilters.js'
import FilterPanel from './FilterPanel'
import ProjectFilters from './ProjectFilters'
import ProjectsList from './ProjectsList'
import ProjectDetail from './ProjectDetail'
import ProjectSheet from './ProjectSheet'
import useProjectText from './useProjectText'
import SectionHeader from '../../components/ui/SectionHeader'
import useMediaQuery from '../../components/ui/useMediaQuery'
import useReveal from '../../components/ui/useReveal'
import '../../styles/projects.css'

// Below this width the detail opens in a bottom sheet instead of sitting next to the list.
const SHEET_QUERY = '(max-width: 899px)'

/**
 * @brief Projects section: filters, list of projects and detail of the selected one
 * (next to the list on large screens, in a bottom sheet on small ones).
 * @returns {JSX.Element} The section.
 */
function ProjectsSection() {
	const [origin, setOrigin] = useState(null)
	const [selectedDomains, setSelectedDomains] = useState([])
	const [selectedLanguages, setSelectedLanguages] = useState([])
	const [selectedProjectId, setSelectedProjectId] = useState(null)
	const [isSheetOpen, setIsSheetOpen] = useState(false)
	const usesSheet = useMediaQuery(SHEET_QUERY)
	const getText = useProjectText()
	const { t } = useTranslation()
	const { projects, status } = useProjects()
	const [shellRef, isRevealed] = useReveal()

	const availableOrigins = useMemo(() => getAvailableOrigins(projects), [projects])

	// Each step narrows the previous one: origin, then domains, then languages (counts follow).
	const originProjects = useMemo(
		() => projects.filter((project) => matchesOrigin(project, origin)),
		[projects, origin]
	)

	const domainProjects = useMemo(
		() => originProjects.filter((project) => matchesDomains(project, selectedDomains)),
		[originProjects, selectedDomains]
	)

	const availableDomains = useMemo(
		() => getAvailableDomains(originProjects, selectedDomains),
		[originProjects, selectedDomains]
	)

	const availableLanguages = useMemo(
		() => getAvailableLanguages(domainProjects, selectedLanguages),
		[domainProjects, selectedLanguages]
	)

	const filteredProjects = useMemo(
		() => domainProjects.filter((project) => matchesLanguages(project, selectedLanguages)),
		[domainProjects, selectedLanguages]
	)

	const selectedProject =
		filteredProjects.find((project) => project.id === selectedProjectId) ||
		filteredProjects[0] ||
		null

	const filterGroups = [
		{
			id: 'domains',
			title: t('projectsSection.languageFilter.domainsTitle'),
			chips: availableDomains,
			selected: selectedDomains,
			onToggle: (domain) => setSelectedDomains((domains) => toggleValue(domains, domain)),
		},
		{
			id: 'languages',
			title: t('projectsSection.languageFilter.title'),
			chips: availableLanguages,
			selected: selectedLanguages,
			onToggle: (language) => setSelectedLanguages((languages) => toggleValue(languages, language)),
		},
	]

	const hasFilters = Boolean(origin) || selectedDomains.length > 0 || selectedLanguages.length > 0

	/**
	 * @brief Clears every filter: origin pill, categories and languages.
	 */
	const resetFilters = () => {
		setOrigin(null)
		setSelectedDomains([])
		setSelectedLanguages([])
	}

	/**
	 * @brief Selects a project, and opens its sheet on small screens.
	 * @param {string} projectId - Id of the clicked project.
	 */
	const selectProject = (projectId) => {
		setSelectedProjectId(projectId)
		if (usesSheet) setIsSheetOpen(true)
	}

	return (
		<section className="projects-section" id="project" aria-busy={status === 'loading'}>
			<div ref={shellRef} className={`projects-shell ${isRevealed ? 'is-revealed' : ''}`}>
				<SectionHeader
					eyebrow={t('projectsSection.eyebrow')}
					title={t('projectsSection.title')}
					subtitle={t('projectsSection.subtitle')}
				/>

				<FilterPanel groups={filterGroups} hasFilters={hasFilters} onReset={resetFilters}>
					<ProjectFilters
						filters={availableOrigins}
						activeFilter={origin}
						onChange={setOrigin}
					/>
				</FilterPanel>

				<div className="projects-layout">
					<ProjectsList
						key={[origin, ...selectedDomains, ...selectedLanguages].join('|')}
						projects={filteredProjects}
						selectedProjectId={selectedProject?.id ?? null}
						onSelect={selectProject}
						isLoading={status === 'loading'}
					/>

					{!usesSheet && (
						<AnimatePresence mode="wait" initial={false}>
							<ProjectDetail key={selectedProject?.id ?? 'empty'} project={selectedProject} />
						</AnimatePresence>
					)}
				</div>

				<AnimatePresence>
					{usesSheet && isSheetOpen && selectedProject && (
						<ProjectSheet
							label={getText(selectedProject, 'title')}
							onClose={() => setIsSheetOpen(false)}
						>
							<ProjectDetail project={selectedProject} />
						</ProjectSheet>
					)}
				</AnimatePresence>
			</div>
		</section>
	)
}

export default ProjectsSection

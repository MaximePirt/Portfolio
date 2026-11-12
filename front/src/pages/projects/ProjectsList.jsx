import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import useProjectText from './useProjectText'
import ProjectStatusBadge from './ProjectStatusBadge'
import { SPRING } from '../../lib/motion'

const MotionSpan = motion.span

// Number of projects revealed on each click of "Show more".
const PAGE_SIZE = 6

/**
 * @brief Side list of project pills. Shows the first PAGE_SIZE projects and reveals
 * PAGE_SIZE more on each click of the "Show more" button. Clicking a pill selects that project.
 * @param {Object} props
 * @param {Array<Object>} props.projects - Projects to display, in order.
 * @param {string|null} props.selectedProjectId - Id of the currently selected project.
 * @param {(projectId: string) => void} props.onSelect - Called with the id of the clicked project.
 * @param {boolean} [props.isLoading] - True while the GitHub projects are still being fetched.
 * @returns {JSX.Element} The project list, or an empty-state message when there are no projects.
 */
function ProjectsList({ projects, selectedProjectId, onSelect, isLoading = false }) {
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
	const { t } = useTranslation()
	const getText = useProjectText()

	if (!projects.length) {
		return (
			<aside className="projects-list projects-list--empty" aria-label={t('projectsSection.listLabel')}>
				<p>{t('projectsSection.emptyList')}</p>
			</aside>
		)
	}

	const visibleProjects = projects.slice(0, visibleCount)
	const hiddenCount = projects.length - visibleProjects.length

	return (
		<aside className="projects-list" aria-label={t('projectsSection.listLabel')}>
			<div className="projects-list__body">
				<div className="projects-list__scroll">
					{visibleProjects.map((project, index) => {
						const isActive = project.id === selectedProjectId

						return (
							<button
								key={project.id}
								type="button"
								className={`project-pill ${isActive ? 'is-active' : ''}`}
								style={{ '--pill-delay': index % PAGE_SIZE }}
								onClick={() => onSelect(project.id)}
								aria-pressed={isActive}
							>
								{isActive && (
									<MotionSpan
										layoutId="project-pill-highlight"
										className="project-pill__highlight"
										transition={SPRING}
										aria-hidden="true"
									/>
								)}
								<span className="project-pill__title">
									{getText(project, 'title')}
									<ProjectStatusBadge status={project.status} />
								</span>
								<span className="project-pill__meta">{getText(project, 'summary')}</span>
							</button>
						)
					})}
				</div>

				{isLoading && (
					<p className="projects-list__status" role="status">{t('projectsSection.loading')}</p>
				)}

				{hiddenCount > 0 && (
					<button
						type="button"
						className="project-pill project-pill--more"
						style={{ '--pill-delay': PAGE_SIZE }}
						onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
					>
						{t('projectsSection.showMore', { count: hiddenCount })}
					</button>
				)}
			</div>
		</aside>
	)
}

export default ProjectsList

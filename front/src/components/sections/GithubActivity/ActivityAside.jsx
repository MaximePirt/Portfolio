import { useTranslation } from 'react-i18next'
import { IoOpenOutline } from 'react-icons/io5'
import useProjects from '../../../pages/projects/useProjects'
import useProjectText from '../../../pages/projects/useProjectText'
import { getLatestProjects, getTopLanguages } from '../../../pages/projects/lib/projectStats.js'

const LANGUAGE_LIMIT = 5
const LATEST_LIMIT = 3

/**
 * @brief Side column of the activity section: languages used across my projects (bars),
 * then my latest projects with a link to their repository. Built from the same project data
 * as the projects section.
 * @returns {JSX.Element|null} The column, or nothing while there is no project to show.
 */
function ActivityAside() {
	const { t } = useTranslation()
	const getText = useProjectText()
	const { projects } = useProjects()

	const languages = getTopLanguages(projects, LANGUAGE_LIMIT)
	const latestProjects = getLatestProjects(projects, LATEST_LIMIT)
	const maxCount = languages[0]?.count ?? 1

	if (!languages.length && !latestProjects.length) return null

	return (
		<aside className="activity-aside">
			{languages.length > 0 && (
				<section className="activity-panel reveal" style={{ '--reveal-index': 3 }}>
					<h3 className="activity-panel__title">{t('githubActivity.languagesTitle')}</h3>
					<ul className="activity-languages">
						{languages.map((language, index) => (
							<li key={language.value} className="activity-languages__item">
								<span className="activity-languages__name">
									{language.labelKey ? t(language.labelKey) : language.label}
								</span>
								<span className="activity-languages__count">
									{t('githubActivity.languagesCount', { count: language.count })}
								</span>
								<span className="activity-languages__track" aria-hidden="true">
									<span
										className="activity-languages__fill"
										style={{ '--ratio': language.count / maxCount, '--bar-index': index }}
									/>
								</span>
							</li>
						))}
					</ul>
				</section>
			)}

			{latestProjects.length > 0 && (
				<section className="activity-panel reveal" style={{ '--reveal-index': 4 }}>
					<h3 className="activity-panel__title">{t('githubActivity.recentTitle')}</h3>
					<ul className="activity-projects">
						{latestProjects.map((project) => {
							const title = getText(project, 'title')

							return (
								<li key={project.id}>
									<a
										className="activity-projects__link"
										href={project.links.github}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={t('githubActivity.recentLink', { title })}
									>
										<span className="activity-projects__text">
											<span className="activity-projects__title">{title}</span>
											<span className="activity-projects__meta">{getText(project, 'summary')}</span>
										</span>
										<IoOpenOutline className="activity-projects__icon" aria-hidden="true" />
									</a>
								</li>
							)
						})}
					</ul>
				</section>
			)}
		</aside>
	)
}

export default ActivityAside

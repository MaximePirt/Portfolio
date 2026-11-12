import { useTranslation } from 'react-i18next'
import { getProjectActions } from './lib/projectActions.js'
import useProjectText from './useProjectText'
import ProjectPreview from './ProjectPreview'
import ProjectStatusBadge from './ProjectStatusBadge'

/**
 * @brief Detail of a project: preview, texts, stack and action links.
 * @param {Object} props
 * @param {object} props.project - Project to display.
 * @returns {JSX.Element} The detail.
 */
function ProjectDetail({ project }) {
	const { t } = useTranslation()
	const getText = useProjectText()

	if (!project) {
		return (
			<section className="project-detail project-detail--empty">
				<p>{t('projectsSection.empty')}</p>
			</section>
		)
	}

	const title = getText(project, 'title')
	const description = getText(project, 'description')

	return (
		<section className="project-detail" aria-labelledby={`project-title-${project.id}`}>
			<div className="project-detail__header">
				<div>
					<p className="project-detail__label">
						{t('projectsSection.selectedProject')}
						<ProjectStatusBadge status={project.status} />
					</p>
					<h3 id={`project-title-${project.id}`} className="project-detail__title">
						{title}
					</h3>
					<p className="project-detail__meta">{getText(project, 'summary')}</p>
				</div>

				<div className="project-detail__links">
					{getProjectActions(project).map((action) => (
						<a key={action.id} href={action.href} target="_blank" rel="noreferrer noopener">
							{t(action.labelKey)}
						</a>
					))}
				</div>
			</div>

			<div className="project-detail__top">
				<div className="project-card-block project-trailer">
					<p className="project-card-block__label">
						{t('projectsSection.preview')}
					</p>
					<ProjectPreview project={project} title={title} />
				</div>

				<div className="project-card-block project-stack">
					<p className="project-card-block__label">
						{t('projectsSection.stack')}
					</p>
					<ul className="project-stack__list">
						{project.stack.map((tech) => (
							<li key={tech} className="project-stack__chip">
								{tech}
							</li>
						))}
					</ul>
				</div>
			</div>

			{description && (
				<div className="project-card-block project-description">
					<p className="project-card-block__label">
						{t('projectsSection.description')}
					</p>
					<p className="project-description__text">{description}</p>
				</div>
			)}
		</section>
	)
}

export default ProjectDetail

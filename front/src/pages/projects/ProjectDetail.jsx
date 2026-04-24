import ProjectPreview from './ProjectPreview'
import { useTranslation } from 'react-i18next'

function ProjectDetail({ project }) {
	const { t } = useTranslation()

	if (!project) {
		return (
			<section className="project-detail project-detail--empty">
				<p>{t('projectsSection.empty')}</p>
			</section>
		)
	}

	return (
		<section className="project-detail" aria-labelledby={`project-title-${project.id}`}>
			<div className="project-detail__header">
				<div>
					<p className="project-detail__label">
						{t('projectsSection.selectedProject')}
					</p>
					<h3 id={`project-title-${project.id}`} className="project-detail__title">
						{t(project.titleKey)}
					</h3>
					<p className="project-detail__meta">{t(project.metaKey)}</p>
				</div>

				<div className="project-detail__links">
					{project.github && (
						<a href={project.github} target="_blank" rel="noreferrer noopener">
							GitHub
						</a>
					)}
					{project.demo && (
						<a href={project.demo} target="_blank" rel="noreferrer noopener">
							Demo
						</a>
					)}
				</div>
			</div>

			<div className="project-detail__top">
				<div className="project-card-block project-trailer">
					<p className="project-card-block__label">
						{t('projectsSection.preview')}
					</p>
					<ProjectPreview project={project} />
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

			<div className="project-card-block project-description">
				<p className="project-card-block__label">
					{t('projectsSection.description')}
				</p>
				<p className="project-description__text">
					{t(project.descriptionKey)}
				</p>
			</div>
		</section>
	)
}

export default ProjectDetail

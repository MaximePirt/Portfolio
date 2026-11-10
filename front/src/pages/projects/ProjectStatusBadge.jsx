import { useTranslation } from 'react-i18next'

function ProjectStatusBadge({ status }) {
	const { t } = useTranslation()

	if (status !== 'in-progress') return null

	return (
		<span className="project-status-badge">{t('projectsSection.status.inProgress')}</span>
	)
}

export default ProjectStatusBadge

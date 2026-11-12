import { useTranslation } from 'react-i18next'

/**
 * @brief Small badge showing the status of a project.
 * @param {Object} props
 * @param {string} props.status - 'completed' or 'in-progress'.
 * @returns {JSX.Element} The badge.
 */
function ProjectStatusBadge({ status }) {
	const { t } = useTranslation()

	if (status !== 'in-progress') return null

	return (
		<span className="project-status-badge">{t('projectsSection.status.inProgress')}</span>
	)
}

export default ProjectStatusBadge

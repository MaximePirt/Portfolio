import { useTranslation } from 'react-i18next'

/**
 * @brief Row of filter buttons with their project count.
 * @param {Object} props
 * @param {{value: string, labelKey: string, count: number}[]} props.filters - Available filters.
 * @param {string} props.activeFilter - Currently selected filter value.
 * @param {(value: string) => void} props.onChange - Called with the clicked filter value.
 * @returns {JSX.Element} The filters.
 */
function ProjectFilters({ filters, activeFilter, onChange }) {
	const { t } = useTranslation()

	return (
		<div className="projects-toolbar" role="group" aria-label={t('projectsSection.filtersLabel')}>
			{filters.map((filter) => {
				const isActive = filter.value === activeFilter

				return (
					<button
						key={filter.value}
						type="button"
						className={`projects-filter ${isActive ? 'is-active' : ''}`}
						onClick={() => onChange(filter.value)}
						aria-pressed={isActive}
					>
						{t(filter.labelKey)}
						<span className="projects-filter__count">{filter.count}</span>
					</button>
				)
			})}
		</div>
	)
}

export default ProjectFilters

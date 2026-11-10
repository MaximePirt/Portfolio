import { useTranslation } from 'react-i18next'

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

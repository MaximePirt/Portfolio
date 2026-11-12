import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import clsx from 'clsx'
import { SPRING } from '../../lib/motion'

const MotionSpan = motion.span

/**
 * @brief Row of filter buttons with their project count. The active color slides from one filter to the next.
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
						className={clsx('projects-filter projects-filter--category', isActive && 'is-active')}
						onClick={() => onChange(filter.value)}
						aria-pressed={isActive}
					>
						{isActive && (
							<MotionSpan
								layoutId="projects-filter-highlight"
								className="projects-filter__highlight"
								transition={SPRING}
								aria-hidden="true"
							/>
						)}
						{t(filter.labelKey)}
						<span className="projects-filter__count">{filter.count}</span>
					</button>
				)
			})}
		</div>
	)
}

export default ProjectFilters

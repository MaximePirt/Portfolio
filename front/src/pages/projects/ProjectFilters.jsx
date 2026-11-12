import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import clsx from 'clsx'
import { SPRING } from '../../lib/motion'

const MotionSpan = motion.span

/**
 * @brief Origin pills (42, personal…) with their project count. One at a time; clicking the
 * active pill again shows every project. The active color slides from one pill to the next.
 * @param {Object} props
 * @param {{value: string, labelKey: string, count: number}[]} props.filters - Available origins.
 * @param {string|null} props.activeFilter - Selected origin, null for every project.
 * @param {(value: string|null) => void} props.onChange - Called with the new origin, or null.
 * @returns {JSX.Element} The pills.
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
						onClick={() => onChange(isActive ? null : filter.value)}
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

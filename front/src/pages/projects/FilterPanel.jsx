import { useCallback, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import clsx from 'clsx'
import useDismiss from '../../components/ui/useDismiss'

const PANEL_TRANSITION = { duration: 0.25, ease: 'easeOut' }
const MotionDiv = motion.div

/**
 * @brief Group of chips inside the filter panel (e.g. categories, languages).
 * @param {Object} props
 * @param {string} props.title - Group title.
 * @param {{value: string, label?: string, labelKey?: string, count: number}[]} props.chips - Chips to show.
 * @param {string[]} props.selected - Selected chip values.
 * @param {(value: string) => void} props.onToggle - Called with the clicked chip value.
 * @returns {JSX.Element} The group.
 */
function FilterGroup({ title, chips, selected, onToggle }) {
	const { t } = useTranslation()

	return (
		<div className="projects-panel__group" role="group" aria-label={title}>
			<p className="project-card-block__label">{title}</p>
			<div className="projects-panel__list">
				{chips.map((chip) => {
					const isActive = selected.includes(chip.value)

					return (
						<button
							key={chip.value}
							type="button"
							className={clsx('projects-filter projects-filter--chip', isActive && 'is-active')}
							onClick={() => onToggle(chip.value)}
							aria-pressed={isActive}
						>
							{chip.labelKey ? t(chip.labelKey) : chip.label}
							<span className="projects-filter__count">{chip.count}</span>
						</button>
					)
				})}
			</div>
		</div>
	)
}

/**
 * @brief "Filter" button placed before the origin pills, opening a panel of chip groups
 * (categories, languages) that can be selected together.
 * @param {Object} props
 * @param {{id: string, title: string, chips: Object[], selected: string[], onToggle: (value: string) => void}[]} props.groups -
 * Groups of chips; empty groups are skipped.
 * @param {boolean} props.hasFilters - True when any filter is active (origin pill included).
 * @param {() => void} props.onReset - Clears every filter, origin pill included.
 * @param {React.ReactNode} props.children - Origin pills shown next to the button.
 * @returns {JSX.Element} The filters row and its panel.
 */
function FilterPanel({ groups, hasFilters, onReset, children }) {
	const [isOpen, setIsOpen] = useState(false)
	const containerRef = useRef(null)
	const panelId = useId()
	const reduceMotion = useReducedMotion()
	const { t } = useTranslation()

	const close = useCallback(() => setIsOpen(false), [])
	useDismiss(containerRef, isOpen, close)

	const visibleGroups = groups.filter((group) => group.chips.length > 0)
	const selectedCount = groups.reduce((total, group) => total + group.selected.length, 0)
	const panelMotion = reduceMotion
		? {}
		: {
			initial: { height: 0, opacity: 0 },
			animate: { height: 'auto', opacity: 1 },
			exit: { height: 0, opacity: 0 },
			transition: PANEL_TRANSITION,
		}

	return (
		<div className="projects-filters" ref={containerRef}>
			<div className="projects-filters__row">
				{visibleGroups.length > 0 && (
					<button
						type="button"
						className={clsx('projects-filter projects-filter--toggle', isOpen && 'is-open')}
						onClick={() => setIsOpen((open) => !open)}
						aria-expanded={isOpen}
						aria-controls={panelId}
					>
						{t('projectsSection.languageFilter.toggle')}
						{selectedCount > 0 && <span className="projects-filter__count">{selectedCount}</span>}
					</button>
				)}
				{children}
			</div>

			<AnimatePresence initial={false}>
				{isOpen && visibleGroups.length > 0 && (
					<MotionDiv id={panelId} className="projects-panel" {...panelMotion}>
						<div className="projects-panel__inner" role="group" aria-label={t('projectsSection.languageFilter.panelLabel')}>
							{visibleGroups.map((group) => (
								<FilterGroup
									key={group.id}
									title={group.title}
									chips={group.chips}
									selected={group.selected}
									onToggle={group.onToggle}
								/>
							))}

							{/* In the flow, under the chips: nothing can cover it */}
							{hasFilters && (
								<button type="button" className="projects-panel__reset press" onClick={onReset}>
									{t('projectsSection.languageFilter.reset')}
								</button>
							)}
						</div>
					</MotionDiv>
				)}
			</AnimatePresence>
		</div>
	)
}

export default FilterPanel

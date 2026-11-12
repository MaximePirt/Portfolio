import { useCallback, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import useDismiss from './useDismiss'

const PANEL_TRANSITION = { duration: 0.25, ease: 'easeOut' }
const MotionDiv = motion.div

/**
 * @brief "Filter" button placed before the category filters, opening a banner of
 * language chips that can be selected together.
 * @param {Object} props
 * @param {{value: string, label: string, count: number}[]} props.languages - Available languages (key, shown label, count).
 * @param {string[]} props.selected - Currently selected language keys.
 * @param {(language: string) => void} props.onToggle - Called with the key of the clicked language.
 * @param {() => void} props.onReset - Clears the selection.
 * @param {React.ReactNode} props.children - Category filters shown next to the button.
 * @returns {JSX.Element} The filters row and its language banner.
 */
function LanguageFilter({ languages, selected, onToggle, onReset, children }) {
	const [isOpen, setIsOpen] = useState(false)
	const containerRef = useRef(null)
	const panelId = useId()
	const reduceMotion = useReducedMotion()
	const { t } = useTranslation()

	const close = useCallback(() => setIsOpen(false), [])
	useDismiss(containerRef, isOpen, close)

	const hasLanguages = languages.length > 0
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
				{hasLanguages && (
					<button
						type="button"
						className={`projects-filter projects-filter--toggle ${isOpen ? 'is-open' : ''}`}
						onClick={() => setIsOpen((open) => !open)}
						aria-expanded={isOpen}
						aria-controls={panelId}
					>
						{t('projectsSection.languageFilter.toggle')}
						{selected.length > 0 && (
							<span className="projects-filter__count">{selected.length}</span>
						)}
					</button>
				)}
				{children}
			</div>

			<AnimatePresence initial={false}>
				{isOpen && hasLanguages && (
					<MotionDiv id={panelId} className="projects-languages" {...panelMotion}>
						<div
							className="projects-languages__inner"
							role="group"
							aria-label={t('projectsSection.languageFilter.panelLabel')}
						>
							<div className="projects-languages__header">
								<p className="project-card-block__label">
									{t('projectsSection.languageFilter.title')}
								</p>
								{selected.length > 0 && (
									<button type="button" className="projects-languages__reset" onClick={onReset}>
										{t('projectsSection.languageFilter.reset')}
									</button>
								)}
							</div>

							<div className="projects-languages__list">
								{languages.map((language) => {
									const isActive = selected.includes(language.value)

									return (
										<button
											key={language.value}
											type="button"
											className={`projects-filter projects-filter--chip ${isActive ? 'is-active' : ''}`}
											onClick={() => onToggle(language.value)}
											aria-pressed={isActive}
										>
											{language.label}
											<span className="projects-filter__count">{language.count}</span>
										</button>
									)
								})}
							</div>
						</div>
					</MotionDiv>
				)}
			</AnimatePresence>
		</div>
	)
}

export default LanguageFilter

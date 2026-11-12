import { useCallback, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'motion/react'
import clsx from 'clsx'
import useDismiss from './useDismiss'
import { SPRING } from '../../lib/motion'

const LANGUAGES = [
	{ code: 'en', flag: '🇬🇧', label: 'EN' },
	{ code: 'fr', flag: '🇫🇷', label: 'FR' },
]

// The menu grows out of the button below it, and goes back into it.
const MENU_MOTION = {
	initial: { opacity: 0, scale: 0.85, y: 8 },
	animate: { opacity: 1, scale: 1, y: 0 },
	exit: { opacity: 0, scale: 0.85, y: 8 },
	transition: SPRING,
	style: { transformOrigin: 'bottom left' },
}

const MotionDiv = motion.div

/**
 * @brief Floating language menu (fr/en) fixed at the bottom left of the screen.
 * Closes on Escape or on a click outside.
 * @returns {JSX.Element} The switcher.
 */
function LanguageSwitcher() {
	const { t, i18n } = useTranslation()
	const currentLang = i18n.language
	const [isOpen, setIsOpen] = useState(false)
	const containerRef = useRef(null)
	const menuId = useId()

	const close = useCallback(() => setIsOpen(false), [])
	useDismiss(containerRef, isOpen, close)

	const current = LANGUAGES.find((language) => language.code === currentLang) ?? LANGUAGES[1]

	return (
		<div ref={containerRef} className="fixed bottom-6 left-6 z-5000 flex flex-col items-start gap-2">
			<AnimatePresence>
				{isOpen && (
					<MotionDiv id={menuId} className="flex flex-col gap-2 mb-1" {...MENU_MOTION}>
						{LANGUAGES.map((language) => (
							<button
								key={language.code}
								type="button"
								onClick={() => i18n.changeLanguage(language.code)}
								aria-pressed={currentLang === language.code}
								className={clsx('press lang-btn flex items-center gap-2', currentLang === language.code && 'active')}
							>
								<span aria-hidden="true">{language.flag}</span> {language.label}
							</button>
						))}
					</MotionDiv>
				)}
			</AnimatePresence>

			<button
				type="button"
				onClick={() => setIsOpen((open) => !open)}
				aria-expanded={isOpen}
				aria-controls={menuId}
				aria-label={t('nav.language')}
				className="press w-12 h-12 rounded-full flex items-center justify-center shadow-md text-lg"
				style={{ backgroundColor: 'var(--primary)', color: 'var(--background)' }}
			>
				<span aria-hidden="true">{current.flag}</span>
			</button>
		</div>
	)
}

export default LanguageSwitcher

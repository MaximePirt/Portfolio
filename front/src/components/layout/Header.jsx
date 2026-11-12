import { useCallback, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence } from 'motion/react'
import { IoCloseOutline, IoLogoGithub, IoMenuOutline, IoMoonOutline, IoSunnyOutline } from 'react-icons/io5'
import clsx from 'clsx'
import HeaderMenuSheet from './HeaderMenuSheet'
import HeaderNav from './HeaderNav'
import { SECTION_IDS } from './navItems'
import useActiveSection from './useActiveSection'
import useIsScrolled from './useIsScrolled'
import useTheme from './useTheme'
import useDismiss from '../ui/useDismiss'
import { GITHUB_PROFILE_URL } from '../../lib/links'

const ICON_SIZE = 19

// The site only has two languages: the button shows (and switches to) the other one.
const OTHER_LANGUAGE = { fr: 'en', en: 'fr' }


/**
 * @brief Translucent sticky bar: logo, page navigation (capsule on large screens, menu sheet
 * below), then theme, language and GitHub buttons drawn from one icon set.
 * @returns {JSX.Element} The header.
 */
function Header() {
	const { t, i18n } = useTranslation()
	const [isDarkMode, toggleTheme] = useTheme()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const isScrolled = useIsScrolled()
	const activeId = useActiveSection(SECTION_IDS)
	const headerRef = useRef(null)
	const menuButtonRef = useRef(null)
	const menuId = useId()
	const otherLanguage = OTHER_LANGUAGE[i18n.language] ?? 'en'

	const closeMenu = useCallback(() => setIsMenuOpen(false), [])
	useDismiss(headerRef, isMenuOpen, closeMenu)

	return (
	<header ref={headerRef} className={clsx('header', isScrolled && 'is-scrolled')}>
		{/* Logo and Name */}
		<div className="header__brand">
			<Link to="/" className="header__logo press" style={{ boxShadow: 'var(--shadow-btn)' }}>
				<img src="/logo.png" alt="" className="w-full h-full object-cover" />
			</Link>
			<p className="header__name">{t('profile.name')}</p>
		</div>

		<HeaderNav activeId={activeId} />

		{/* Theme, language, GitHub, menu */}
		<div className="header__actions">
			<button
				type="button"
				onClick={toggleTheme}
				aria-pressed={isDarkMode}
				aria-label={t('nav.theme')}
				className="header-button press"
			>
				{isDarkMode
					? <IoSunnyOutline size={ICON_SIZE} aria-hidden="true" />
					: <IoMoonOutline size={ICON_SIZE} aria-hidden="true" />}
			</button>

			<button
				type="button"
				onClick={() => i18n.changeLanguage(otherLanguage)}
				aria-label={t('nav.language')}
				lang={otherLanguage}
				className="header-button header-button--text press"
			>
				{otherLanguage.toUpperCase()}
			</button>

			<a
				href={GITHUB_PROFILE_URL}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={t('nav.github')}
				className="header-button header-button--wide press"
			>
				<IoLogoGithub size={ICON_SIZE} aria-hidden="true" />
				<span className="header-button__label">{t('contact.github')}</span>
			</a>

			<button
				ref={menuButtonRef}
				type="button"
				onClick={() => setIsMenuOpen((open) => !open)}
				aria-expanded={isMenuOpen}
				aria-controls={menuId}
				aria-label={t('nav.menu')}
				className="header-button header__menu-button press"
			>
				{isMenuOpen
					? <IoCloseOutline size={ICON_SIZE + 3} aria-hidden="true" />
					: <IoMenuOutline size={ICON_SIZE + 3} aria-hidden="true" />}
			</button>
		</div>

		<AnimatePresence>
			{isMenuOpen && (
				<HeaderMenuSheet
					id={menuId}
					activeId={activeId}
					onClose={() => {
						closeMenu()
						menuButtonRef.current?.focus({ preventScroll: true })
					}}
				/>
			)}
		</AnimatePresence>
	</header>
	)
}

export default Header

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DiGithubBadge } from 'react-icons/di'
import { IoMdMoon } from 'react-icons/io'
import { IoSunnySharp } from 'react-icons/io5'
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import useHideOnScroll from './useHideOnScroll'


/**
 * @brief Translucent top bar with the logo, the dark mode toggle (sets `data-theme`) and the GitHub link.
 * Steps aside while scrolling down, comes back on scroll up.
 * @returns {JSX.Element} The header.
 */
function Header() {
	const { t } = useTranslation()
	const [isDarkMode, setIsDarkMode] = useState(false)
	const { isHidden, isScrolled } = useHideOnScroll()

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
	}, [isDarkMode])

	/**
	 * @brief Switches between light and dark theme.
	 */
	const toggleDarkMode = () => setIsDarkMode(prev => !prev)

	return (
	<header
		className={clsx(
			'header w-full px-3 md:px-6 py-2 md:py-3 flex justify-between items-center z-50',
			isHidden && 'is-hidden',
			isScrolled && 'is-scrolled',
		)}
	>
		{/* Logo and Name */}
		<div className="flex items-center gap-2 md:gap-4 min-w-0 px-3 md:px-8">
			<Link to="/"
				className="press w-10 h-10 md:w-14 md:h-14 overflow-hidden flex-shrink-0"
				style={{ boxShadow: 'var(--shadow-btn)' }}>
				<img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
			</Link>
			<p className="text-sm md:text-lg font-bold truncate whitespace-nowrap">{t('profile.name')}</p>
		</div>

		{/* Night mode, github */}
		<div className="flex items-center gap-2 md:gap-3 pr-2 md:pr-4">
			<button
				type="button"
				onClick={toggleDarkMode}
				aria-pressed={isDarkMode}
				aria-label={t('nav.theme')}
				className={clsx('press lang-btn w-10 h-10 flex items-center justify-center', isDarkMode && 'active')}
			>
				{isDarkMode ? <IoSunnySharp size={20} aria-hidden="true" />
					: <IoMdMoon size={20} aria-hidden="true" />
				}
			</button>

			<a href="https://github.com/MaximePirt" target="_blank" rel="noopener noreferrer" className="press lang-btn flex items-center gap-1">
				{t('github')} <DiGithubBadge aria-hidden="true" />
			</a>
		</div>
	</header>
	)
}

export default Header

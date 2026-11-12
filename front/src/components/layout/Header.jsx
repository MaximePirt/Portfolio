import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DiGithubBadge } from "react-icons/di";
import { IoMdMoon } from "react-icons/io";
import { IoSunnySharp } from "react-icons/io5";


import { useState, useEffect } from 'react'


/**
 * @brief Top bar with the section anchors and the dark mode toggle (sets `data-theme`).
 * @returns {JSX.Element} The header.
 */
function Header() {
	const { t } = useTranslation()
	const [isDarkMode, setIsDarkMode] = useState(false)

	useEffect(() => {
	document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
	}, [isDarkMode])

	/**
	 * @brief Switches between light and dark theme.
	 */
	const toggleDarkMode = () => setIsDarkMode(prev => !prev)

	return (
	<header className="header w-full px-3 md:px-6 py-2 md:py-4 flex justify-between items-center top-0 z-50">
	<div className="px-3 gap-2 w-10 h-10 md:px-8 md:gap-6 md:w-16 md:h-16">
	
		{/* Logo and Name */}
		<div className="flex items-center gap-2 w-max">
			<Link to="/"
				className="w-10 h-10 md:w-16 md:h-16 overflow-hidden flex-shrink-0 transition-all duration-200 hover:scale-110 active:scale-95"
				style={{ boxShadow: 'var(--shadow-btn)' }}>
				<img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
			</Link>
			<p className="text-sm md:text-lg font-bold truncate  whitespace-nowrap">{t('profile.name')}</p>
		</div>

	</div>

		{/* Night mode, languages, github */}
		<div className="
			grid grid-cols-2  auto-rows-min
			items-center
			content-center
			gap-x-0
			gap-y-3
			pr-4"
		>
		<button
		onClick={toggleDarkMode}
		className={`col-start-1 row-start-2 w-10 h-10 flex items-center justify-center ml-4 lang-btn ${isDarkMode ? 'active' : ''}`}
		>
			{isDarkMode ? <IoSunnySharp size={20} />
				: <IoMdMoon size={20} />
			}
		</button>

		<a href="https://github.com/MaximePirt" target="_blank" rel="noopener noreferrer" className="col-start-2 row-start-2 lang-btn flex items-center gap-1">
			{t('github')} <DiGithubBadge />
		</a>

		</div>

	</header>
	)
}

export default Header

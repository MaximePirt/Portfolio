import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
	const { i18n } = useTranslation()
	const currentLang = i18n.language
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (!e.target.closest('#lang-switcher')) setIsOpen(false)
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const switchLang = (lang) => {
		i18n.changeLanguage(lang)
	}

	return (
		// Languages list
		<div id="lang-switcher" className="fixed bottom-6 left-6 z-5000 flex flex-col items-start gap-2">

			{isOpen && (
			<div className="flex flex-col gap-2 mb-1">
				<button
					onClick={() => switchLang('en')}
					className={`lang-btn flex items-center gap-2 ${currentLang === 'en' ? 'active' : ''}`}>
					🇬🇧 EN
				</button>
				<button
					onClick={() => switchLang('fr')}
					className={`lang-btn flex items-center gap-2 ${currentLang === 'fr' ? 'active' : ''}`}>
					🇫🇷 FR
				</button>
			</div>
			)}

			{/* Main buttons */}
			<button
				onClick={() => setIsOpen(prev => !prev)}
				className="w-12 h-12 rounded-full flex items-center justify-center shadow-md text-lg transition-all duration-200 hover:scale-110 active:scale-95"
				style={{ backgroundColor: 'var(--primary)', color: 'var(--background)' }}>
				{currentLang === 'fr' ? '🇫🇷' : '🇬🇧'}
			</button>

		</div>
	)
}

export default LanguageSwitcher

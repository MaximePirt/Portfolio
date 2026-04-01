import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Header() {
	const { t, i18n } = useTranslation()
	const currentLang = i18n.language

	return (
	<header className="header w-full px-6 py-4 flex justify-between items-center sticky top-0 z-50">

		<Link to="/"
		className="w-24 h-24 rounded-full overflow-hidden transition-all duration-200 hover:scale-110 active:scale-95"
		style={{ border: 'var(--border-thin)', boxShadow: 'var(--shadow-btn)' }}>
		<img src="/favicon.svg" alt="Logo" className="w-full h-full object-cover" />
		</Link>

		<nav className="flex gap-6">
		<Link to="/" className="header-nav-link">{t('nav.home')}</Link>
		<Link to="/contact" className="header-nav-link">{t('nav.contact')}</Link>
		</nav>

		<div className="flex gap-2">
		<button
			onClick={() => i18n.changeLanguage('fr')}
			className={`lang-btn ${currentLang === 'fr' ? 'active' : ''}`}>
			🇫🇷FR
		</button>
		<button
			onClick={() => i18n.changeLanguage('en')}
			className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}>
			🇬🇧EN
		</button>
		</div>

	</header>
	)
}

export default Header

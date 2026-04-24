import { useTranslation } from 'react-i18next'
import BannerBubbles from './BannerBubble'
import BannerCard from './BannerCard'
import './banner.css'

function Banner() {
	const { t } = useTranslation()

	const navItems = [
		{ id: 'home', label: 'ACCUEIL', location: '#home', active: false },
		{ id: 'presentation', label: 'PRESENTATION', location: '#presentation', active: false },
		{ id: 'project', label: 'PROJECT', location: '#project', active: false },
		{ id: 'activity', label: 'ACTIVITES RECENTES', location: '#activity', active: false },
		{ id: 'contact', label: 'CONTACT', location: '#contact', active: false },
	]

	return (
		<section className="banner-section">
		<div className="banner-nav-wrapper" style={{ backgroundColor: 'var(--background-offset)' }} >
			<nav className="banner-nav">
			{navItems.map((item) => (
				<a
				key={item.id}
				className={`banner-nav-item ${item.active ? 'banner-nav-item--active' : ''}`}
				type="button"
				href={item.location}
				>
				{item.label}
				</a>
			))}
			</nav>
		</div>

		<div className="banner-heading">
			<h1 className="banner-heading__title">{t('profile.name')}</h1>
			<p className="banner-heading__subtitle">{t('hero.tagline')}</p>
		</div>

			<div className="banner-content" >
				<BannerCard />

				<div className="banner-portrait">
					<img
						src="/character.png"
						alt="Portrait de Maxime Pierrot"
						className="banner-portrait__image"
					/>
				</div>
			</div>

		<BannerBubbles />
		{/* <BannerCard /> */}
		</section>
	)
}

export default Banner

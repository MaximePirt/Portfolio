import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import BannerBubbles from './BannerBubble'
import BannerCard from './BannerCard'
import BannerNav from './BannerNav'
import useReveal from '../../ui/useReveal'
import '../../../styles/banner.css'

/**
 * @brief Presentation banner (#presentation): page navigation, title, card, portrait and bubbles,
 * revealed when scrolled into view.
 * @returns {JSX.Element} The banner.
 */
function Banner() {
	const { t } = useTranslation()
	const [sectionRef, isRevealed] = useReveal()

	return (
		<section
			ref={sectionRef}
			id="presentation"
			className={clsx('banner-section', isRevealed && 'is-revealed')}
		>
			<div className="banner-nav-wrapper" style={{ backgroundColor: 'var(--background-offset)' }}>
				<BannerNav />
			</div>

			<div className="banner-heading reveal">
				<h1 className="banner-heading__title">{t('profile.name')}</h1>
				<p className="banner-heading__subtitle">{t('hero.tagline')}</p>
			</div>

			<div className="banner-content">
				<BannerCard />

				<div className="banner-portrait reveal" style={{ '--reveal-index': 3 }}>
					<img
						src="/character.png"
						alt="Portrait de Maxime Pierrot"
						className="banner-portrait__image"
					/>
				</div>
			</div>

			<BannerBubbles />
		</section>
	)
}

export default Banner

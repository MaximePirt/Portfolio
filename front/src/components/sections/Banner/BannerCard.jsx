import { useTranslation } from 'react-i18next'

function BannerCard() {
	const { t } = useTranslation()

	return (
		<div className="banner-card">
		<p className="banner-card__text">
			{t('banner.subtitle')}
		</p>
		</div>
	)
}

export default BannerCard

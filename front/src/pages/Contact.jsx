import { useTranslation } from 'react-i18next'

function Home() {
	const { t } = useTranslation()

	return (
	<main>
		<h1>{t('hero.title')}</h1>
		<p>{t('hero.subtitle')}</p>
		fejifiejife
	</main>
	)
}

export default Home

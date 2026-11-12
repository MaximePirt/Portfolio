// Infos.jsx
import { useTranslation } from 'react-i18next'
import InfoCard from '../components/ui/InfoCards'
import BackButton from '../components/ui/Backbutton'


/**
 * @brief Infos page (route "/infos").
 * @returns {JSX.Element} The page.
 */
function Infos() {
	const { t } = useTranslation()

	return (
		<main
			style={{ backgroundColor: 'var(--bg-secondary)' }}
			className="min-h-screen bg-gray-50 px-4 py-10"
		>
			<div className="w-full max-w-sm mx-auto flex flex-col gap-4">
				<BackButton
					label={t('nav.back')}
					onClick={() => window.history.back()}
				/>
				<div
					style={{ backgroundColor: 'var(--secondary)' }}
					className="flex flex-col items-center px-4 py-10 gap-4 w-full rounded-2xl shadow-md"
				>
					<h1
						className="text-xl font-bold self-start"
						style={{ color: 'var(--text)' }}
					>
						{t('hero.title')}
					</h1>

				</div>
			</div>
		</main>
	)
}

export default Infos

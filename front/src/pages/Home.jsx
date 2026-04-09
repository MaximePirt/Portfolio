import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Home() {
	const { t } = useTranslation()



	return (
		<main className="min-h-screen bg-gray-50 flex flex-col  px-4 py-10 gap-8" style={{ backgroundColor: 'var(--background)' }}>

		{/* <div className="
			grid grid-cols-1 md:grid-cols-[1.4fr_1fr]
			gap-6
			w-full md:w-4/5 ml-auto
			rounded-2xl shadow-md
		px-6 py-8 mb-8"
		style={{ backgroundColor: 'var(--background-offset)' }} >
			<div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
				<h1 className="text-2xl font-bold">{t('hero.title')}</h1>
				<p className="text-sm">{t('hero.subtitle')}</p>
			</div>

			<div className="flex justify-center md:justify-end items-center">
				<div
				className="w-24 h-24 rounded-full overflow-hidden shadow-md"
				style={{ backgroundColor: 'var(--bg-shell)' }}
				>
				<img src="/character.png" alt="Logo" className="w-full h-full object-cover" />
				</div>
			</div>

			<div className="md:col-span-2 text-center md:text-left">
				<p className="text-sm justify-center pl-8">{t('hero.tagline')}</p>
			</div>
		</div> */}


		{/** Stacks */}

		{/* <div className="flex flex-col items-center text-center pt-4 pb-4 pr-4 pl-4 mb-8 px-6 py-10 rounded-2xl shadow-md mr-auto w-3/5"  style={{ backgroundColor: 'var(--background-offset)' }}> */}

			
				

		{/* </div>				 */}

		</main>
	)
}

export default Home

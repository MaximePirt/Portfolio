import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Home() {
	const { t } = useTranslation()



	return (
		<main className="min-h-screen bg-gray-50 flex flex-col  px-4 py-10 gap-8" style={{ backgroundColor: 'var(--background)' }}>

		{/* Name And Logo */}

			<div className="flex flex-col items-center text-center pt-4 pb-4 pr-4 pl-4 mb-8 px-6 py-10 rounded-2xl shadow-md ml-auto w-3/5"  style={{ backgroundColor: 'var(--primary)' }}>
				{/* TEXT AND LOGO  Section */}
				<div className="flex flex-row items-center text-center gap-0 mb-2 px-2 py-6 rounded-2xl w-full">
					
					{/* Text */}
					<div className="flex flex-col items-center mt-6 ml-0 pr-0  gap-2 mr-auto w-2/5"  >
						<h1 className="text-2xl font-bold px-4 ">{t('hero.title')}</h1>
						<div className="p-4 rounded-lg" >
							<p className="mt-1 text-sm">{t('hero.subtitle')}</p>
						</div>
					</div>
					
					{/* Image */}
					<div className="flex items-center justify-center ml-auto w-3/5 h-full">
						<div className="w-48 h-48 rounded-full bg-gray-200 mb-4 overflow-hidden shadow-md " style={{ backgroundColor: 'var(--bg-shell)' }}>
							<img src="/character.png" alt="Logo" className="w-full h-full object-cover" />
						</div>
					</div>

				</div>
			{/*SOUS TEXT*/}
				<p className="mt-1 text-sm">{t('hero.tagline')}</p>
			</div>

		{/** Stacks */}

		<div className="flex flex-col items-center text-center pt-4 pb-4 pr-4 pl-4 mb-8 px-6 py-10 rounded-2xl shadow-md mr-auto w-3/5"  style={{ backgroundColor: 'var(--primary)' }}>

			
				

		</div>				

		</main>
	)
}

export default Home

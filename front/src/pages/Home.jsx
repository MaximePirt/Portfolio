import Banner from '../components/sections/Banner/Banner'

function Home() {
	return (
		<main
		className="min-h-screen flex flex-col px-4 py-10 gap-8"
		style={{ backgroundColor: 'var(--background)' }}
		>
		<Banner />
		</main>
	)
}

export default Home

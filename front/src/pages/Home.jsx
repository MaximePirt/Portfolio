import Banner from '../components/sections/Banner/Banner'

/**
 * @brief Home page (route "/"): renders the banner.
 * @returns {JSX.Element} The page.
 */
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

import { useEffect, useState } from 'react'

// A section is "current" when it crosses this horizontal band around the middle of the screen.
const ACTIVE_BAND = '-45% 0px -50% 0px'

/**
 * @brief Id of the page section currently in the middle of the screen.
 * @param {string[]} ids - Ids of the sections to watch (stable reference).
 * @returns {string} Id of the current section (the first one before any scroll).
 */
function useActiveSection(ids) {
	const [activeId, setActiveId] = useState(ids[0])

	useEffect(() => {
		const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) setActiveId(entry.target.id)
				})
			},
			{ rootMargin: ACTIVE_BAND },
		)

		sections.forEach((section) => observer.observe(section))
		return () => observer.disconnect()
	}, [ids])

	return activeId
}

export default useActiveSection

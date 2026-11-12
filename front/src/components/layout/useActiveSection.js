import { useEffect, useState } from 'react'

// A section is "current" when it crosses this horizontal band around the middle of the screen.
const ACTIVE_BAND = '-45% 0px -50% 0px'

/**
 * @brief Id of the page section currently in the middle of the screen. When several overlap
 * (an anchor inside a section), the last one in page order wins.
 * @param {string[]} ids - Ids of the sections to watch, in page order (stable reference).
 * @returns {string} Id of the current section (the first one before any scroll).
 */
function useActiveSection(ids) {
	const [activeId, setActiveId] = useState(ids[0])

	useEffect(() => {
		const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
		const visibleIds = new Set()

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) visibleIds.add(entry.target.id)
					else visibleIds.delete(entry.target.id)
				})

				const currentId = ids.findLast((id) => visibleIds.has(id))
				if (currentId) setActiveId(currentId)
			},
			{ rootMargin: ACTIVE_BAND },
		)

		sections.forEach((section) => observer.observe(section))
		return () => observer.disconnect()
	}, [ids])

	return activeId
}

export default useActiveSection

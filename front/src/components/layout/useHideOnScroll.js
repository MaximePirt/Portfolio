import { useState } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'

// Below this scroll position (px) the bar always stays visible.
const ALWAYS_VISIBLE_ABOVE = 96
// Ignores tiny scroll jitters (trackpad, finger) before changing direction.
const DIRECTION_THRESHOLD = 6

/**
 * @brief Tells whether the page has been scrolled and whether a top bar should step aside:
 * hidden while scrolling down, shown again as soon as the user scrolls up.
 * @returns {{isHidden: boolean, isScrolled: boolean}} Bar state.
 */
function useHideOnScroll() {
	const { scrollY } = useScroll()
	const [isHidden, setIsHidden] = useState(false)
	const [isScrolled, setIsScrolled] = useState(false)

	useMotionValueEvent(scrollY, 'change', (current) => {
		const delta = current - (scrollY.getPrevious() ?? 0)

		setIsScrolled(current > 0)
		if (current < ALWAYS_VISIBLE_ABOVE) setIsHidden(false)
		else if (Math.abs(delta) > DIRECTION_THRESHOLD) setIsHidden(delta > 0)
	})

	return { isHidden, isScrolled }
}

export default useHideOnScroll

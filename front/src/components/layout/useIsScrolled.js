import { useState } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'

/**
 * @brief Tells whether the page has left its top, so a floating bar can show that content passes under it.
 * @returns {boolean} True once the page is scrolled.
 */
function useIsScrolled() {
	const { scrollY } = useScroll()
	const [isScrolled, setIsScrolled] = useState(false)

	useMotionValueEvent(scrollY, 'change', (current) => setIsScrolled(current > 0))

	return isScrolled
}

export default useIsScrolled

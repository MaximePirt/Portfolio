import { useEffect } from 'react'

/**
 * @brief Blocks the page scroll while a layer (sheet, dialog) covers it.
 * @param {boolean} isLocked - True to block the scroll.
 */
function useScrollLock(isLocked) {
	useEffect(() => {
		if (!isLocked) return undefined

		const root = document.documentElement
		const previousOverflow = root.style.overflow
		root.style.overflow = 'hidden'
		return () => {
			root.style.overflow = previousOverflow
		}
	}, [isLocked])
}

export default useScrollLock

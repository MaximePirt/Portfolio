import { useCallback, useSyncExternalStore } from 'react'

/**
 * @brief Tells whether a CSS media query currently matches, and follows its changes.
 * @param {string} query - Media query, e.g. '(min-width: 1024px)'.
 * @returns {boolean} True while the query matches.
 */
function useMediaQuery(query) {
	const subscribe = useCallback(
		(onChange) => {
			const mediaQuery = window.matchMedia(query)
			mediaQuery.addEventListener('change', onChange)
			return () => mediaQuery.removeEventListener('change', onChange)
		},
		[query],
	)

	return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches)
}

export default useMediaQuery

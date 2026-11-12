import { useEffect, useState } from 'react'

/**
 * @brief Measures where the portrait sits relative to the bubble cluster, so the bubbles know
 * where to gather. Measured on resize only, never per frame.
 * @param {{current: HTMLElement|null}} clusterRef - Bubble cluster.
 * @param {{current: HTMLElement|null}} portraitRef - Portrait the bubbles gather around.
 * @param {boolean} isEnabled - False to skip measuring (story off).
 * @returns {{clusterSize: number, portraitX: number, portraitY: number, portraitSize: number}|null} Geometry in px.
 */
function useOrbitGeometry(clusterRef, portraitRef, isEnabled) {
	const [geometry, setGeometry] = useState(null)

	useEffect(() => {
		const cluster = clusterRef.current
		const portrait = portraitRef.current
		if (!isEnabled || !cluster || !portrait) return undefined

		/**
		 * @brief Reads both boxes once. Their centers are stable: the portrait only scales around its center.
		 */
		const measure = () => {
			const clusterRect = cluster.getBoundingClientRect()
			const portraitRect = portrait.getBoundingClientRect()

			setGeometry({
				clusterSize: cluster.offsetWidth,
				portraitX: portraitRect.left + portraitRect.width / 2 - clusterRect.left,
				portraitY: portraitRect.top + portraitRect.height / 2 - clusterRect.top,
				portraitSize: portrait.offsetWidth,
			})
		}

		const observer = new ResizeObserver(measure)
		observer.observe(document.documentElement)
		return () => observer.disconnect()
	}, [clusterRef, portraitRef, isEnabled])

	return isEnabled ? geometry : null
}

export default useOrbitGeometry

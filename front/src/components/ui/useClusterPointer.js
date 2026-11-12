import { useEffect } from 'react'
import { useMotionValue } from 'motion/react'

/**
 * @brief Tracks the pointer (mouse, pen or finger) over a section, relative to a bubble cluster.
 * One listener for the whole cluster, read at most once per frame.
 * @param {{current: HTMLElement|null}} sectionRef - Area where the pointer is tracked.
 * @param {{current: HTMLElement|null}} clusterRef - Cluster the position is measured from.
 * @returns {import('motion/react').MotionValue} `{x, y, size}` in px, or null when the pointer is outside.
 */
function useClusterPointer(sectionRef, clusterRef) {
	const pointer = useMotionValue(null)

	useEffect(() => {
		const section = sectionRef.current
		const cluster = clusterRef.current
		if (!section || !cluster) return undefined

		let frame = 0
		let lastEvent = null

		/**
		 * @brief Publishes the last pointer position, measured once for this frame.
		 */
		const publish = () => {
			frame = 0
			const rect = cluster.getBoundingClientRect()
			pointer.set({
				x: lastEvent.clientX - rect.left,
				y: lastEvent.clientY - rect.top,
				size: rect.width,
			})
		}

		/**
		 * @brief Keeps the latest event and schedules a single measure for the next frame.
		 * @param {PointerEvent} event - Pointer event.
		 */
		const handleMove = (event) => {
			lastEvent = event
			if (!frame) frame = requestAnimationFrame(publish)
		}

		/**
		 * @brief Releases the bubbles when the pointer leaves the section.
		 */
		const handleLeave = () => {
			cancelAnimationFrame(frame)
			frame = 0
			pointer.set(null)
		}

		section.addEventListener('pointermove', handleMove, { passive: true })
		section.addEventListener('pointerleave', handleLeave)
		return () => {
			cancelAnimationFrame(frame)
			section.removeEventListener('pointermove', handleMove)
			section.removeEventListener('pointerleave', handleLeave)
		}
	}, [sectionRef, clusterRef, pointer])

	return pointer
}

export default useClusterPointer

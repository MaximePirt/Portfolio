import { useEffect } from 'react'

/**
 * @brief Calls `onDismiss` on Escape or on a click outside `ref`, while `isActive` is true.
 * @param {{current: HTMLElement|null}} ref - Element whose outside clicks dismiss.
 * @param {boolean} isActive - Listeners are only attached while true.
 * @param {() => void} onDismiss - Called to close the element.
 */
function useDismiss(ref, isActive, onDismiss) {
	useEffect(() => {
		if (!isActive) return undefined

		/**
		 * @brief Dismisses when the press happens outside of the element.
		 * @param {PointerEvent} event - Pointer event.
		 */
		const handlePointerDown = (event) => {
			if (!ref.current?.contains(event.target)) onDismiss()
		}

		/**
		 * @brief Dismisses on Escape.
		 * @param {KeyboardEvent} event - Keyboard event.
		 */
		const handleKeyDown = (event) => {
			if (event.key === 'Escape') onDismiss()
		}

		document.addEventListener('pointerdown', handlePointerDown)
		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.removeEventListener('pointerdown', handlePointerDown)
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [ref, isActive, onDismiss])
}

export default useDismiss

import { useRef } from 'react'
import { useInView } from 'motion/react'

// The block is revealed slightly before it is fully on screen.
const REVEAL_MARGIN = '0px 0px -12% 0px'

/**
 * @brief Tells when a block scrolls into view (once). Pair the ref with the `is-revealed`
 * class: its `.reveal` children then fade in, staggered by their `--reveal-index`.
 * @returns {[{current: HTMLElement|null}, boolean]} Ref to put on the block and whether it has been seen.
 */
function useReveal() {
	const ref = useRef(null)
	const isRevealed = useInView(ref, { once: true, margin: REVEAL_MARGIN })
	return [ref, isRevealed]
}

export default useReveal

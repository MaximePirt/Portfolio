// Shared motion vocabulary: every animated element of the page picks its values here.

// Default spring: critically damped, no overshoot. For anything that just appears or moves.
export const SPRING = { type: 'spring', bounce: 0, duration: 0.45 }

// Spring with a little bounce, only after a gesture that carried momentum (release, pop-in).
export const SPRING_MOMENTUM = { type: 'spring', bounce: 0.25, duration: 0.6 }

// Slow, calm spring for large text entering the page.
export const SPRING_ENTRANCE = { type: 'spring', bounce: 0, duration: 0.9 }

// Spring back home after a bubble is thrown: inherits the release velocity, slight overshoot.
export const DRAG_RELEASE = { bounceStiffness: 260, bounceDamping: 16 }

// Soft spring used by the bubbles pushed away by the pointer.
export const SPRING_REPEL = { type: 'spring', stiffness: 90, damping: 16 }

// Delay between two elements of a staggered entrance, in seconds.
export const STAGGER = 0.07

// Entrance of a block of text: rises a little while fading in.
export const RISE_IN = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0 },
}

// Entrance of a bubble: grows from a smaller size while fading in.
export const POP_IN = {
	hidden: { opacity: 0, scale: 0.6 },
	visible: { opacity: 1, scale: 1 },
}

// Quick fade for content swapped in place (project detail).
export const FADE_SWAP = { duration: 0.14, ease: 'easeOut' }

// Same deceleration as a native scroll.
const DECELERATION_RATE = 0.998

/**
 * @brief Distance a released gesture would still travel if it kept its momentum
 * (same exponential decay as a native scroll). Lets a flick count, not only the drag distance.
 * @param {number} velocity - Release velocity in px/s.
 * @returns {number} Projected extra distance in px.
 */
export function projectMomentum(velocity) {
	return ((velocity / 1000) * DECELERATION_RATE) / (1 - DECELERATION_RATE)
}

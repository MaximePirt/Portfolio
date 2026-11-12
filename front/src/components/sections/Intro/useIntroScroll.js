import { transform, useScroll, useTransform } from 'motion/react'

// Beats of the story, as shares of the pinned scroll (0 → 1). The title leaves before the
// portrait arrives, the bubbles travel in between: one thing really moves at a time.
const TITLE_OUT = [0, 0.3]
const BUBBLES_TRAVEL = [0.12, 0.6]
const PORTRAIT_IN = [0.35, 0.6]
const BIO_IN = [0.5, 0.75]
// Past this point the second beat receives the pointer instead of the first one.
const HANDOFF = 0.42

const TITLE_SHIFT = -60
const TITLE_SCALE = 0.96
const PORTRAIT_SCALE = 0.85
const BIO_SHIFT = 40

/**
 * @brief Maps the story progress to a value over one beat, clamped outside of it.
 * Passed as a function on purpose: motion hands range-based opacity to a native scroll timeline
 * that follows the whole page instead of this section.
 * @param {number[]} beat - Start and end of the beat (0 → 1).
 * @param {number[]} output - Value at the start and at the end of the beat.
 * @returns {(progress: number) => number} Transformer for useTransform.
 */
function during(beat, output) {
	return (progress) => transform(progress, beat, output)
}

/**
 * @brief Scroll-linked values of the pinned intro: the title steps back, the bubbles travel,
 * then the portrait and the bio arrive. Pure motion values: no React render per frame.
 * @param {{current: HTMLElement|null}} sectionRef - Tall section the stage is pinned in.
 * @returns {{copy: Object, portrait: Object, bio: Object, bubbleProgress: import('motion/react').MotionValue}}
 * Motion styles of each layer and the travel progress of the bubbles (0 → 1).
 */
function useIntroScroll(sectionRef) {
	const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })

	const copy = {
		opacity: useTransform(scrollYProgress, during(TITLE_OUT, [1, 0])),
		y: useTransform(scrollYProgress, during(TITLE_OUT, [0, TITLE_SHIFT])),
		scale: useTransform(scrollYProgress, during(TITLE_OUT, [1, TITLE_SCALE])),
		pointerEvents: useTransform(scrollYProgress, (progress) => (progress < HANDOFF ? 'auto' : 'none')),
	}

	const portrait = {
		opacity: useTransform(scrollYProgress, during(PORTRAIT_IN, [0, 1])),
		scale: useTransform(scrollYProgress, during(PORTRAIT_IN, [PORTRAIT_SCALE, 1])),
	}

	const bio = {
		opacity: useTransform(scrollYProgress, during(BIO_IN, [0, 1])),
		y: useTransform(scrollYProgress, during(BIO_IN, [BIO_SHIFT, 0])),
		pointerEvents: useTransform(scrollYProgress, (progress) => (progress < HANDOFF ? 'none' : 'auto')),
	}

	const bubbleProgress = useTransform(scrollYProgress, during(BUBBLES_TRAVEL, [0, 1]))

	return { copy, portrait, bio, bubbleProgress }
}

export default useIntroScroll

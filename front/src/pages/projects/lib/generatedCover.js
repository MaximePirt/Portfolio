// Deterministic bubble composition for projects without an image: same id => same visual.
// Like the hero cluster, bubbles sit on a tight grid without overlapping,
// in the right half so the title stays readable at the bottom left.

const ACCENT_VARIANT = 'bubble-orange'
const NEUTRAL_VARIANTS = ['bubble-green-dark', 'bubble-green-light', 'bubble-grey']
const BUBBLE_COUNT = 5

// Possible bubble centers, in % of the cover.
const COLUMNS = [60, 78, 96]
const ROWS = [20, 50, 80]
const SLOTS = COLUMNS.flatMap((x) => ROWS.map((y) => ({ x, y })))

// Bubble diameter, in % of the cover width.
const MIN_SIZE = 14
const MAX_SIZE = 17

/**
 * @brief Hashes a string into an unsigned 32-bit integer (FNV-1a).
 * Used as a seed so the same id always produces the same layout.
 * @param {string} value - String to hash.
 * @returns {number} Unsigned 32-bit hash.
 */
function hashString(value) {
	let hash = 2166136261
	for (const char of value) {
		hash ^= char.charCodeAt(0)
		hash = Math.imul(hash, 16777619)
	}
	return hash >>> 0
}

/**
 * @brief Creates a seeded pseudo-random number generator (linear congruential generator).
 * @param {number} seed - Initial state, typically from hashString.
 * @returns {() => number} Function returning a float in [0, 1) on each call.
 */
function createRandom(seed) {
	let state = seed
	return () => {
		state = (Math.imul(state, 1664525) + 1013904223) >>> 0
		return state / 4294967296
	}
}

/**
 * @brief Picks `count` distinct grid slots using a seeded Fisher-Yates shuffle.
 * @param {() => number} random - Seeded random function from createRandom.
 * @param {number} count - Number of slots to return.
 * @returns {{x: number, y: number}[]} The first `count` slots of the shuffled grid.
 */
function pickSlots(random, count) {
	const slots = [...SLOTS]
	for (let index = slots.length - 1; index > 0; index--) {
		const swapIndex = Math.floor(random() * (index + 1))
		const slot = slots[index]
		slots[index] = slots[swapIndex]
		slots[swapIndex] = slot
	}
	return slots.slice(0, count)
}

/**
 * @brief Builds the bubble layout for a project cover that has no image.
 * The first bubble gets the accent variant, the others a neutral variant.
 * @param {string} id - Project id; the same id always yields the same layout.
 * @returns {{x: number, y: number, variant: string, size: number}[]}
 *   Bubbles with their center (% of cover), color variant and diameter (% of cover width).
 */
export function getCoverBubbles(id) {
	const random = createRandom(hashString(id))

	return pickSlots(random, BUBBLE_COUNT).map((slot, index) => ({
		...slot,
		variant: index === 0
			? ACCENT_VARIANT
			: NEUTRAL_VARIANTS[Math.floor(random() * NEUTRAL_VARIANTS.length)],
		size: MIN_SIZE + random() * (MAX_SIZE - MIN_SIZE),
	}))
}

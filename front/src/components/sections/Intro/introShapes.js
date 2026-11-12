// Bubbles of the intro. `x`/`y`/`size` place them in the cluster (in % of it) for the first beat;
// `orbitAngle` (degrees, 0 = right, clockwise) and `orbitRadius` (in portrait widths) place them
// around the portrait for the second beat. They are spread evenly on the left arc (every 48°, |angle| ≥ 60°), so none
// lands on the presentation text to the right of the portrait.
const FLOAT = { floatY: 10, floatRotate: 4, repelRadius: 190, repelForce: 75 }

export const INTRO_SHAPES = [
	{ id: 1, x: 84, y: 14, size: 22, delay: 0, variant: 'bubble-orange', orbitAngle: -60, orbitRadius: 0.92, ...FLOAT },
	{ id: 2, x: 45, y: 16, size: 20, delay: 0.3, variant: 'bubble-grey', orbitAngle: -108, orbitRadius: 0.9, ...FLOAT, floatY: 12, floatRotate: 5 },
	{ id: 3, x: 45, y: 44, size: 20, delay: 0.15, variant: 'bubble-green-light', orbitAngle: -156, orbitRadius: 0.84, ...FLOAT },
	{ id: 4, x: 66, y: 44, size: 20, delay: 0.45, variant: 'bubble-grey', orbitAngle: 156, orbitRadius: 0.84, ...FLOAT },
	{ id: 5, x: 66, y: 68, size: 20, delay: 0.25, variant: 'bubble-green-light', orbitAngle: 108, orbitRadius: 0.9, ...FLOAT },
	{ id: 6, x: 87, y: 68, size: 20, delay: 0.55, variant: 'bubble-green-dark', orbitAngle: 60, orbitRadius: 0.92, ...FLOAT },
]

// The bubbles get a little smaller once gathered around the portrait.
export const ORBIT_SCALE = 0.78

const NO_OFFSET = { x: 0, y: 0 }

/**
 * @brief Vector (px) that takes a bubble from its place in the cluster to its place around the portrait.
 * @param {{x: number, y: number, orbitAngle: number, orbitRadius: number}} shape - Bubble.
 * @param {{clusterSize: number, portraitX: number, portraitY: number, portraitSize: number}|null} geometry -
 * Cluster size and portrait center/width, measured from the cluster's top-left corner. Null when the story is off.
 * @returns {{x: number, y: number}} Offset in px.
 */
export function getOrbitOffset(shape, geometry) {
	if (!geometry) return NO_OFFSET

	const angle = (shape.orbitAngle * Math.PI) / 180
	const radius = shape.orbitRadius * geometry.portraitSize

	return {
		x: geometry.portraitX + Math.cos(angle) * radius - (shape.x / 100) * geometry.clusterSize,
		y: geometry.portraitY + Math.sin(angle) * radius - (shape.y / 100) * geometry.clusterSize,
	}
}

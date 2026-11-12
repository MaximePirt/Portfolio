// Size of the cluster the repel radius/force were tuned on, in px.
export const CLUSTER_BASE_SIZE = 520

const NO_OFFSET = { x: 0, y: 0 }

/**
 * @brief Offset that pushes a bubble away from the pointer. The push peaks halfway through the
 * radius and fades to zero at the center, so the bubble yields as the pointer comes near
 * but can still be caught (and dragged) when aimed at.
 * @param {{x: number, y: number, size: number}|null} pointer - Pointer position in px relative to the cluster, and the cluster size. Null when the pointer is outside.
 * @param {{x: number, y: number, repelRadius: number, repelForce: number, shift?: {x: number, y: number}}} shape - Bubble center in % of the cluster (plus an optional shift in px), radius/force tuned on CLUSTER_BASE_SIZE.
 * @returns {{x: number, y: number}} Offset in px.
 */
export function getRepelOffset(pointer, shape) {
	if (!pointer) return NO_OFFSET

	const scale = pointer.size / CLUSTER_BASE_SIZE
	const shift = shape.shift ?? NO_OFFSET
	const dx = pointer.x - (shape.x / 100) * pointer.size - shift.x
	const dy = pointer.y - (shape.y / 100) * pointer.size - shift.y
	const distance = Math.hypot(dx, dy)
	const radius = shape.repelRadius * scale

	if (distance === 0 || distance >= radius) return NO_OFFSET

	// 4·t·(1 − t) peaks at 1 for t = 0.5: same maximum push as a linear falloff.
	const t = distance / radius
	const strength = 4 * t * (1 - t) * shape.repelForce * scale
	return { x: -(dx / distance) * strength, y: -(dy / distance) * strength }
}

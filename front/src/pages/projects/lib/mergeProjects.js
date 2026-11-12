// Merging of project lists.

import { compareProjects, normalizeProject } from './projectSchema.js'

/**
 * @brief Merges several project lists into one normalized, sorted list.
 * On an equal id, the project from the later list wins.
 * @param {...object[]} lists - Project lists, from lowest to highest priority.
 * @returns {object[]} Normalized projects, sorted with compareProjects.
 */
export function mergeProjects(...lists) {
	const projectsById = new Map()
	lists.flat().forEach((project) => projectsById.set(project.id, project))

	return [...projectsById.values()].map(normalizeProject).sort(compareProjects)
}

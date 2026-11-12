import { OTHER_LANGUAGE, getAvailableLanguages } from './projectFilters.js'

/**
 * @brief Languages used across the projects, most used first ("Other" left out).
 * @param {object[]} projects - Projects in the canonical shape.
 * @param {number} limit - Maximum number of languages.
 * @returns {{value: string, label: string, labelKey?: string, count: number}[]} Languages with their project count.
 */
export function getTopLanguages(projects, limit) {
	return getAvailableLanguages(projects, [])
		.filter((language) => language.value !== OTHER_LANGUAGE.value)
		.slice(0, limit)
}

/**
 * @brief Most recently created projects that have a public repository.
 * @param {object[]} projects - Projects in the canonical shape.
 * @param {number} limit - Maximum number of projects.
 * @returns {object[]} Projects, newest first.
 */
export function getLatestProjects(projects, limit) {
	return projects
		.filter((project) => project.links.github && project.createdAt)
		.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
		.slice(0, limit)
}

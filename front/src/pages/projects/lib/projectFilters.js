// Filters of the Projects section: an origin (42, personal, freelance) or a domain, plus a multi-select on the languages of the stack.

import { getLanguageLabel, getStackLanguages } from './languages.js'

export const PROJECT_FILTERS = [
	{ value: 'all', labelKey: 'filters.all' },
	{ value: '42', labelKey: 'filters.school42' },
	{ value: 'personal', labelKey: 'filters.personal' },
	{ value: 'freelance', labelKey: 'filters.freelance' },
	{ value: 'frontend', labelKey: 'filters.frontend' },
	{ value: 'backend', labelKey: 'filters.backend' },
	{ value: 'systems', labelKey: 'filters.systems' },
	{ value: 'devops', labelKey: 'filters.devops' },
	{ value: 'data', labelKey: 'filters.data' },
]

/**
 * @brief Tells whether a project belongs to a filter, by origin or domain.
 * @param {object} project - Project with `origin` and `domains` fields.
 * @param {string} filter - Filter value ('all' matches every project).
 * @returns {boolean} True if the project matches the filter.
 */
export function matchesFilter(project, filter) {
	if (filter === 'all') return true
	return project.origin === filter || project.domains.includes(filter)
}

/**
 * @brief Returns the filters that match at least one project, each with its count.
 * The "all" filter is always kept.
 * @param {object[]} projects - Projects to count against.
 * @returns {{value: string, labelKey: string, count: number}[]} Available filters with counts.
 */
export function getAvailableFilters(projects) {
	return PROJECT_FILTERS
		.map((filter) => ({
			...filter,
			count: projects.filter((project) => matchesFilter(project, filter.value)).length,
		}))
		.filter((filter) => filter.value === 'all' || filter.count > 0)
}

// Chip gathering the projects whose stack names no recognized language (e.g. a Docker-only project).
export const OTHER_LANGUAGE = { value: 'other', labelKey: 'projectsSection.languageFilter.other' }

/**
 * @brief Lists the language keys of a project, or the "other" key when its stack names none,
 * so every project can be reached through the language filter.
 * @param {object} project - Project with a `stack` field.
 * @returns {string[]} Language keys.
 */
function getProjectLanguages(project) {
	const languages = getStackLanguages(project.stack)
	return languages.length ? languages : [OTHER_LANGUAGE.value]
}

/**
 * @brief Builds the chip of a language.
 * @param {string} value - Language key.
 * @param {number} count - Number of projects using it.
 * @returns {{value: string, label: string, labelKey?: string, count: number}} Chip data.
 */
function toLanguageChip(value, count) {
	if (value === OTHER_LANGUAGE.value) return { ...OTHER_LANGUAGE, label: value, count }
	return { value, label: getLanguageLabel(value), count }
}

/**
 * @brief Tells whether a project uses at least one of the selected languages.
 * @param {object} project - Project with a `stack` field.
 * @param {string[]} languages - Selected language keys (empty matches every project).
 * @returns {boolean} True if the project matches the language selection.
 */
export function matchesLanguages(project, languages) {
	if (!languages.length) return true
	return getProjectLanguages(project).some((language) => languages.includes(language))
}

/**
 * @brief Lists the programming languages used by the projects (see lib/languages.js), each with
 * its project count, most used first, the "other" chip last. Selected languages are always kept
 * so they can be unchecked.
 * @param {object[]} projects - Projects to count against.
 * @param {string[]} selected - Currently selected language keys.
 * @returns {{value: string, label: string, labelKey?: string, count: number}[]} Chips with counts.
 */
export function getAvailableLanguages(projects, selected) {
	const counts = new Map(selected.map((key) => [key, 0]))

	projects.forEach((project) => {
		getProjectLanguages(project).forEach((key) => counts.set(key, (counts.get(key) ?? 0) + 1))
	})

	const isOther = (chip) => chip.value === OTHER_LANGUAGE.value
	return [...counts]
		.map(([value, count]) => toLanguageChip(value, count))
		.sort((a, b) => isOther(a) - isOther(b) || b.count - a.count || a.label.localeCompare(b.label))
}

/**
 * @brief Adds a value to a list, or removes it if already present.
 * @param {string[]} list - Current list.
 * @param {string} value - Value to toggle.
 * @returns {string[]} New list.
 */
export function toggleValue(list, value) {
	return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

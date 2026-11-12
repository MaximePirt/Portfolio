// Filters of the Projects section: an origin shown as pills (42, personal, freelance), and in the
// "Filter" panel a multi-select on the domains and on the languages of the stack.

import { getLanguageLabel, getStackLanguages } from './languages.js'

export const ORIGIN_FILTERS = [
	{ value: '42', labelKey: 'filters.school42' },
	{ value: 'personal', labelKey: 'filters.personal' },
	{ value: 'freelance', labelKey: 'filters.freelance' },
]

export const DOMAIN_FILTERS = [
	{ value: 'frontend', labelKey: 'filters.frontend' },
	{ value: 'backend', labelKey: 'filters.backend' },
	{ value: 'systems', labelKey: 'filters.systems' },
	{ value: 'devops', labelKey: 'filters.devops' },
	{ value: 'data', labelKey: 'filters.data' },
]

/**
 * @brief Tells whether a project comes from the selected origin.
 * @param {object} project - Project with an `origin` field.
 * @param {string|null} origin - Selected origin (null matches every project).
 * @returns {boolean} True if the project matches.
 */
export function matchesOrigin(project, origin) {
	return !origin || project.origin === origin
}

/**
 * @brief Tells whether a project belongs to at least one of the selected domains.
 * @param {object} project - Project with a `domains` field.
 * @param {string[]} domains - Selected domains (empty matches every project).
 * @returns {boolean} True if the project matches.
 */
export function matchesDomains(project, domains) {
	return !domains.length || project.domains.some((domain) => domains.includes(domain))
}

/**
 * @brief Origins that match at least one project, each with its count.
 * @param {object[]} projects - Projects to count against.
 * @returns {{value: string, labelKey: string, count: number}[]} Available origins.
 */
export function getAvailableOrigins(projects) {
	return ORIGIN_FILTERS
		.map((filter) => ({ ...filter, count: projects.filter((project) => project.origin === filter.value).length }))
		.filter((filter) => filter.count > 0)
}

/**
 * @brief Domains that match at least one project, each with its count. Selected domains are
 * always kept so they can be unchecked.
 * @param {object[]} projects - Projects to count against.
 * @param {string[]} selected - Currently selected domains.
 * @returns {{value: string, labelKey: string, count: number}[]} Available domains.
 */
export function getAvailableDomains(projects, selected) {
	return DOMAIN_FILTERS
		.map((filter) => ({ ...filter, count: projects.filter((project) => project.domains.includes(filter.value)).length }))
		.filter((filter) => filter.count > 0 || selected.includes(filter.value))
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

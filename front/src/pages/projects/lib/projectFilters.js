// Filters of the Projects section: an origin (42, personal, freelance) or a domain, plus a multi-select on the languages of the stack.

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

// Separators ignored when comparing spellings ("Node.js", "Node JS", "node-js"); + and # are kept (C++, C#).
const LANGUAGE_SEPARATORS = /[\s._-]+/g
// "Node.js", "NodeJS" and "Node" are one technology; the suffix alone ("JS") is kept.
const JS_SUFFIX = /(?<=.{2})js$/
// Abbreviations merged with their full name.
const LANGUAGE_ALIASES = {
	js: 'javascript',
	ts: 'typescript',
	golang: 'go',
	postgres: 'postgresql',
	k8s: 'kubernetes',
}

/**
 * @brief Turns a stack entry into its language key, so spellings of the same technology
 * ("Pandas" / "pandas", "Node.js" / "NodeJS" / "Node JS", "JS" / "JavaScript") are one language.
 * @param {string} language - Stack entry as written in the project.
 * @returns {string} Normalized key: lowercase, without separators nor "js" suffix, aliases resolved.
 */
export function toLanguageKey(language) {
	const key = language.toLowerCase().replace(LANGUAGE_SEPARATORS, '').replace(JS_SUFFIX, '')
	return LANGUAGE_ALIASES[key] ?? key
}

/**
 * @brief Tells whether a project uses at least one of the selected languages.
 * @param {object} project - Project with a `stack` field.
 * @param {string[]} languages - Selected language keys (empty matches every project).
 * @returns {boolean} True if the project matches the language selection.
 */
export function matchesLanguages(project, languages) {
	if (!languages.length) return true
	return project.stack.some((language) => languages.includes(toLanguageKey(language)))
}

/**
 * @brief Lists the languages used by the projects, each with its project count,
 * most used first. Spellings differing only by case are merged (the first one seen is shown).
 * Selected languages are always kept so they can be unchecked.
 * @param {object[]} projects - Projects to count against.
 * @param {string[]} selected - Currently selected language keys.
 * @returns {{value: string, label: string, count: number}[]} Available languages with counts.
 */
export function getAvailableLanguages(projects, selected) {
	const languages = new Map(selected.map((key) => [key, { value: key, label: key, count: 0 }]))

	projects.forEach((project) => {
		new Set(project.stack.map(toLanguageKey)).forEach((key) => {
			const label = project.stack.find((language) => toLanguageKey(language) === key)
			const entry = languages.get(key)

			if (!entry) languages.set(key, { value: key, label, count: 1 })
			else languages.set(key, { ...entry, label: entry.count ? entry.label : label, count: entry.count + 1 })
		})
	})

	return [...languages.values()]
		.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
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

// Filters of the Projects section: an origin (42, personal, freelance) or a domain.

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

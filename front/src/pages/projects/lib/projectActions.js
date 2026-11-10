// Actions shown on a project's detail page.
// Single extension point: a future "Run" button (based on project.run) is added here.

const PROJECT_ACTIONS = [
	{ id: 'github', labelKey: 'projectsSection.actions.github', getHref: (project) => project.links.github },
	{ id: 'demo', labelKey: 'projectsSection.actions.demo', getHref: (project) => project.links.demo },
]

/**
 * @brief Returns the actions available for a project, keeping only those with a link.
 * @param {object} project - Project with a `links` object (github, demo).
 * @returns {{id: string, labelKey: string, href: string}[]} Actions with a non-empty href.
 */
export function getProjectActions(project) {
	return PROJECT_ACTIONS
		.map(({ id, labelKey, getHref }) => ({ id, labelKey, href: getHref(project) }))
		.filter((action) => action.href)
}

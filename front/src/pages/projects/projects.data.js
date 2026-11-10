import generated from './projects.generated.json'
import { MANUAL_PROJECTS } from './projects.manual'
import { compareProjects, normalizeProject } from './lib/projectSchema.js'

export { PROJECT_FILTERS } from './lib/projectFilters.js'

function mergeProjects(generatedProjects, manualProjects) {
	const projectsById = new Map(manualProjects.map((project) => [project.id, project]))
	generatedProjects.forEach((project) => projectsById.set(project.id, project))

	return [...projectsById.values()].map(normalizeProject).sort(compareProjects)
}

export const PROJECTS = mergeProjects(generated.projects, MANUAL_PROJECTS)

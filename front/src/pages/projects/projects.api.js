import { SCHEMA_VERSION } from './lib/projectSchema.js'

// Vercel function (api/projects.js), also served by Vite in dev.
const PROJECTS_ENDPOINT = '/api/projects'

// One request for the whole page: the projects and activity sections share it.
let pendingRequest = null

/**
 * @brief Requests the projects API and checks its answer.
 * @returns {Promise<object[]>} Projects in the canonical shape.
 * @throws {Error} On a non-OK response or an unexpected schema version.
 */
async function requestProjects() {
	const response = await fetch(PROJECTS_ENDPOINT)
	if (!response.ok) throw new Error(`${PROJECTS_ENDPOINT} responded ${response.status}`)

	const data = await response.json()
	if (data.version !== SCHEMA_VERSION || !Array.isArray(data.projects)) {
		throw new Error(`${PROJECTS_ENDPOINT} : unexpected format (version ${data.version})`)
	}
	return data.projects
}

/**
 * @brief Fetches the projects of the marked GitHub repos, once per page load.
 * A failed request is forgotten, so a later call tries again.
 * @returns {Promise<object[]>} Projects in the canonical shape.
 */
export function fetchRemoteProjects() {
	pendingRequest ??= requestProjects().catch((error) => {
		pendingRequest = null
		throw error
	})
	return pendingRequest
}

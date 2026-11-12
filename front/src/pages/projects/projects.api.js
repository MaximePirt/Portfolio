import { SCHEMA_VERSION } from './lib/projectSchema.js'

// Vercel function (api/projects.js), also served by Vite in dev.
const PROJECTS_ENDPOINT = '/api/projects'

/**
 * @brief Fetches the projects of the marked GitHub repos from the projects API.
 * @param {AbortSignal} [signal] - Aborts the request (e.g. on unmount).
 * @returns {Promise<object[]>} Projects in the canonical shape.
 * @throws {Error} On a non-OK response or an unexpected schema version.
 */
export async function fetchRemoteProjects(signal) {
	const response = await fetch(PROJECTS_ENDPOINT, { signal })
	if (!response.ok) throw new Error(`${PROJECTS_ENDPOINT} responded ${response.status}`)

	const data = await response.json()
	if (data.version !== SCHEMA_VERSION || !Array.isArray(data.projects)) {
		throw new Error(`${PROJECTS_ENDPOINT} : unexpected format (version ${data.version})`)
	}
	return data.projects
}

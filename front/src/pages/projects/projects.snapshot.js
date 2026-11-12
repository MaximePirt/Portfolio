import { SCHEMA_VERSION } from './lib/projectSchema.js'

// Local, git-ignored snapshot of the GitHub projects (npm run snapshot:projects), used only for testing.
// import.meta.glob returns {} when the file does not exist, so builds without it (Vercel) are unaffected.
const snapshotFiles = import.meta.glob('./projects.snapshot.json', { eager: true, import: 'default' })

/**
 * @brief Reads the projects of the local snapshot, if any.
 * @returns {object[]} Snapshot projects; empty when the file is missing or has another schema version.
 */
function readSnapshotProjects() {
	const snapshot = Object.values(snapshotFiles)[0]
	if (!snapshot || snapshot.version !== SCHEMA_VERSION || !Array.isArray(snapshot.projects)) return []
	return snapshot.projects
}

export const SNAPSHOT_PROJECTS = readSnapshotProjects()

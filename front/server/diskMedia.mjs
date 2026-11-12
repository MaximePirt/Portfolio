// Media finder reading the portfolio's own disk (public/projects/<id>/).
// Used by the local scripts (check-projects, snapshot-projects); the Vercel function probes the site instead.

import { readdir } from 'node:fs/promises'
import { createFsMediaFinder } from './localMedia.mjs'

const PUBLIC_PROJECTS_DIR = new URL('../public/projects/', import.meta.url)

/**
 * @brief Lists the files of `public/projects/<id>/`.
 * @param {string} id - Project id.
 * @returns {Promise<string[]>} File names (empty if the folder is missing).
 */
async function readProjectDir(id) {
	try {
		return await readdir(new URL(`${id}/`, PUBLIC_PROJECTS_DIR))
	} catch {
		return []
	}
}

export const findDiskMedia = createFsMediaFinder(readProjectDir)

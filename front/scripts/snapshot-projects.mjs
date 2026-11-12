#!/usr/bin/env node
// Saves the current GitHub projects into a local, git-ignored snapshot (src/pages/projects/projects.snapshot.json).
// The site only uses it when /api/projects is missing or fails (vite preview, Docker, offline, GitHub quota),
// so every project can be seen while testing. Never committed: production keeps reading GitHub live.
//
//   npm --prefix front run snapshot:projects                                     (reads GitHub)
//   npm --prefix front run snapshot:projects -- --from https://maxime-pierrot.com  (copies a deployed /api/projects,
//                                                                                  cached: spares the GitHub quota)
//
// Variables: GITHUB_TOKEN (optional, API quota), PORTFOLIO_GITHUB_OWNER (default MaximePirt).

import { writeFile } from 'node:fs/promises'
import { SCHEMA_VERSION } from '../src/pages/projects/lib/projectSchema.js'
import { PORTFOLIO_OWNER, collectProjects } from '../server/collectProjects.mjs'
import { findDiskMedia } from '../server/diskMedia.mjs'

const SNAPSHOT_FILE = new URL('../src/pages/projects/projects.snapshot.json', import.meta.url)
const FROM_FLAG = '--from'

/**
 * @brief Reads the origin given after --from, if any.
 * @param {string[]} args - Command line arguments.
 * @returns {string|null} Site origin without trailing slash, or null to read GitHub.
 */
function readSourceOrigin(args) {
	const index = args.indexOf(FROM_FLAG)
	if (index === -1) return null
	if (!args[index + 1]) throw new Error(`${FROM_FLAG} attend une URL (ex. https://maxime-pierrot.com)`)
	return args[index + 1].replace(/\/+$/, '')
}

/**
 * @brief Collects the projects straight from the GitHub repos.
 * @returns {Promise<object[]>} Valid projects.
 */
async function collectFromGithub() {
	const { projects, results } = await collectProjects({
		owner: PORTFOLIO_OWNER,
		findLocalMedia: findDiskMedia,
	})
	const skipped = results.length - projects.length
	if (skipped) console.log(`${skipped} repo(s) en erreur ignoré(s) : lancer check:projects pour le détail.`)
	return projects
}

/**
 * @brief Copies the projects served by a deployed /api/projects.
 * @param {string} origin - Site origin.
 * @returns {Promise<object[]>} Projects of the response.
 */
async function collectFromSite(origin) {
	const response = await fetch(`${origin}/api/projects`)
	if (!response.ok) throw new Error(`${origin}/api/projects a répondu ${response.status}`)

	const data = await response.json()
	if (data.version !== SCHEMA_VERSION || !Array.isArray(data.projects)) {
		throw new Error(`${origin}/api/projects : format inattendu (version ${data.version})`)
	}
	return data.projects
}

/**
 * @brief Collects the projects and writes them in the /api/projects format.
 * @returns {Promise<void>}
 */
async function main() {
	const origin = readSourceOrigin(process.argv.slice(2))
	const projects = origin ? await collectFromSite(origin) : await collectFromGithub()

	const snapshot = { version: SCHEMA_VERSION, source: origin ?? 'github', savedAt: new Date().toISOString(), projects }
	await writeFile(SNAPSHOT_FILE, `${JSON.stringify(snapshot, null, '\t')}\n`)

	console.log(`${projects.length} projet(s) enregistré(s) dans ${SNAPSHOT_FILE.pathname}`)
}

main().catch((error) => {
	console.error(`Capture interrompue : ${error.message}`)
	process.exitCode = 1
})

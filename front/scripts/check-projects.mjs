#!/usr/bin/env node
// Checks the GitHub repos marked for the portfolio, exactly like the site does (api/projects.js).
// Writes nothing: the list shown on the site updates itself from GitHub.
//
//   npm --prefix front run check:projects
//
// Output: ✓ valid, ⚠ warning, ✗ error (exit 1 if an error remains).
// Variables: GITHUB_TOKEN (optional, API quota), PORTFOLIO_GITHUB_OWNER (default MaximePirt).

import { readdir } from 'node:fs/promises'
import { collectProjects } from '../server/collectProjects.mjs'
import { createFsMediaFinder } from '../server/localMedia.mjs'

const OWNER = process.env.PORTFOLIO_GITHUB_OWNER || 'MaximePirt'
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

/**
 * @brief Prints the result of each repo: ✓ / ✗ with its warnings and errors.
 * @param {{repo: string, project?: object, warnings: string[], errors: string[]}[]} results - Per-repo results.
 */
function report(results) {
	results.forEach(({ repo, project, warnings, errors }) => {
		console.log(`${errors.length ? '✗' : '✓'} ${repo}${project ? ` → ${project.id}` : ''}`)
		warnings.forEach((message) => console.log(`    ⚠ ${message}`))
		errors.forEach((message) => console.log(`    ✗ ${message}`))
	})
}

/**
 * @brief Runs the check, prints the report and sets the exit code (1 if an error remains).
 * @returns {Promise<void>}
 */
async function main() {
	const { projects, results, repoCount } = await collectProjects({
		owner: OWNER,
		findLocalMedia: createFsMediaFinder(readProjectDir),
	})

	report(results)

	const errorCount = results.filter((result) => result.errors.length).length
	console.log(`\n${projects.length} projet(s) valide(s), ${errorCount} en erreur, ${repoCount} repo(s) parcouru(s).`)
	process.exitCode = errorCount ? 1 : 0
}

main().catch((error) => {
	console.error(`Contrôle interrompu : ${error.message}`)
	process.exitCode = 1
})

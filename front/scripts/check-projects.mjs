#!/usr/bin/env node
// Checks the GitHub repos marked for the portfolio, exactly like the site does (api/projects.js).
// Writes nothing: the list shown on the site updates itself from GitHub.
//
//   npm --prefix front run check:projects
//
// Output: ✓ valid, ⚠ warning, ✗ error (exit 1 if an error remains).
// Variables: GITHUB_TOKEN (optional, API quota), PORTFOLIO_GITHUB_OWNER (default MaximePirt).

import { PORTFOLIO_OWNER, collectProjects } from '../server/collectProjects.mjs'
import { findDiskMedia } from '../server/diskMedia.mjs'


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
		owner: PORTFOLIO_OWNER,
		findLocalMedia: findDiskMedia,
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

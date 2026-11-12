// Collects the portfolio projects from the GitHub repos of a user.
// Used by the Vercel function (api/projects.js) and by the check script (scripts/check-projects.mjs).
// Marking rules: docs/portfolio-flags.md.

import { compareProjects, validateProject } from '../src/pages/projects/lib/projectSchema.js'
import { fetchLanguages, fetchRawFile, listRepos, rawFileUrl } from './github.mjs'
import { buildProject, isPortfolioRepo, toProjectId } from './buildProject.mjs'
import { YamlError, parseYaml } from './parseYaml.mjs'

const METADATA_PATH = '.github/portfolio.yml'

// GitHub user whose repos are scanned (overridable for tests or a fork).
export const PORTFOLIO_OWNER = process.env.PORTFOLIO_GITHUB_OWNER || 'MaximePirt'

/**
 * @brief Reads and parses `.github/portfolio.yml` of a repo.
 * @param {string} owner - GitHub user.
 * @param {object} repo - GitHub repo.
 * @returns {Promise<object|null>} Metadata, or null if the file does not exist.
 * @throws {YamlError} If the file is invalid.
 */
async function readMetadata(owner, repo) {
	const source = await fetchRawFile(owner, repo.name, repo.default_branch, METADATA_PATH)
	return source == null ? null : parseYaml(source)
}

/**
 * @brief Builds and validates the project of one repo.
 * @param {string} owner - GitHub user.
 * @param {object} repo - GitHub repo.
 * @param {(id: string) => Promise<object>} findLocalMedia - Finds the media hosted in the portfolio.
 * @returns {Promise<{repo: string, project?: object, warnings: string[], errors: string[]}|null>} Null if the repo is not marked.
 */
// Result for one repo: null (not marked) or { repo, project?, warnings, errors }.
async function loadProject(owner, repo, findLocalMedia) {
	let metadata
	try {
		metadata = await readMetadata(owner, repo)
	} catch (error) {
		if (error instanceof YamlError) {
			return { repo: repo.name, warnings: [], errors: [`${METADATA_PATH} invalide, ${error.message}`] }
		}
		throw error
	}

	if (!isPortfolioRepo(repo, metadata)) return null

	const id = metadata?.id ?? toProjectId(repo.name)
	const [languages, localMedia] = await Promise.all([
		fetchLanguages(owner, repo.name),
		findLocalMedia(id),
	])
	const rawUrl = (path) => rawFileUrl(owner, repo.name, repo.default_branch, path)
	const { project, warnings } = buildProject({ repo, metadata: metadata ?? {}, languages, localMedia, rawUrl })

	return { repo: repo.name, project, warnings, errors: validateProject(project) }
}

/**
 * @brief Adds an error to every project whose id is already used by an earlier repo.
 * @param {{repo: string, project?: object, errors: string[]}[]} results - Per-repo results (mutated).
 */
function flagDuplicateIds(results) {
	const owners = new Map()
	results
		.filter((result) => result.project)
		.forEach((result) => {
			const firstRepo = owners.get(result.project.id)
			if (firstRepo) result.errors.push(`id "${result.project.id}" déjà utilisé par ${firstRepo}`)
			else owners.set(result.project.id, result.repo)
		})
}

/**
 * @brief Collects the projects of all the marked repos of a GitHub user.
 * Network/API errors are propagated: the caller decides what to show.
 * @param {object} options
 * @param {string} options.owner - GitHub user whose repos are scanned.
 * @param {(id: string) => Promise<object>} [options.findLocalMedia] - Finds the media of a project hosted in the portfolio.
 * @returns {Promise<{projects: object[], results: object[], repoCount: number}>}
 *   Valid projects (sorted), per-repo details (warnings and errors) and the number of repos scanned.
 */
export async function collectProjects({ owner, findLocalMedia = async () => ({}) }) {
	const repos = await listRepos(owner)
	const results = (await Promise.all(repos.map((repo) => loadProject(owner, repo, findLocalMedia))))
		.filter(Boolean)

	flagDuplicateIds(results)

	const projects = results
		.filter((result) => result.project && !result.errors.length)
		.map((result) => result.project)
		.sort(compareProjects)

	return { projects, results, repoCount: repos.length }
}

// GitHub access: REST API for metadata, raw.githubusercontent.com (outside the API quota) for files.

const API_URL = 'https://api.github.com'
const RAW_URL = 'https://raw.githubusercontent.com'
const PAGE_SIZE = 100

/**
 * @brief Builds the GitHub API headers, with the token if GITHUB_TOKEN is set.
 * @returns {Object<string, string>} Request headers.
 */
function apiHeaders() {
	const headers = {
		Accept: 'application/vnd.github+json',
		'User-Agent': 'portfolio-projects-sync',
	}
	if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
	return headers
}

/**
 * @brief Fetches a GitHub API path and parses the JSON.
 * @param {string} path - API path starting with "/".
 * @returns {Promise<*>} Parsed response.
 * @throws {Error} On a non-OK response.
 */
async function fetchJson(path) {
	const response = await fetch(`${API_URL}${path}`, { headers: apiHeaders() })
	if (!response.ok) throw new Error(`GitHub API ${response.status} sur ${path}`)
	return response.json()
}

/**
 * @brief Lists all the repos of a user, page after page.
 * @param {string} owner - GitHub user.
 * @returns {Promise<object[]>} Repos.
 */
export async function listRepos(owner) {
	const repos = []
	for (let page = 1; ; page++) {
		const batch = await fetchJson(`/users/${owner}/repos?type=owner&per_page=${PAGE_SIZE}&page=${page}`)
		repos.push(...batch)
		if (batch.length < PAGE_SIZE) return repos
	}
}

/**
 * @brief Fetches the languages of a repo.
 * @param {string} owner - GitHub user.
 * @param {string} repo - Repo name.
 * @returns {Promise<Object<string, number>>} Bytes of code per language.
 */
export function fetchLanguages(owner, repo) {
	return fetchJson(`/repos/${owner}/${repo}/languages`)
}

/**
 * @brief Builds the raw.githubusercontent.com URL of a repo file.
 * @param {string} owner - GitHub user.
 * @param {string} repo - Repo name.
 * @param {string} branch - Branch name.
 * @param {string} path - File path in the repo.
 * @returns {string} Raw file URL.
 */
export function rawFileUrl(owner, repo, branch, path) {
	return `${RAW_URL}/${owner}/${repo}/${branch}/${path}`
}

/**
 * @brief Fetches the text of a repo file.
 * @param {string} owner - GitHub user.
 * @param {string} repo - Repo name.
 * @param {string} branch - Branch name.
 * @param {string} path - File path in the repo.
 * @returns {Promise<string|null>} File content, or null if it does not exist.
 * @throws {Error} On a response other than 200 or 404.
 */
// File content, or null if it does not exist.
export async function fetchRawFile(owner, repo, branch, path) {
	const url = rawFileUrl(owner, repo, branch, path)
	const response = await fetch(url)
	if (response.status === 404) return null
	if (!response.ok) throw new Error(`${response.status} sur ${url}`)
	return response.text()
}

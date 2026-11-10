// Accès GitHub : API REST pour les métadonnées, raw.githubusercontent.com (hors quota) pour les fichiers.

const API_URL = 'https://api.github.com'
const RAW_URL = 'https://raw.githubusercontent.com'
const PAGE_SIZE = 100

function apiHeaders() {
	const headers = {
		Accept: 'application/vnd.github+json',
		'User-Agent': 'portfolio-projects-sync',
	}
	if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
	return headers
}

async function fetchJson(path) {
	const response = await fetch(`${API_URL}${path}`, { headers: apiHeaders() })
	if (!response.ok) throw new Error(`GitHub API ${response.status} sur ${path}`)
	return response.json()
}

export async function listRepos(owner) {
	const repos = []
	for (let page = 1; ; page++) {
		const batch = await fetchJson(`/users/${owner}/repos?type=owner&per_page=${PAGE_SIZE}&page=${page}`)
		repos.push(...batch)
		if (batch.length < PAGE_SIZE) return repos
	}
}

export function fetchLanguages(owner, repo) {
	return fetchJson(`/repos/${owner}/${repo}/languages`)
}

export function rawFileUrl(owner, repo, branch, path) {
	return `${RAW_URL}/${owner}/${repo}/${branch}/${path}`
}

// Contenu du fichier, ou null s'il n'existe pas.
export async function fetchRawFile(owner, repo, branch, path) {
	const url = rawFileUrl(owner, repo, branch, path)
	const response = await fetch(url)
	if (response.status === 404) return null
	if (!response.ok) throw new Error(`${response.status} sur ${url}`)
	return response.text()
}

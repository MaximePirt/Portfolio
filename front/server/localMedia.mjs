// Detection of the media of a project stored in the portfolio (public/projects/<id>/).
// Two sources for the same result: the disk (check script) or the deployed site (Vercel function,
// which cannot read public/).

export const LOCAL_MEDIA_FILES = {
	cover: ['poster.webp', 'cover.webp', 'poster.png', 'poster.jpg'],
	webm: ['trailer.webm'],
	mp4: ['trailer.mp4'],
}

/**
 * @brief Builds the public path of a project media file.
 * @param {string} id - Project id.
 * @param {string} fileName - File name.
 * @returns {string} Path such as "/projects/<id>/<file>".
 */
function toPublicPath(id, fileName) {
	return `/projects/${id}/${fileName}`
}

/**
 * @brief Turns the found file names into [kind, public path] entries.
 * @param {string} id - Project id.
 * @param {Object<string, string|undefined>} foundNames - File name found per kind.
 * @returns {[string, string][]} Entries for the kinds that were found.
 */
function toMediaEntries(id, foundNames) {
	return Object.keys(LOCAL_MEDIA_FILES)
		.filter((kind) => foundNames[kind])
		.map((kind) => [kind, toPublicPath(id, foundNames[kind])])
}

/**
 * @brief Creates a media finder that reads project folders through the given function.
 * @param {(id: string) => Promise<string[]>} readdir - Returns the file names of a project folder (empty if missing).
 * @returns {(id: string) => Promise<{cover?: string, webm?: string, mp4?: string}>} Media paths found for a project id.
 */
export function createFsMediaFinder(readdir) {
	return async (id) => {
		const files = await readdir(id)
		const foundNames = Object.fromEntries(
			Object.entries(LOCAL_MEDIA_FILES).map(([kind, candidates]) => [
				kind,
				candidates.find((name) => files.includes(name)),
			])
		)
		return Object.fromEntries(toMediaEntries(id, foundNames))
	}
}

/**
 * @brief Tells whether a file exists on the deployed site (a text/html answer means "missing").
 * @param {string} origin - Site origin.
 * @param {string} path - Public path of the file.
 * @returns {Promise<boolean>} True if the file exists.
 */
// On the site, a missing file is rewritten to index.html (200 response as text/html):
// another content type is therefore required to consider that the file exists.
async function existsOnSite(origin, path) {
	try {
		const response = await fetch(`${origin}${path}`, { method: 'HEAD' })
		return response.ok && !(response.headers.get('content-type') || '').includes('text/html')
	} catch {
		return false
	}
}

/**
 * @brief Creates a media finder that probes the deployed site with HEAD requests.
 * @param {string} origin - Site origin such as "https://example.com".
 * @returns {(id: string) => Promise<{cover?: string, webm?: string, mp4?: string}>} Media paths found for a project id.
 */
export function createHttpMediaFinder(origin) {
	return async (id) => {
		const entries = await Promise.all(
			Object.entries(LOCAL_MEDIA_FILES).map(async ([kind, candidates]) => {
				const found = await Promise.all(
					candidates.map(async (name) => (await existsOnSite(origin, toPublicPath(id, name))) ? name : null)
				)
				return [kind, found.find(Boolean)]
			})
		)
		return Object.fromEntries(toMediaEntries(id, Object.fromEntries(entries)))
	}
}

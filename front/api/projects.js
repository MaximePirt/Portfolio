// Vercel function: GET /api/projects -> projects of the GitHub repos marked for the portfolio.
// Same handler in dev (Vite plugin, see vite.config.js); only uses the standard Node (req, res) API.
// Marking rules: docs/portfolio-flags.md. Optional variables:
//   GITHUB_TOKEN (API quota), PORTFOLIO_GITHUB_OWNER (default MaximePirt), PORTFOLIO_SITE_URL (default: request host).

import { SCHEMA_VERSION } from '../src/pages/projects/lib/projectSchema.js'
import { PORTFOLIO_OWNER, collectProjects } from '../server/collectProjects.mjs'
import { createHttpMediaFinder } from '../server/localMedia.mjs'


// Browser: 5 min. CDN: 1 h, then the stale response is served (up to 24 h) while it is recomputed in the background.
const CACHE_OK = 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400'
const CACHE_ERROR = 'no-store'

/**
 * @brief Gets the public origin of the site, used to probe the media files of the portfolio.
 * @param {import('node:http').IncomingMessage} req - Incoming request.
 * @returns {string} Origin such as "https://example.com" (no trailing slash).
 */
function getSiteOrigin(req) {
	if (process.env.PORTFOLIO_SITE_URL) return process.env.PORTFOLIO_SITE_URL.replace(/\/$/, '')
	const protocol = req.headers['x-forwarded-proto'] || 'http'
	return `${protocol}://${req.headers['x-forwarded-host'] || req.headers.host}`
}

/**
 * @brief Sends a JSON response with the given status and Cache-Control.
 * @param {import('node:http').ServerResponse} res - Response to write.
 * @param {number} status - HTTP status code.
 * @param {object} body - Serializable response body.
 * @param {string} cacheControl - Cache-Control header value.
 */
function sendJson(res, status, body, cacheControl) {
	res.statusCode = status
	res.setHeader('Content-Type', 'application/json; charset=utf-8')
	res.setHeader('Cache-Control', cacheControl)
	res.end(JSON.stringify(body))
}

/**
 * @brief Handles GET /api/projects: collects the marked GitHub projects and answers with a cacheable JSON.
 * Answers 502 (never cached) if GitHub is unreachable, 405 for other methods.
 * @param {import('node:http').IncomingMessage} req - Incoming request.
 * @param {import('node:http').ServerResponse} res - Response to write.
 */
export default async function handler(req, res) {
	if (req.method !== 'GET' && req.method !== 'HEAD') {
		res.setHeader('Allow', 'GET, HEAD')
		return sendJson(res, 405, { error: 'method_not_allowed' }, CACHE_ERROR)
	}

	try {
		const { projects } = await collectProjects({
			owner: PORTFOLIO_OWNER,
			findLocalMedia: createHttpMediaFinder(getSiteOrigin(req)),
		})
		sendJson(res, 200, { version: SCHEMA_VERSION, projects }, CACHE_OK)
	} catch (error) {
		console.error(`[api/projects] ${error.message}`)
		sendJson(res, 502, { error: 'github_unavailable' }, CACHE_ERROR)
	}
}

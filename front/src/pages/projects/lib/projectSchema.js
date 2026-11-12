// Canonical shape of a project, shared by the front and by the server code (front/server/, front/api/).
// Plain JS (neither React nor Node): imports include extensions so Node can read them.
// Any format change: bump SCHEMA_VERSION and update docs/portfolio-flags.md.

export const SCHEMA_VERSION = 1

export const ORIGINS = ['42', 'personal', 'freelance']
export const DOMAINS = ['frontend', 'backend', 'systems', 'devops', 'data']
export const STATUSES = ['completed', 'in-progress']

export const DEFAULT_ORIGIN = 'personal'
export const DEFAULT_STATUS = 'completed'
export const DEFAULT_ORDER = 100

const ID_PATTERN = /^[a-z0-9][a-z0-9_-]*$/
const URL_PATTERN = /^(https?:\/\/|\/)/

/**
 * @brief Normalizes a text field into its French and English variants.
 * @param {string|{fr?: string, en?: string}} value - Plain string (used for both languages) or per-language object.
 * @returns {{fr: string, en: string}} Text for each language, empty strings when missing.
 */
function toText(value) {
	if (!value) return { fr: '', en: '' }
	if (typeof value === 'string') return { fr: value, en: value }
	return { fr: value.fr || '', en: value.en || '' }
}

/**
 * @brief Normalizes a list field: accepts a single value or an array, drops empty entries.
 * @param {*} value - Single value, array, null or empty string.
 * @returns {string[]} List of non-empty strings.
 */
function toList(value) {
	if (value == null || value === '') return []
	const list = Array.isArray(value) ? value : [value]
	return list.map(String).filter(Boolean)
}

/**
 * @brief Turns a raw project entry (from JSON or manual data) into the canonical shape, filling defaults.
 * @param {object} raw - Raw project object as written in the sources.
 * @returns {object} Project with all fields set, ready for validation and display.
 */
export function normalizeProject(raw) {
	return {
		id: raw.id,
		repo: raw.repo || '',
		title: raw.title || raw.id,
		summary: toText(raw.summary),
		description: toText(raw.description),
		status: raw.status || DEFAULT_STATUS,
		origin: String(raw.origin ?? DEFAULT_ORIGIN),
		domains: toList(raw.domains),
		stack: toList(raw.stack),
		links: {
			github: raw.links?.github || '',
			demo: raw.links?.demo || '',
		},
		media: {
			cover: raw.media?.cover || '',
			webm: raw.media?.webm || '',
			mp4: raw.media?.mp4 || '',
		},
		featured: raw.featured === true,
		order: Number.isFinite(raw.order) ? raw.order : DEFAULT_ORDER,
		createdAt: raw.createdAt || '',
		// Reserved for a future launch of projects from the portfolio: kept as-is, not read by the UI.
		run: raw.run ?? null,
	}
}

/**
 * @brief Pushes an error if a non-empty URL is neither http(s) nor an absolute path.
 * @param {string[]} errors - Error list to append to (mutated).
 * @param {string} field - Field name used in the error message.
 * @param {string} value - URL or path to check; empty values are ignored.
 */
function checkUrl(errors, field, value) {
	if (value && !URL_PATTERN.test(value)) errors.push(`${field} doit être une URL http(s) ou un chemin absolu`)
}

/**
 * @brief Checks a normalized project against the schema rules (id, status, origin, domains, URLs).
 * @param {object} project - Normalized project (see normalizeProject).
 * @returns {string[]} Error messages; empty when the project is valid.
 */
export function validateProject(project) {
	const errors = []

	if (!ID_PATTERN.test(project.id || '')) errors.push(`id invalide "${project.id}" (a-z, 0-9, - et _)`)
	if (!STATUSES.includes(project.status)) errors.push(`status invalide "${project.status}" (${STATUSES.join(', ')})`)
	if (!ORIGINS.includes(project.origin)) errors.push(`origin invalide "${project.origin}" (${ORIGINS.join(', ')})`)

	project.domains
		.filter((domain) => !DOMAINS.includes(domain))
		.forEach((domain) => errors.push(`domain inconnu "${domain}" (${DOMAINS.join(', ')})`))

	checkUrl(errors, 'demo', project.links.demo)
	checkUrl(errors, 'cover', project.media.cover)
	checkUrl(errors, 'video', project.media.webm || project.media.mp4)

	return errors
}

/**
 * @brief Sort comparator: featured first, then by order, then newest createdAt, then by title.
 * @param {object} a - First project.
 * @param {object} b - Second project.
 * @returns {number} Negative, zero or positive, as Array.prototype.sort expects.
 */
export function compareProjects(a, b) {
	if (a.featured !== b.featured) return a.featured ? -1 : 1
	if (a.order !== b.order) return a.order - b.order
	if (a.createdAt !== b.createdAt) return b.createdAt.localeCompare(a.createdAt)
	return a.title.localeCompare(b.title)
}

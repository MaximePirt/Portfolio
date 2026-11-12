// Turns a GitHub repo (+ its .github/portfolio.yml) into a canonical project.
// Rules described in docs/portfolio-flags.md: keep both in sync.

import { DOMAINS, normalizeProject } from '../src/pages/projects/lib/projectSchema.js'

export const PORTFOLIO_TOPIC = 'portfolio'
const WIP_TOPIC = 'wip'
const STACK_SIZE = 4

const TOPIC_ORIGINS = {
	'42': '42',
	'42school': '42',
	personal: 'personal',
	freelance: 'freelance',
}

const LANGUAGE_DOMAINS = {
	C: 'systems',
	'C++': 'systems',
	Rust: 'systems',
	Python: 'data',
	'Jupyter Notebook': 'data',
	Shell: 'devops',
	Dockerfile: 'devops',
	TypeScript: 'frontend',
	JavaScript: 'frontend',
	HTML: 'frontend',
	CSS: 'frontend',
}

const METADATA_KEYS = [
	'portfolio', 'id', 'title', 'status', 'origin', 'domains', 'summary', 'description',
	'stack', 'demo', 'cover', 'video', 'featured', 'order', 'run',
]

/**
 * @brief Tells whether a repo is marked for the portfolio (topic or `portfolio: true`; `portfolio: false` opts out).
 * @param {object} repo - GitHub repo.
 * @param {object|null} metadata - Content of `.github/portfolio.yml`, if any.
 * @returns {boolean} True if the repo must be displayed.
 */
export function isPortfolioRepo(repo, metadata) {
	if (metadata?.portfolio === false) return false
	return repo.topics.includes(PORTFOLIO_TOPIC) || metadata?.portfolio === true
}

/**
 * @brief Turns a repo name into a valid project id (lowercase, a-z 0-9 - _).
 * @param {string} name - Repo name.
 * @returns {string} Project id.
 */
export function toProjectId(name) {
	return name.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '')
}

/**
 * @brief Infers the origin of a project from the repo topics.
 * @param {string[]} topics - Repo topics.
 * @returns {string|null} Origin, or null if no topic matches.
 */
function inferOrigin(topics) {
	const topic = topics.find((name) => Object.hasOwn(TOPIC_ORIGINS, name))
	return topic ? TOPIC_ORIGINS[topic] : null
}

/**
 * @brief Infers the domains from the topics, else from the main language.
 * @param {string[]} topics - Repo topics.
 * @param {string|null} language - Main language of the repo.
 * @returns {string[]} Domains (possibly empty).
 */
function inferDomains(topics, language) {
	const fromTopics = topics.filter((name) => DOMAINS.includes(name))
	if (fromTopics.length) return fromTopics
	return LANGUAGE_DOMAINS[language] ? [LANGUAGE_DOMAINS[language]] : []
}

/**
 * @brief Builds the stack from the most used languages.
 * @param {Object<string, number>} languages - Bytes of code per language.
 * @returns {string[]} Up to STACK_SIZE language names, most used first.
 */
function inferStack(languages) {
	return Object.entries(languages)
		.sort(([, a], [, b]) => b - a)
		.slice(0, STACK_SIZE)
		.map(([name]) => name)
}

/**
 * @brief Resolves a media path of `portfolio.yml` into a URL (relative paths point to the repo raw files).
 * @param {string} value - Absolute URL or path relative to the repo.
 * @param {(path: string) => string} rawUrl - Builds the raw URL of a repo file.
 * @returns {string} URL, or an empty string if no value.
 */
function resolveMediaUrl(value, rawUrl) {
	if (!value) return ''
	if (/^https?:\/\//.test(value)) return value
	return rawUrl(value.replace(/^\.?\//, ''))
}

/**
 * @brief Splits a video URL into its webm/mp4 slot according to the extension.
 * @param {string} url - Video URL.
 * @returns {{webm: string, mp4: string}} Sources (empty when not matching).
 */
function toVideoSources(url) {
	return {
		webm: /\.webm(\?|$)/i.test(url) ? url : '',
		mp4: /\.mp4(\?|$)/i.test(url) ? url : '',
	}
}

/**
 * @brief Builds the media of a project: local files first, overridden by `cover` and `video` of the metadata.
 * @param {object} metadata - Content of `portfolio.yml`.
 * @param {{cover?: string, webm?: string, mp4?: string}} localMedia - Media hosted in the portfolio.
 * @param {(path: string) => string} rawUrl - Builds the raw URL of a repo file.
 * @param {string[]} warnings - Warning list to append to (mutated).
 * @returns {{cover: string, webm: string, mp4: string}} Media URLs.
 */
function buildMedia(metadata, localMedia, rawUrl, warnings) {
	const media = {
		cover: localMedia.cover || '',
		webm: localMedia.webm || '',
		mp4: localMedia.mp4 || '',
	}
	if (metadata.cover) media.cover = resolveMediaUrl(metadata.cover, rawUrl)
	if (metadata.video) {
		const sources = toVideoSources(resolveMediaUrl(metadata.video, rawUrl))
		if (!sources.webm && !sources.mp4) warnings.push('video ignorée : extension .webm ou .mp4 attendue')
		else Object.assign(media, sources)
	}
	return media
}

/**
 * @brief Builds the canonical project of a repo from its GitHub data and its `portfolio.yml`.
 * @param {Object} options
 * @param {object} options.repo - GitHub repo.
 * @param {object} [options.metadata] - Content of `portfolio.yml`.
 * @param {Object<string, number>} [options.languages] - Bytes of code per language.
 * @param {object} [options.localMedia] - Media hosted in the portfolio.
 * @param {(path: string) => string} options.rawUrl - Builds the raw URL of a repo file.
 * @returns {{project: object, warnings: string[]}} Normalized project and non-blocking warnings.
 */
export function buildProject({ repo, metadata = {}, languages = {}, localMedia = {}, rawUrl }) {
	const warnings = Object.keys(metadata)
		.filter((key) => !METADATA_KEYS.includes(key))
		.map((key) => `champ inconnu "${key}" ignoré`)

	const origin = metadata.origin ?? inferOrigin(repo.topics)
	if (origin == null) warnings.push('origin absente : "personal" par défaut')

	const project = normalizeProject({
		id: metadata.id ?? toProjectId(repo.name),
		repo: repo.full_name,
		title: metadata.title ?? repo.name,
		summary: metadata.summary,
		description: metadata.description ?? repo.description,
		status: metadata.status ?? (repo.topics.includes(WIP_TOPIC) ? 'in-progress' : undefined),
		origin,
		domains: metadata.domains ?? inferDomains(repo.topics, repo.language),
		stack: metadata.stack ?? inferStack(languages),
		links: { github: repo.html_url, demo: metadata.demo ?? repo.homepage },
		media: buildMedia(metadata, localMedia, rawUrl, warnings),
		featured: metadata.featured,
		order: metadata.order,
		createdAt: repo.created_at,
		run: metadata.run,
	})

	return { project, warnings }
}

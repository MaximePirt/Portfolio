// Transforme un repo GitHub (+ son .github/portfolio.yml) en projet canonique.
// Règles décrites dans docs/portfolio-flags.md : garder les deux synchronisés.

import { DOMAINS, normalizeProject } from '../../src/pages/projects/lib/projectSchema.js'

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

export function isPortfolioRepo(repo, metadata) {
	if (metadata?.portfolio === false) return false
	return repo.topics.includes(PORTFOLIO_TOPIC) || metadata?.portfolio === true
}

export function toProjectId(name) {
	return name.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '')
}

function inferOrigin(topics) {
	const topic = topics.find((name) => Object.hasOwn(TOPIC_ORIGINS, name))
	return topic ? TOPIC_ORIGINS[topic] : null
}

function inferDomains(topics, language) {
	const fromTopics = topics.filter((name) => DOMAINS.includes(name))
	if (fromTopics.length) return fromTopics
	return LANGUAGE_DOMAINS[language] ? [LANGUAGE_DOMAINS[language]] : []
}

function inferStack(languages) {
	return Object.entries(languages)
		.sort(([, a], [, b]) => b - a)
		.slice(0, STACK_SIZE)
		.map(([name]) => name)
}

function resolveMediaUrl(value, rawUrl) {
	if (!value) return ''
	if (/^https?:\/\//.test(value)) return value
	return rawUrl(value.replace(/^\.?\//, ''))
}

function toVideoSources(url) {
	return {
		webm: /\.webm(\?|$)/i.test(url) ? url : '',
		mp4: /\.mp4(\?|$)/i.test(url) ? url : '',
	}
}

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

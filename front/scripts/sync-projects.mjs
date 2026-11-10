#!/usr/bin/env node
// Synchronise la liste des projets du portfolio depuis les repos GitHub marqués
// (topic `portfolio` et/ou .github/portfolio.yml — voir docs/portfolio-flags.md).
//
//   npm --prefix front run sync:projects             écrit projects.generated.json
//   npm --prefix front run sync:projects -- --check  valide sans écrire (exit 1 si erreur)
//
// Variables : GITHUB_TOKEN (optionnel, quota API), PORTFOLIO_GITHUB_OWNER (défaut MaximePirt).

import { readdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { SCHEMA_VERSION, compareProjects, validateProject } from '../src/pages/projects/lib/projectSchema.js'
import { fetchLanguages, fetchRawFile, listRepos, rawFileUrl } from './lib/github.mjs'
import { buildProject, isPortfolioRepo, toProjectId } from './lib/buildProject.mjs'
import { YamlError, parseYaml } from './lib/parseYaml.mjs'

const OWNER = process.env.PORTFOLIO_GITHUB_OWNER || 'MaximePirt'
const METADATA_PATH = '.github/portfolio.yml'
const OUTPUT_FILE = fileURLToPath(new URL('../src/pages/projects/projects.generated.json', import.meta.url))
const PUBLIC_PROJECTS_DIR = new URL('../public/projects/', import.meta.url)

const LOCAL_MEDIA_FILES = {
	cover: ['poster.webp', 'cover.webp', 'poster.png', 'poster.jpg'],
	webm: ['trailer.webm'],
	mp4: ['trailer.mp4'],
}

const isCheckOnly = process.argv.includes('--check')

async function findLocalMedia(id) {
	let files = []
	try {
		files = await readdir(new URL(`${id}/`, PUBLIC_PROJECTS_DIR))
	} catch {
		return {}
	}

	return Object.fromEntries(
		Object.entries(LOCAL_MEDIA_FILES)
			.map(([kind, candidates]) => [kind, candidates.find((name) => files.includes(name))])
			.filter(([, name]) => name)
			.map(([kind, name]) => [kind, `/projects/${id}/${name}`])
	)
}

async function readMetadata(repo) {
	const source = await fetchRawFile(OWNER, repo.name, repo.default_branch, METADATA_PATH)
	return source == null ? null : parseYaml(source)
}

async function loadProject(repo) {
	let metadata
	try {
		metadata = await readMetadata(repo)
	} catch (error) {
		if (error instanceof YamlError) return { repo: repo.name, errors: [`${METADATA_PATH} invalide, ${error.message}`] }
		throw error
	}

	if (!isPortfolioRepo(repo, metadata)) return null

	const id = metadata?.id ?? toProjectId(repo.name)
	const [languages, localMedia] = await Promise.all([
		fetchLanguages(OWNER, repo.name),
		findLocalMedia(id),
	])
	const rawUrl = (path) => rawFileUrl(OWNER, repo.name, repo.default_branch, path)
	const { project, warnings } = buildProject({ repo, metadata: metadata ?? {}, languages, localMedia, rawUrl })

	return { repo: repo.name, project, warnings, errors: validateProject(project) }
}

function flagDuplicateIds(results) {
	const seen = new Map()
	results
		.filter((result) => result.project)
		.forEach((result) => {
			const owner = seen.get(result.project.id)
			if (owner) result.errors.push(`id "${result.project.id}" déjà utilisé par ${owner}`)
			else seen.set(result.project.id, result.repo)
		})
}

function report(results) {
	results.forEach(({ repo, project, warnings = [], errors }) => {
		const status = errors.length ? '✗' : '✓'
		console.log(`${status} ${repo}${project ? ` → ${project.id}` : ''}`)
		warnings.forEach((message) => console.log(`    ⚠ ${message}`))
		errors.forEach((message) => console.log(`    ✗ ${message}`))
	})
}

async function main() {
	const repos = await listRepos(OWNER)
	const results = (await Promise.all(repos.map(loadProject))).filter(Boolean)

	flagDuplicateIds(results)
	report(results)

	const projects = results
		.filter((result) => result.project && !result.errors.length)
		.map((result) => result.project)
		.sort(compareProjects)
	const errorCount = results.filter((result) => result.errors.length).length

	console.log(`\n${projects.length} projet(s) valide(s), ${errorCount} en erreur, ${repos.length} repo(s) parcouru(s).`)

	if (isCheckOnly) {
		process.exitCode = errorCount ? 1 : 0
		return
	}

	const content = `${JSON.stringify({ version: SCHEMA_VERSION, projects }, null, '\t')}\n`
	await writeFile(OUTPUT_FILE, content)
	console.log(`Écrit : ${OUTPUT_FILE}`)
}

main().catch((error) => {
	console.error(`Synchronisation interrompue, fichier inchangé : ${error.message}`)
	process.exitCode = 1
})

#!/usr/bin/env node
// Vérifie que fr/en translation.json ont exactement les mêmes clés.
// Usage manuel : node .claude/hooks/i18n-parity.mjs
// Usage hook (PostToolUse) : node .claude/hooks/i18n-parity.mjs --hook  (lit le JSON du hook sur stdin)
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = process.env.CLAUDE_PROJECT_DIR || join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const isHook = process.argv.includes('--hook')

if (isHook) {
	let input = {}
	try { input = JSON.parse(readFileSync(0, 'utf8') || '{}') } catch { process.exit(0) }
	const file = input?.tool_input?.file_path || ''
	if (!/i18n\/locales\/[^/]+\/translation\.json$/.test(file)) process.exit(0)
}

const localesDir = join(root, 'front', 'src', 'i18n', 'locales')
const load = (lang) => JSON.parse(readFileSync(join(localesDir, lang, 'translation.json'), 'utf8'))

const flatten = (obj, prefix = '') =>
	Object.entries(obj).flatMap(([k, v]) =>
		v && typeof v === 'object' && !Array.isArray(v) ? flatten(v, `${prefix}${k}.`) : [`${prefix}${k}`])

let fr, en
try {
	fr = new Set(flatten(load('fr')))
	en = new Set(flatten(load('en')))
} catch (err) {
	console.error(`[i18n-parity] JSON invalide : ${err.message}`)
	process.exit(2)
}

const missingInEn = [...fr].filter((k) => !en.has(k))
const missingInFr = [...en].filter((k) => !fr.has(k))

if (missingInEn.length || missingInFr.length) {
	if (missingInEn.length) console.error(`[i18n-parity] Clés absentes de en/translation.json :\n  - ${missingInEn.join('\n  - ')}`)
	if (missingInFr.length) console.error(`[i18n-parity] Clés absentes de fr/translation.json :\n  - ${missingInFr.join('\n  - ')}`)
	process.exit(isHook ? 2 : 1)
}

if (!isHook) console.log(`[i18n-parity] OK — ${fr.size} clés identiques en fr et en.`)

#!/usr/bin/env node
// PostToolUse (Edit|Write) : lance ESLint sur le fichier .js/.jsx édité sous front/.
// Exit 2 + stderr => Claude reçoit les erreurs et doit les corriger.
import { readFileSync, existsSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = process.env.CLAUDE_PROJECT_DIR || join(dirname(fileURLToPath(import.meta.url)), '..', '..')
let input = {}
try { input = JSON.parse(readFileSync(0, 'utf8') || '{}') } catch { process.exit(0) }

const file = input?.tool_input?.file_path
if (!file || !/\.(jsx?|mjs)$/.test(file)) process.exit(0)

const frontDir = join(root, 'front')
const rel = relative(frontDir, file)
if (rel.startsWith('..') || rel.startsWith('node_modules') || rel.startsWith('dist')) process.exit(0)

const eslint = join(frontDir, 'node_modules', '.bin', 'eslint')
if (!existsSync(eslint)) process.exit(0) // dépendances non installées : on ne bloque pas

const res = spawnSync(eslint, ['--no-warn-ignored', rel], { cwd: frontDir, encoding: 'utf8' })
if (res.status !== 0) {
	console.error(`[lint-file] ESLint signale des problèmes dans front/${rel} :\n${(res.stdout || '') + (res.stderr || '')}`)
	process.exit(2)
}

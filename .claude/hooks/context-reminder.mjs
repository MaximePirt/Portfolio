#!/usr/bin/env node
// Stop : si du code/config a changé (non commité) sans mise à jour du contexte Claude,
// bloque une fois pour rappeler la règle de maintenance de CLAUDE.md.
// Ne relance pas le rappel pour un même état du diff (empreinte stockée dans .claude/hooks/.state).
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = process.env.CLAUDE_PROJECT_DIR || join(dirname(fileURLToPath(import.meta.url)), '..', '..')
let input = {}
try { input = JSON.parse(readFileSync(0, 'utf8') || '{}') } catch { /* entrée vide */ }
if (input.stop_hook_active) process.exit(0)

const git = (...args) => spawnSync('git', args, { cwd: root, encoding: 'utf8' })
const status = git('status', '--porcelain', '--untracked-files=all')
if (status.status !== 0) process.exit(0)

const paths = status.stdout.split('\n').filter(Boolean).map((l) => l.slice(3).split(' -> ').pop())
const isCode = (p) =>
	/^(front\/(src|public|index\.html|vite\.config|eslint\.config|package\.json|vercel\.json)|nginx\/|docker-compose\.yml|\.env\.example)/.test(p)
const isContext = (p) => p === 'CLAUDE.md' || p.startsWith('.claude/context/')

const code = paths.filter(isCode)
if (!code.length || paths.some(isContext)) process.exit(0)

const diff = git('diff', 'HEAD', '--', ...code).stdout || ''
const signature = createHash('sha1').update(code.join('\n') + diff).digest('hex')
const stateFile = join(root, '.claude', 'hooks', '.state')
if (existsSync(stateFile) && readFileSync(stateFile, 'utf8').trim() === signature) process.exit(0)
writeFileSync(stateFile, signature)

console.error(
	`[context-reminder] Fichiers modifiés sans mise à jour du contexte Claude :\n  - ${code.join('\n  - ')}\n` +
	`Règle de maintenance (CLAUDE.md) : mets à jour CLAUDE.md et/ou .claude/context/* (architecture, conventions, deploy, known-issues) ` +
	`si ces changements touchent la structure, une convention, une dépendance, une commande ou le déploiement. ` +
	`Sinon, indique brièvement pourquoi aucune mise à jour n'est nécessaire.`
)
process.exit(2)

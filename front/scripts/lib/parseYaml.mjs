// Mini parseur YAML limité au sous-ensemble documenté dans docs/portfolio-flags.md :
// mappings imbriqués, listes de valeurs (`- a` ou `[a, b]`), scalaires (chaînes, guillemets,
// booléens, nombres, null), blocs `>` / `|`, commentaires `#`.
// Toute autre syntaxe lève une YamlError : mieux vaut ignorer un repo que mal l'interpréter.

export class YamlError extends Error {
	constructor(message, lineNumber) {
		super(`ligne ${lineNumber} : ${message}`)
		this.name = 'YamlError'
	}
}

const KEY_PATTERN = /^([A-Za-z0-9_-]+):(?:\s+(.*))?$/
const BLOCK_STYLES = ['>', '>-', '|', '|-']

function tokenize(source) {
	return source.replace(/^\uFEFF/, '').split(/\r?\n/).map((raw, index) => {
		const indentation = raw.match(/^[ \t]*/)[0]
		if (indentation.includes('\t')) throw new YamlError('tabulation interdite dans l\'indentation', index + 1)
		return { raw, number: index + 1, indent: indentation.length, text: raw.trim() }
	})
}

function isIgnorable(line) {
	return line.text === '' || line.text.startsWith('#')
}

function skipIgnorable(state) {
	while (state.index < state.lines.length && isIgnorable(state.lines[state.index])) state.index++
}

function currentLine(state) {
	return state.lines[state.index]
}

function isListItem(line) {
	return line.text === '-' || line.text.startsWith('- ')
}

function stripComment(text) {
	const commentIndex = text.search(/\s#/)
	return (commentIndex === -1 ? text : text.slice(0, commentIndex)).trim()
}

function parseQuoted(text, lineNumber) {
	const quote = text[0]
	const end = text.lastIndexOf(quote)
	if (end === 0) throw new YamlError('guillemet non fermé', lineNumber)
	if (stripComment(text.slice(end + 1))) throw new YamlError('texte inattendu après une chaîne entre guillemets', lineNumber)

	const body = text.slice(1, end)
	if (quote === '\'') return body.replaceAll('\'\'', '\'')
	return body.replace(/\\(["\\n])/g, (_, char) => (char === 'n' ? '\n' : char))
}

function splitInlineList(body) {
	const items = []
	let current = ''
	let quote = null

	for (const char of body) {
		if (quote) {
			if (char === quote) quote = null
			current += char
		} else if (char === '"' || char === '\'') {
			quote = char
			current += char
		} else if (char === ',') {
			items.push(current)
			current = ''
		} else {
			current += char
		}
	}
	items.push(current)
	return items.map((item) => item.trim()).filter(Boolean)
}

function parseInlineList(text, lineNumber) {
	const value = stripComment(text)
	if (!value.endsWith(']')) throw new YamlError('liste [ ] non fermée', lineNumber)
	return splitInlineList(value.slice(1, -1)).map((item) => parseScalar(item, lineNumber))
}

function parseScalar(text, lineNumber) {
	if (text.startsWith('"') || text.startsWith('\'')) return parseQuoted(text, lineNumber)
	if (text.startsWith('[')) return parseInlineList(text, lineNumber)
	if (text.startsWith('{')) throw new YamlError('objets en ligne { } non supportés', lineNumber)

	const value = stripComment(text)
	if (value === 'true') return true
	if (value === 'false') return false
	if (value === 'null' || value === '~' || value === '') return null
	if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value)
	return value
}

function foldRows(rows) {
	return rows.reduce((text, row) => {
		if (row === '') return `${text}\n`
		if (text === '' || text.endsWith('\n')) return text + row
		return `${text} ${row}`
	}, '')
}

function parseBlockScalar(state, parentIndent, style) {
	const rows = []
	while (state.index < state.lines.length) {
		const line = currentLine(state)
		if (line.text !== '' && line.indent <= parentIndent) break
		rows.push(line)
		state.index++
	}
	while (rows.length && rows.at(-1).text === '') rows.pop()
	if (!rows.length) return ''

	const contentIndent = Math.min(...rows.filter((row) => row.text).map((row) => row.indent))
	const lines = rows.map((row) => (row.text === '' ? '' : row.raw.slice(contentIndent).trimEnd()))
	return style.startsWith('|') ? lines.join('\n') : foldRows(lines)
}

function parseList(state, indent) {
	const result = []
	for (skipIgnorable(state); state.index < state.lines.length; skipIgnorable(state)) {
		const line = currentLine(state)
		if (line.indent < indent) break
		if (line.indent > indent) throw new YamlError('indentation inattendue', line.number)
		if (!isListItem(line)) break

		const item = line.text.slice(1).trim()
		if (KEY_PATTERN.test(item)) throw new YamlError('listes d\'objets non supportées', line.number)
		result.push(parseScalar(item, line.number))
		state.index++
	}
	return result
}

function parseValue(state, rest, indent, lineNumber) {
	if (BLOCK_STYLES.includes(rest)) return parseBlockScalar(state, indent, rest)
	if (rest !== '') return parseScalar(rest, lineNumber)

	skipIgnorable(state)
	const next = currentLine(state)
	if (!next) return null
	if (next.indent > indent) return parseNode(state, next.indent)
	if (next.indent === indent && isListItem(next)) return parseList(state, indent)
	return null
}

function parseMapping(state, indent) {
	const result = {}
	for (skipIgnorable(state); state.index < state.lines.length; skipIgnorable(state)) {
		const line = currentLine(state)
		if (line.indent < indent) break
		if (line.indent > indent) throw new YamlError('indentation inattendue', line.number)
		if (isListItem(line)) throw new YamlError('élément de liste sans clé parente', line.number)

		const match = line.text.match(KEY_PATTERN)
		if (!match) throw new YamlError(`"clé: valeur" attendu, reçu "${line.text}"`, line.number)

		const [, key, rest = ''] = match
		if (Object.hasOwn(result, key)) throw new YamlError(`clé "${key}" en double`, line.number)

		state.index++
		result[key] = parseValue(state, rest.trim(), indent, line.number)
	}
	return result
}

function parseNode(state, indent) {
	return isListItem(currentLine(state)) ? parseList(state, indent) : parseMapping(state, indent)
}

export function parseYaml(source) {
	const state = { lines: tokenize(source), index: 0 }

	skipIgnorable(state)
	if (state.index >= state.lines.length) return {}

	const result = parseNode(state, currentLine(state).indent)
	skipIgnorable(state)
	if (state.index < state.lines.length) throw new YamlError('indentation inattendue', currentLine(state).number)
	return result
}

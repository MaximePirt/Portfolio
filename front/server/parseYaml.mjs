// Minimal YAML parser limited to the subset documented in docs/portfolio-flags.md:
// nested mappings, lists of values (`- a` or `[a, b]`), scalars (strings, quotes,
// booleans, numbers, null), `>` / `|` blocks, `#` comments.
// Any other syntax throws a YamlError: better to skip a repo than to misread it.

export class YamlError extends Error {
	/**
	 * @brief Creates a parsing error that mentions the faulty line.
	 * @param {string} message - What is wrong.
	 * @param {number} lineNumber - 1-based line number.
	 */
	constructor(message, lineNumber) {
		super(`ligne ${lineNumber} : ${message}`)
		this.name = 'YamlError'
	}
}

const KEY_PATTERN = /^([A-Za-z0-9_-]+):(?:\s+(.*))?$/
const BLOCK_STYLES = ['>', '>-', '|', '|-']

/**
 * @brief Splits the source into lines with their indentation.
 * @param {string} source - YAML source.
 * @returns {{raw: string, number: number, indent: number, text: string}[]} Lines.
 * @throws {YamlError} If the indentation contains a tab.
 */
function tokenize(source) {
	return source.replace(/^\uFEFF/, '').split(/\r?\n/).map((raw, index) => {
		const indentation = raw.match(/^[ \t]*/)[0]
		if (indentation.includes('\t')) throw new YamlError('tabulation interdite dans l\'indentation', index + 1)
		return { raw, number: index + 1, indent: indentation.length, text: raw.trim() }
	})
}

/**
 * @brief Tells whether a line is empty or a comment.
 * @param {{text: string}} line - Tokenized line.
 * @returns {boolean} True if the line can be skipped.
 */
function isIgnorable(line) {
	return line.text === '' || line.text.startsWith('#')
}

/**
 * @brief Moves the cursor past the empty and comment lines.
 * @param {{lines: object[], index: number}} state - Parser state (mutated).
 */
function skipIgnorable(state) {
	while (state.index < state.lines.length && isIgnorable(state.lines[state.index])) state.index++
}

/**
 * @brief Returns the line under the cursor.
 * @param {{lines: object[], index: number}} state - Parser state.
 * @returns {object|undefined} Current line, undefined at the end.
 */
function currentLine(state) {
	return state.lines[state.index]
}

/**
 * @brief Tells whether a line is a list item ("- ...").
 * @param {{text: string}} line - Tokenized line.
 * @returns {boolean} True for a list item.
 */
function isListItem(line) {
	return line.text === '-' || line.text.startsWith('- ')
}

/**
 * @brief Removes a trailing "# comment" and trims.
 * @param {string} text - Text that may end with a comment.
 * @returns {string} Text without comment.
 */
function stripComment(text) {
	const commentIndex = text.search(/\s#/)
	return (commentIndex === -1 ? text : text.slice(0, commentIndex)).trim()
}

/**
 * @brief Parses a quoted string (single or double quotes) and its escapes.
 * @param {string} text - Text starting with a quote.
 * @param {number} lineNumber - Line number for errors.
 * @returns {string} The string content.
 * @throws {YamlError} On an unclosed quote or trailing text.
 */
function parseQuoted(text, lineNumber) {
	const quote = text[0]
	const end = text.lastIndexOf(quote)
	if (end === 0) throw new YamlError('guillemet non fermé', lineNumber)
	if (stripComment(text.slice(end + 1))) throw new YamlError('texte inattendu après une chaîne entre guillemets', lineNumber)

	const body = text.slice(1, end)
	if (quote === '\'') return body.replaceAll('\'\'', '\'')
	return body.replace(/\\(["\\n])/g, (_, char) => (char === 'n' ? '\n' : char))
}

/**
 * @brief Splits the body of an inline list on commas that are outside quotes.
 * @param {string} body - Text between "[" and "]".
 * @returns {string[]} Trimmed non-empty items.
 */
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

/**
 * @brief Parses an inline list such as `[a, b]`.
 * @param {string} text - Text starting with "[".
 * @param {number} lineNumber - Line number for errors.
 * @returns {Array} Parsed items.
 * @throws {YamlError} If the list is not closed.
 */
function parseInlineList(text, lineNumber) {
	const value = stripComment(text)
	if (!value.endsWith(']')) throw new YamlError('liste [ ] non fermée', lineNumber)
	return splitInlineList(value.slice(1, -1)).map((item) => parseScalar(item, lineNumber))
}

/**
 * @brief Parses a scalar: string, boolean, number, null or inline list.
 * @param {string} text - Value text.
 * @param {number} lineNumber - Line number for errors.
 * @returns {*} Parsed value.
 * @throws {YamlError} For unsupported inline objects.
 */
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

/**
 * @brief Folds the rows of a `>` block: rows joined by a space, empty rows become line breaks.
 * @param {string[]} rows - Block rows.
 * @returns {string} Folded text.
 */
function foldRows(rows) {
	return rows.reduce((text, row) => {
		if (row === '') return `${text}\n`
		if (text === '' || text.endsWith('\n')) return text + row
		return `${text} ${row}`
	}, '')
}

/**
 * @brief Parses a `>` / `|` block scalar.
 * @param {{lines: object[], index: number}} state - Parser state (mutated).
 * @param {number} parentIndent - Indentation of the key owning the block.
 * @param {string} style - Block indicator (">", ">-", "|" or "|-").
 * @returns {string} Block text.
 */
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

/**
 * @brief Parses a list of scalars at the given indentation.
 * @param {{lines: object[], index: number}} state - Parser state (mutated).
 * @param {number} indent - Indentation of the list.
 * @returns {Array} Parsed items.
 * @throws {YamlError} On a bad indentation or a list of objects.
 */
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

/**
 * @brief Parses the value of a key: inline scalar, block scalar, nested node or list.
 * @param {{lines: object[], index: number}} state - Parser state (mutated).
 * @param {string} rest - Text after "key:".
 * @param {number} indent - Indentation of the key.
 * @param {number} lineNumber - Line number for errors.
 * @returns {*} Parsed value.
 */
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

/**
 * @brief Parses a mapping (`key: value` lines) at the given indentation.
 * @param {{lines: object[], index: number}} state - Parser state (mutated).
 * @param {number} indent - Indentation of the mapping.
 * @returns {object} Parsed mapping.
 * @throws {YamlError} On a bad line, indentation or duplicate key.
 */
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

/**
 * @brief Parses the node under the cursor: a list or a mapping.
 * @param {{lines: object[], index: number}} state - Parser state (mutated).
 * @param {number} indent - Indentation of the node.
 * @returns {object|Array} Parsed node.
 */
function parseNode(state, indent) {
	return isListItem(currentLine(state)) ? parseList(state, indent) : parseMapping(state, indent)
}

/**
 * @brief Parses the supported YAML subset (see the header of this file).
 * @param {string} source - YAML source.
 * @returns {object|Array} Parsed document ({} if empty).
 * @throws {YamlError} On any invalid or unsupported syntax.
 */
export function parseYaml(source) {
	const state = { lines: tokenize(source), index: 0 }

	skipIgnorable(state)
	if (state.index >= state.lines.length) return {}

	const result = parseNode(state, currentLine(state).indent)
	skipIgnorable(state)
	if (state.index < state.lines.length) throw new YamlError('indentation inattendue', currentLine(state).number)
	return result
}

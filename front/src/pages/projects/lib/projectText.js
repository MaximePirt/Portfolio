// Resolution of a project's texts.
// Priority: projects.<id>.<field> key in translation.json > project text (current language, then fr, then en) > fallback.

/**
 * @brief Picks the text for a language, falling back to fr, then en.
 * @param {{fr?: string, en?: string}} text - Per-language text object.
 * @param {string} language - Current language code (e.g. 'fr' or 'en').
 * @returns {string} Best available text, or an empty string.
 */
function pickLanguage(text, language) {
	return text?.[language] || text?.fr || text?.en || ''
}

/**
 * @brief Builds a generated summary from the origin and the first two stack items.
 * Used when a project has no summary of its own.
 * @param {object} project - Normalized project.
 * @param {(key: string) => string} t - i18next translate function.
 * @returns {string} Summary such as "Personal • React / Node", joined with " • ".
 */
function buildSummary(project, t) {
	const parts = [t(`origins.${project.origin}`), project.stack.slice(0, 2).join(' / ')]
	return parts.filter(Boolean).join(' • ')
}

/**
 * @brief Resolves a project text field for the current language, with overrides and fallbacks.
 * @param {object} project - Normalized project.
 * @param {string} field - Field name: 'title', 'summary' or 'description'.
 * @param {object} deps - Destructured i18next helpers.
 * @param {Function} deps.t - i18next translate function.
 * @param {object} deps.i18n - i18next instance (uses `exists` and `resolvedLanguage`).
 * @returns {string} Text to display, or an empty string.
 */
export function getProjectText(project, field, { t, i18n }) {
	const key = `projects.${project.id}.${field}`
	if (i18n.exists(key)) return t(key)
	if (field === 'title') return project.title

	const text = pickLanguage(project[field], i18n.resolvedLanguage)
	if (text || field !== 'summary') return text
	return buildSummary(project, t)
}

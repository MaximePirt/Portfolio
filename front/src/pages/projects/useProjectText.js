import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { getProjectText } from './lib/projectText.js'

/**
 * @brief Hook returning a `getText(project, field)` function bound to the current language.
 * It resolves a project's text for `'title' | 'summary' | 'description'` through
 * `getProjectText`, and is recreated only when the i18n instance or `t` changes.
 * @returns {(project: Object, field: 'title' | 'summary' | 'description') => string} The memoized text getter.
 */
function useProjectText() {
	const { t, i18n } = useTranslation()

	return useCallback(
		(project, field) => getProjectText(project, field, { t, i18n }),
		[t, i18n]
	)
}

export default useProjectText

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

/**
 * @brief Theme saved on a previous visit, else the one of the device.
 * @returns {boolean} True for the dark theme.
 */
function readInitialDarkMode() {
	try {
		const saved = localStorage.getItem(STORAGE_KEY)
		if (saved) return saved === 'dark'
	} catch {
		// Storage blocked (private mode…): fall back to the device setting.
	}
	return window.matchMedia(DARK_QUERY).matches
}

/**
 * @brief Light/dark theme: starts from the saved choice or the device setting, applies it
 * as `data-theme` on <html> and remembers the visitor's choice.
 * @returns {[boolean, () => void]} Whether the dark theme is on, and a toggle.
 */
function useTheme() {
	const [isDarkMode, setIsDarkMode] = useState(readInitialDarkMode)

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
	}, [isDarkMode])

	/**
	 * @brief Switches theme and remembers it for the next visit.
	 */
	const toggleTheme = () => {
		setIsDarkMode((isDark) => {
			try {
				localStorage.setItem(STORAGE_KEY, isDark ? 'light' : 'dark')
			} catch {
				// Not saved: the choice still applies to this visit.
			}
			return !isDark
		})
	}

	return [isDarkMode, toggleTheme]
}

export default useTheme

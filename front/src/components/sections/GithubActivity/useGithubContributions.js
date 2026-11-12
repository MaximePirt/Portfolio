import { useEffect, useState } from 'react'

// Same source as the github-calendar lib: a proxy that returns the HTML of the
// GitHub contribution graph. We only keep the data.
const PROXY_URL = 'https://api.bloggify.net/gh-calendar/?username='

/**
 * @brief Parses a "YYYY-MM-DD" string as a local date (avoids the UTC shift of `new Date(iso)`).
 * @param {string} iso - Date as "YYYY-MM-DD".
 * @returns {Date} Local date at midnight.
 */
function parseLocalDate(iso) {
	const [year, month, day] = iso.split('-').map(Number)
	return new Date(year, month - 1, day)
}

/**
 * @brief Extracts the contribution days from the HTML of the GitHub graph.
 * @param {string} html - HTML returned by the proxy.
 * @returns {{iso: string, date: Date, level: number, count: number}[]} Days sorted by date.
 * @throws {Error} If the HTML has no contribution data.
 */
function parseContributions(html) {
	const doc = new DOMParser().parseFromString(html, 'text/html')

	const counts = new Map()
	doc.querySelectorAll('tool-tip[for]').forEach((tip) => {
		const count = parseInt(tip.textContent.trim(), 10)
		counts.set(tip.getAttribute('for'), Number.isNaN(count) ? 0 : count)
	})

	const days = [...doc.querySelectorAll('td.ContributionCalendar-day[data-date]')]
		.map((cell) => {
			const level = Number(cell.dataset.level) || 0
			return {
				iso: cell.dataset.date,
				date: parseLocalDate(cell.dataset.date),
				level,
				// If the tooltip is missing, at least keep the "active / inactive" info.
				count: counts.get(cell.id) ?? (level > 0 ? 1 : 0),
			}
		})
		.sort((a, b) => a.iso.localeCompare(b.iso))

	if (days.length === 0) throw new Error('No contribution data found')
	return days
}

/**
 * @brief Computes the total, the number of active days and the longest streak.
 * @param {{count: number}[]} days - Contribution days sorted by date.
 * @returns {{total: number, activeDays: number, longestStreak: number}} Statistics.
 */
function computeStats(days) {
	let total = 0
	let activeDays = 0
	let longestStreak = 0
	let streak = 0

	for (const day of days) {
		total += day.count
		if (day.count > 0) {
			activeDays += 1
			streak += 1
			longestStreak = Math.max(longestStreak, streak)
		} else {
			streak = 0
		}
	}

	return { total, activeDays, longestStreak }
}

/**
 * @brief Hook fetching the GitHub contribution graph of a user.
 * @param {string} username - GitHub username.
 * @returns {{status: 'loading' | 'ready' | 'error', days: object[], stats: object|null}} Fetch status, days and statistics.
 */
export function useGithubContributions(username) {
	const [state, setState] = useState({ status: 'loading', days: [], stats: null })

	useEffect(() => {
		const controller = new AbortController()

		fetch(PROXY_URL + encodeURIComponent(username), { signal: controller.signal })
			.then((response) => {
				if (!response.ok) throw new Error(`HTTP ${response.status}`)
				return response.text()
			})
			.then((html) => {
				const days = parseContributions(html)
				setState({ status: 'ready', days, stats: computeStats(days) })
			})
			.catch((error) => {
				if (error.name === 'AbortError') return
				setState({ status: 'error', days: [], stats: null })
			})

		return () => controller.abort()
	}, [username])

	return state
}

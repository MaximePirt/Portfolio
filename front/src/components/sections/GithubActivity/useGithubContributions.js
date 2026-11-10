import { useEffect, useState } from 'react'

// Même source que la lib github-calendar : un proxy qui renvoie le HTML du
// graphe de contributions GitHub. On n'en garde que les données.
const PROXY_URL = 'https://api.bloggify.net/gh-calendar/?username='

function parseLocalDate(iso) {
	const [year, month, day] = iso.split('-').map(Number)
	return new Date(year, month - 1, day)
}

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
				// Si l'infobulle manque, on garde au moins l'info "actif / inactif".
				count: counts.get(cell.id) ?? (level > 0 ? 1 : 0),
			}
		})
		.sort((a, b) => a.iso.localeCompare(b.iso))

	if (days.length === 0) throw new Error('No contribution data found')
	return days
}

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

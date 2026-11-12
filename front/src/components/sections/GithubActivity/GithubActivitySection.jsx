import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoLogoGithub, IoOpenOutline } from 'react-icons/io5'
import ActivityAside from './ActivityAside'
import useReveal from '../../ui/useReveal'
import SectionHeader from '../../ui/SectionHeader'
import { GITHUB_PROFILE_URL, GITHUB_USERNAME } from '../../../lib/links'
import { useGithubContributions } from './useGithubContributions'
import '../../../styles/github-activity.css'

const SKELETON_WEEKS = 53
const LABELLED_WEEKDAYS = [1, 3, 5]

/**
 * @brief Computes the layout of the calendar grid: first weekday, week count and month labels.
 * @param {{date: Date}[]} days - Contribution days sorted by date.
 * @param {string} locale - Locale used to format month names.
 * @returns {{firstWeekday: number, weekCount: number, months: {column: number, label: string}[]}} Grid layout.
 */
function buildCalendar(days, locale) {
	const firstWeekday = days[0].date.getDay()
	const weekCount = Math.ceil((firstWeekday + days.length) / 7)
	const monthFormat = new Intl.DateTimeFormat(locale, { month: 'short' })

	const months = []
	days.forEach((day, index) => {
		const isFirstDay = index === 0
		if (!isFirstDay && day.date.getDate() !== 1) return

		// A month is only labelled on a week that starts in that month.
		const week = Math.floor((firstWeekday + index) / 7)
		const column = isFirstDay || day.date.getDay() === 0 ? week : week + 1
		if (column >= weekCount) return
		months.push({ column, label: monthFormat.format(day.date) })
	})

	// Prevents two labels from overlapping at the start of the graph.
	const spacedMonths = months.filter(
		(month, index) => !months[index + 1] || months[index + 1].column - month.column > 2,
	)

	return { firstWeekday, weekCount, months: spacedMonths }
}

/**
 * @brief Section showing the GitHub contribution graph, its statistics and a tooltip per day,
 * next to the languages and latest projects drawn from my repositories.
 * @returns {JSX.Element} The section.
 */
function GithubActivitySection() {
	const { t, i18n } = useTranslation()
	const locale = i18n.language
	const cardRef = useRef(null)
	const scrollRef = useRef(null)
	const [tooltip, setTooltip] = useState(null)
	const [shellRef, isRevealed] = useReveal()

	const { status, days, stats } = useGithubContributions(GITHUB_USERNAME)

	const calendar = useMemo(
		() => (days.length > 0 ? buildCalendar(days, locale) : null),
		[days, locale],
	)

	const weekdayLabels = useMemo(() => {
		const format = new Intl.DateTimeFormat(locale, { weekday: 'short' })
		// January 4, 2026 is a Sunday: index 0 = Sunday, as in the grid.
		return LABELLED_WEEKDAYS.map((weekday) => ({
			row: weekday + 1,
			label: format.format(new Date(2026, 0, 4 + weekday)),
		}))
	}, [locale])

	const numberFormat = useMemo(() => new Intl.NumberFormat(locale), [locale])
	const dateFormat = useMemo(
		() => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }),
		[locale],
	)

	// On small screens the graph scrolls: show the most recent weeks first.
	useEffect(() => {
		if (status !== 'ready' || !scrollRef.current) return
		scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
	}, [status])

	/**
	 * @brief Positions and fills the tooltip for the hovered day cell, kept inside the card.
	 * @param {React.MouseEvent|React.FocusEvent} event - Event fired on a day cell.
	 */
	const showTooltip = (event) => {
		const cell = event.target.closest('[data-index]')
		if (!cell || !cardRef.current) return

		const day = days[Number(cell.dataset.index)]
		const cellRect = cell.getBoundingClientRect()
		const cardRect = cardRef.current.getBoundingClientRect()
		const x = cellRect.left + cellRect.width / 2 - cardRect.left

		setTooltip({
			// Keeps the tooltip inside the card near the edges.
			x: Math.min(Math.max(x, 90), cardRect.width - 90),
			y: cellRect.top - cardRect.top,
			count: day.count,
			date: dateFormat.format(day.date),
		})
	}

	const statItems = stats
		? [
				{ key: 'total', value: stats.total, label: t('githubActivity.statContributions') },
				{ key: 'active', value: stats.activeDays, label: t('githubActivity.statActiveDays') },
				{ key: 'streak', value: stats.longestStreak, label: t('githubActivity.statStreak') },
			]
		: []

	return (
		<section
			className="github-activity-section"
			id="activity"
		>
			<div ref={shellRef} className={`github-activity-shell ${isRevealed ? 'is-revealed' : ''}`}>
				<SectionHeader
					eyebrow={t('githubActivity.activity')}
					title={t('githubActivity.title')}
					subtitle={t('githubActivity.subtitle')}
					align="left"
				/>

				<div className="github-activity-layout">
					<div ref={cardRef} className="github-card reveal" style={{ '--reveal-index': 2 }}>
						<div className="github-card__top">
							<dl className="github-stats" aria-busy={status === 'loading'}>
								{status === 'ready'
									? statItems.map((stat) => (
											<div key={stat.key} className="github-stat">
												<dt className="github-stat__label">{stat.label}</dt>
												<dd className="github-stat__value">{numberFormat.format(stat.value)}</dd>
											</div>
										))
									: status === 'loading' && (
											<div className="github-stat github-stat--placeholder">
												<dt className="github-stat__label">{t('githubActivity.loading')}</dt>
												<dd className="github-stat__value">—</dd>
											</div>
										)}
							</dl>

							<a
								className="github-card__link"
								href={GITHUB_PROFILE_URL}
								target="_blank"
								rel="noopener noreferrer"
							>
								<IoLogoGithub aria-hidden="true" />
								<span>@{GITHUB_USERNAME}</span>
								<IoOpenOutline aria-hidden="true" />
							</a>
						</div>

						{status === 'error' ? (
							<p className="github-card__error">{t('githubActivity.error')}</p>
						) : (
							<div ref={scrollRef} className="github-heatmap-scroll">
								<div
									className="github-heatmap"
									style={{ '--weeks': calendar?.weekCount ?? SKELETON_WEEKS }}
								>
									<div className="github-heatmap__months" aria-hidden="true">
										{calendar?.months.map((month) => (
											<span key={month.column} style={{ gridColumnStart: month.column + 1 }}>
												{month.label}
											</span>
										))}
									</div>

									<div className="github-heatmap__weekdays" aria-hidden="true">
										{weekdayLabels.map((weekday) => (
											<span key={weekday.row} style={{ gridRowStart: weekday.row }}>
												{weekday.label}
											</span>
										))}
									</div>

									{calendar ? (
										<div
											className="github-heatmap__grid"
											role="img"
											aria-label={t('githubActivity.graphLabel', {
												count: stats.total,
												formattedCount: numberFormat.format(stats.total),
											})}
											onMouseOver={showTooltip}
											onMouseLeave={() => setTooltip(null)}
										>
											{days.map((day, index) => (
												<span
													key={day.iso}
													className="github-cell"
													data-level={day.level}
													data-index={index}
													style={{
														gridRowStart: index === 0 ? calendar.firstWeekday + 1 : undefined,
														'--week': Math.floor((calendar.firstWeekday + index) / 7),
													}}
												/>
											))}
										</div>
									) : (
										<div className="github-heatmap__grid github-heatmap__grid--skeleton" aria-hidden="true">
											{Array.from({ length: SKELETON_WEEKS * 7 }, (_, index) => (
												<span key={index} className="github-cell" data-level="0" />
											))}
										</div>
									)}
								</div>
							</div>
						)}

						<div className="github-card__bottom">
							<p className="github-card__note">
								<span className="github-card__note-title">{t('githubActivity.know')}</span>{' '}
								{t('githubActivity.note1')} {t('githubActivity.note2')}
							</p>

							{status !== 'error' && (
								<div className="github-legend" aria-hidden="true">
									<span>{t('githubActivity.less')}</span>
									{[0, 1, 2, 3, 4].map((level) => (
										<span key={level} className="github-cell" data-level={level} />
									))}
									<span>{t('githubActivity.more')}</span>
								</div>
							)}
						</div>

						{tooltip && (
							<div
								className="github-tooltip"
								role="presentation"
								style={{ left: tooltip.x, top: tooltip.y }}
							>
								<strong>
									{t('githubActivity.tooltipCount', {
										count: tooltip.count,
										formattedCount: numberFormat.format(tooltip.count),
									})}
								</strong>
								<span>{tooltip.date}</span>
							</div>
						)}
					</div>

					<ActivityAside />
				</div>
			</div>
		</section>
	)
}

export default GithubActivitySection

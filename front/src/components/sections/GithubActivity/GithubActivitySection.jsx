import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import GitHubCalendar from 'github-calendar'
import FloatingShape from '../../ui/FloatingBubble'
import 'github-calendar/dist/github-calendar-responsive.css'
import '../../../styles/github-activity.css'

const ACTIVITY_SHAPES = [
	{
		id: 1,
		x: 68,
		y: 16,
		size: 12,
		variant: 'bubble-grey',
		delay: 0,
		floatY: 7,
		floatRotate: 2,
		repelRadius: 160,
		repelForce: 55,
	},
	{
		id: 2,
		x: 84,
		y: 20,
		size: 18,
		variant: 'bubble-orange',
		delay: 0.15,
		floatY: 9,
		floatRotate: 3,
		repelRadius: 180,
		repelForce: 60,
	},
	{
		id: 3,
		x: 92,
		y: 34,
		size: 10,
		variant: 'bubble-green-light',
		delay: 0.3,
		floatY: 6,
		floatRotate: 2,
		repelRadius: 150,
		repelForce: 50,
	},
	{
		id: 4,
		x: 74,
		y: 42,
		size: 14,
		variant: 'bubble-grey',
		delay: 0.45,
		floatY: 8,
		floatRotate: 3,
		repelRadius: 170,
		repelForce: 58,
	},
	{
		id: 5,
		x: 92,
		y: 53,
		size: 22,
		variant: 'bubble-green-light',
		delay: 0.2,
		floatY: 10,
		floatRotate: 4,
		repelRadius: 190,
		repelForce: 65,
	},
	{
		id: 6,
		x: 66,
		y: 60,
		size: 11,
		variant: 'bubble-orange',
		delay: 0.55,
		floatY: 7,
		floatRotate: 2,
		repelRadius: 150,
		repelForce: 50,
	},
	{
		id: 7,
		x: 82,
		y: 70,
		size: 16,
		variant: 'bubble-grey',
		delay: 0.35,
		floatY: 8,
		floatRotate: 3,
		repelRadius: 175,
		repelForce: 58,
	},
]


function GithubActivitySection() {
	const { t } = useTranslation()
	const calendarRef = useRef(null)
	const sectionRef = useRef(null)
	const clusterRef = useRef(null)

	useEffect(() => {
		if (!calendarRef.current) return

		calendarRef.current.innerHTML = ''

		GitHubCalendar(calendarRef.current, 'MaximePirt', {
			responsive: true,
			tooltips: true,
			global_stats: false,
		})
	}, [])

	return (
		<section
			ref={sectionRef}
			className="github-activity-section"
			id="activity"
		>
			<div className="github-activity-shell">
				<header className="github-activity-header">
					<p className="github-activity-header__eyebrow">{t('githubActivity.activity')}</p>
					<h2 className="github-activity-header__title">{t('githubActivity.title')}</h2>
					<p className="github-activity-header__subtitle">
						{t('githubActivity.subtitle')}
					</p>
				</header>

				<div className="github-heatmap-card">
					<div ref={calendarRef} className="github-calendar-wrapper">
						{t('githubActivity.loading')}
					</div>
				</div>

				<div className="github-activity-note">
					<p className="github-activity-note__title">{t('githubActivity.know')}</p>

					<ul className="github-activity-note__list">
						<li>
							{t('githubActivity.note1')}
						</li>
						<li>
							{t('githubActivity.note2')}
						</li>
					</ul>
				</div>
			</div>

			<div
				ref={clusterRef}
				className="github-activity-bubbles"
				aria-hidden="true"
			>
				{ACTIVITY_SHAPES.map((shape) => (
					<FloatingShape
						key={shape.id}
						{...shape}
						sectionRef={sectionRef}
						clusterRef={clusterRef}
					/>
				))}
			</div>
		</section>
	)
}

export default GithubActivitySection

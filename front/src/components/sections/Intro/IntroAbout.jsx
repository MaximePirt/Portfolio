import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import clsx from 'clsx'
import useReveal from '../../ui/useReveal'
import { AVAILABILITY_KEYS, HIGHLIGHTS } from './aboutContent'

const MotionDiv = motion.div

/**
 * @brief Second beat of the intro (#presentation): portrait, a short introduction, a few projects
 * (42 and personal) as a scannable list, and what I'm available for.
 * Driven by the scroll when the story is pinned, revealed on scroll otherwise.
 * @param {Object} props
 * @param {{current: HTMLElement|null}} props.portraitRef - Ref of the portrait (the bubbles gather around it).
 * @param {{portrait: Object, bio: Object}|null} props.story - Scroll-linked styles, null when the story is off.
 * @returns {JSX.Element} The presentation.
 */
function IntroAbout({ portraitRef, story }) {
	const { t } = useTranslation()
	const [ref, isRevealed] = useReveal()
	const revealClass = !story && 'reveal'

	return (
		<div ref={ref} className={clsx('intro__about', isRevealed && 'is-revealed')}>
			<MotionDiv
				ref={portraitRef}
				className={clsx('intro-portrait', revealClass)}
				style={story?.portrait}
			>
				<img src="/character.png" alt={t('hero.portraitAlt')} className="intro-portrait__image" />
			</MotionDiv>

			<MotionDiv
				className={clsx('intro__bio', revealClass)}
				style={{ '--reveal-index': 2, ...story?.bio }}
			>
				<h2 className="intro__name">{t('profile.name')}</h2>
				<p className="intro__lead">{t('banner.subtitle')}</p>

				<p className="intro__list-title">{t('banner.title')}</p>
				<ul className="intro-highlights">
					{HIGHLIGHTS.map((item) => (
						<li key={item.id} className="intro-highlights__item">
							<p className="intro-highlights__head">
								<span className="intro-highlights__project">
									{item.project}
									<span className="intro-highlights__origin">{t(item.originKey)}</span>
								</span>
								<span className="intro-highlights__stack">{item.stack}</span>
							</p>
							<p className="intro-highlights__text">{t(item.textKey)}</p>
						</li>
					))}
				</ul>

				<div className="intro-availability">
					<span className="intro-availability__label">{t('availability.label')}</span>
					<ul className="intro-availability__list">
						{AVAILABILITY_KEYS.map((key) => (
							<li key={key} className="intro-availability__chip">{t(key)}</li>
						))}
					</ul>
				</div>
			</MotionDiv>
		</div>
	)
}

export default IntroAbout

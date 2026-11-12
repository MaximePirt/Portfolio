import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'motion/react'
import clsx from 'clsx'
import IntroAbout from './IntroAbout'
import IntroBackdrop from './IntroBackdrop'
import IntroBubbles from './IntroBubbles'
import useIntroScroll from './useIntroScroll'
import useOrbitGeometry from './useOrbitGeometry'
import useClusterPointer from '../../ui/useClusterPointer'
import useMediaQuery from '../../ui/useMediaQuery'
import { RISE_IN, SPRING_ENTRANCE, STAGGER } from '../../../lib/motion'

import '../../../styles/intro.css'

const MotionDiv = motion.div
const MotionH1 = motion.h1
const MotionP = motion.p

// The story is only pinned where there is room for the cluster next to the text, and for the
// whole presentation under the header.
const PINNED_QUERY = '(min-width: 1024px) and (min-height: 760px)'

// Eyebrow, title, subtitle then buttons, one after the other.
const COPY_STAGGER = {
	hidden: {},
	visible: { transition: { staggerChildren: STAGGER * 1.5, delayChildren: 0.1 } },
}

const ENTRANCE = { variants: RISE_IN, transition: SPRING_ENTRANCE }

/**
 * @brief The intro in one of its two modes. Pinned: the stage sticks while the title steps back,
 * the bubbles gather around the portrait and the biography arrives. Otherwise both beats are stacked.
 * @param {Object} props
 * @param {boolean} props.isPinned - True to play the scroll-driven story.
 * @returns {JSX.Element} The section.
 */
function IntroStory({ isPinned }) {
	const { t } = useTranslation()
	const sectionRef = useRef(null)
	const clusterRef = useRef(null)
	const portraitRef = useRef(null)
	const pointer = useClusterPointer(sectionRef, clusterRef)
	const scroll = useIntroScroll(sectionRef)
	const geometry = useOrbitGeometry(clusterRef, portraitRef, isPinned)
	const story = isPinned ? scroll : null

	return (
		<section ref={sectionRef} id="home" className={clsx('intro', isPinned && 'intro--pinned')}>
			<div className="intro__stage">
				<IntroBackdrop />

				<div className="intro__inner">
					<MotionDiv
						className="intro__copy"
						variants={COPY_STAGGER}
						initial="hidden"
						animate="visible"
						style={story?.copy}
					>
						<MotionP className="intro__eyebrow" {...ENTRANCE}>{t('profile.name')}</MotionP>
						<MotionH1 className="intro__title" {...ENTRANCE}>{t('hero.title')}</MotionH1>
						<MotionP className="intro__subtitle" {...ENTRANCE}>{t('hero.subtitle')}</MotionP>

						<MotionDiv className="intro__actions" {...ENTRANCE}>
							<a className="button button--primary" href="#project">{t('hero.ctaProjects')}</a>
							<a className="button button--ghost" href="#contact">{t('hero.ctaContact')}</a>
						</MotionDiv>
					</MotionDiv>

					<IntroBubbles
						ref={clusterRef}
						progress={scroll.bubbleProgress}
						geometry={geometry}
						pointer={pointer}
					/>

					<IntroAbout portraitRef={portraitRef} story={story} />
				</div>
			</div>

			{/* Target of the "Presentation" link: lands on the second beat of the story. */}
			<div id="presentation" className="intro__anchor" aria-hidden="true" />
		</section>
	)
}

/**
 * @brief Opening section (#home): hero text and bubble cluster, then the presentation.
 * Plays as a pinned scroll story on large screens, unless reduced motion is requested.
 * @returns {JSX.Element} The section.
 */
function IntroSection() {
	const isWide = useMediaQuery(PINNED_QUERY)
	const reduceMotion = useReducedMotion()
	const isPinned = isWide && !reduceMotion

	// Remounted when the mode changes: refs, measures and scroll styles start clean.
	return <IntroStory key={isPinned ? 'pinned' : 'stacked'} isPinned={isPinned} />
}

export default IntroSection

import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import Bubble from './Bubble'
import FloatingShape from './FloatingBubble'
import useClusterPointer from './useClusterPointer'
import { RISE_IN, SPRING_ENTRANCE, STAGGER } from '../../lib/motion'

import '../../styles/bubble.css'
import '../../styles/hero.css'

const MotionDiv = motion.div
const MotionH1 = motion.h1
const MotionP = motion.p

// Title then subtitle, one after the other.
const COPY_STAGGER = {
	hidden: {},
	visible: { transition: { staggerChildren: STAGGER * 2, delayChildren: 0.1 } },
}

// Share of the section scrolled (0 → 1) over which the text steps back.
const SCROLL_FADE_END = 0.7
const COPY_SCROLL_SCALE = 0.94
const CLUSTER_PARALLAX = 80

const SHAPES = [
	{
		id: 1,
		x: 84,
		y: 14,
		size: 22,
		rotate: 0,
		delay: 0,
		variant: 'bubble-orange',
		floatY: 10,
		floatRotate: 4,
		repelRadius: 180,
		repelForce: 70,
	},
	{
		id: 2,
		x: 45,
		y: 16,
		size: 20,
		rotate: 0,
		delay: 0.3,
		variant: 'bubble-grey',
		floatY: 12,
		floatRotate: 5,
		repelRadius: 180,
		repelForce: 70,
	},
	{
		id: 3,
		x: 45,
		y: 44,
		size: 20,
		rotate: 0,
		delay: 0.15,
		variant: 'bubble-green-light',
		floatY: 10,
		floatRotate: 4,
		repelRadius: 190,
		repelForce: 75,
	},
	{
		id: 4,
		x: 66,
		y: 44,
		size: 20,
		rotate: 0,
		delay: 0.45,
		variant: 'bubble-grey',
		floatY: 10,
		floatRotate: 4,
		repelRadius: 190,
		repelForce: 75,
	},
	{
		id: 5,
		x: 66,
		y: 68,
		size: 20,
		rotate: 0,
		delay: 0.25,
		variant: 'bubble-green-light',
		floatY: 10,
		floatRotate: 4,
		repelRadius: 190,
		repelForce: 75,
	},
	{
		id: 6,
		x: 87,
		y: 68,
		size: 20,
		rotate: 0,
		delay: 0.55,
		variant: 'bubble-green-dark',
		floatY: 10,
		floatRotate: 4,
		repelRadius: 190,
		repelForce: 75,
	},
]


/**
 * @brief Faded decorative bubbles shown below the large layout, in place of the animated cluster.
 * @returns {JSX.Element} The static bubbles.
 */
function MobileHeroShapes() {
	return (
		<div className="hero__shapes-mobile" aria-hidden="true">
			<Bubble
				variant="bubble-orange"
				size="clamp(120px, 32vw, 180px)"
				absolute
				x="auto"
				y="12%"
				style={{ right: '-8%', opacity: 0.22 }}
			/>

			<Bubble
				variant="bubble-green-light"
				size="clamp(90px, 24vw, 140px)"
				absolute
				x="auto"
				y="28%"
				style={{ right: '18%', opacity: 0.28 }}
			/>

			<Bubble
				variant="bubble-grey"
				size="clamp(110px, 28vw, 160px)"
				absolute
				style={{ left: '-10%', bottom: '10%', opacity: 0.16 }}
			/>
		</div>
	)
}


/**
 * @brief Scroll-linked styles: the text fades and steps back while the hero leaves the screen,
 * the cluster drifts slower than the page. None when reduced motion is requested.
 * @param {{current: HTMLElement|null}} sectionRef - Hero section.
 * @returns {{copy: Object|undefined, cluster: Object|undefined}} Motion styles.
 */
function useHeroScrollStyles(sectionRef) {
	const reduceMotion = useReducedMotion()
	const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
	const opacity = useTransform(scrollYProgress, [0, SCROLL_FADE_END], [1, 0])
	const scale = useTransform(scrollYProgress, [0, SCROLL_FADE_END], [1, COPY_SCROLL_SCALE])
	const clusterY = useTransform(scrollYProgress, [0, 1], [0, CLUSTER_PARALLAX])

	if (reduceMotion) return { copy: undefined, cluster: undefined }
	return { copy: { opacity, scale }, cluster: { y: clusterY } }
}


/**
 * @brief Hero section: presentation text entering line by line, next to the floating bubble cluster.
 * @returns {JSX.Element} The section.
 */
function HeroSection() {
	const { t } = useTranslation()
	const sectionRef = useRef(null)
	const clusterRef = useRef(null)
	const pointer = useClusterPointer(sectionRef, clusterRef)
	const scrollStyles = useHeroScrollStyles(sectionRef)

	return (
		<section ref={sectionRef} id="home" className="hero">
			<MobileHeroShapes />

			<div className="hero__inner">
				<MotionDiv
					className="hero__copy"
					variants={COPY_STAGGER}
					initial="hidden"
					animate="visible"
					style={scrollStyles.copy}
				>
					<MotionH1 className="hero__title" variants={RISE_IN} transition={SPRING_ENTRANCE}>
						{t('hero.title')}
					</MotionH1>

					<MotionP className="hero__subtitle" variants={RISE_IN} transition={SPRING_ENTRANCE}>
						{t('hero.subtitle')}
					</MotionP>
				</MotionDiv>

				<MotionDiv ref={clusterRef} className="hero__cluster" style={scrollStyles.cluster} aria-hidden="true">
					{SHAPES.map((shape) => (
						<FloatingShape key={shape.id} {...shape} pointer={pointer} isDraggable />
					))}
				</MotionDiv>
			</div>
		</section>
	)
}

export default HeroSection

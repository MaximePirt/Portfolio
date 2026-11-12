import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Bubble from './Bubble'
import FloatingShape from './FloatingBubble'

import '../../styles/bubble.css'

const CLUSTER_BASE_SIZE = 520

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
 * @brief Faded decorative bubbles shown on mobile only, in place of the animated cluster.
 * @returns {JSX.Element} The static bubbles.
 */
function MobileHeroShapes() {
	return (
		<div className="absolute inset-0 md:hidden pointer-events-none overflow-hidden">
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
 * @brief Hero section with the presentation text and the floating bubble cluster.
 * @returns {JSX.Element} The section.
 */
function HeroSection() {
	const { t } = useTranslation()
	const sectionRef = useRef(null)
	const clusterRef = useRef(null)

	return (
	<section
		ref={sectionRef}
		id="home"
		className="relative min-h-screen overflow-hidden flex items-center"
		style={{ backgroundColor: 'var(--background)' }}
	>
		<MobileHeroShapes />
		<div className="relative z-10 w-full max-w-[92vw] md:max-w-[60vw] px-6 sm:px-10 md:px-16 lg:px-40">
		<h1
			className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 leading-none "
			style={{ color: 'var(--text-primary)' }}
		>
			{t('hero.title')}
		</h1>

		<p
			className="text-base sm:text-lg md:text-xl max-w-[32rem]"
			style={{ color: 'var(--text-light)' }}
		>
			{t('hero.subtitle')}
		</p>
		</div>

	<div
	ref={clusterRef}
	className="absolute pointer-events-none hidden md:block"
	style={{
		'--cluster-size': 'clamp(320px, 42vw, 680px)',
		width: 'var(--cluster-size)',
		height: 'var(--cluster-size)',
		left: '50%',
		top: '50%',
		transform: 'translate(-50%, -50%)',
	}}
	>
		{SHAPES.map((shape) => (
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

export default HeroSection

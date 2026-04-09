import { motion, useMotionValue, useSpring } from 'motion/react'
import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'



const SHAPES = [
	{
		id: 1,
		x: 80,
		y: 2,
		size: 150,
		rotate: 0,
		delay: 0,
		bg: 'var(--accent)',
		border: '2px solid var(--primary)',
		opacity: 0.8,
		radius: '100%',
		clipPath: 'none',
		floatY: 10,
		floatRotate: 4,
		repelRadius: 180,
		repelForce: 70,
	},
	{
		id: 2,
		x: 45,
		y: 5,
		size: 150,
		rotate: 0,
		delay: 0.4,
		bg: 'var(--accent)',
		border: '1px solid var(--primary)',
		opacity: 0.5,
		radius: '100%',
		clipPath: 'none',
		floatY: 16,
		floatRotate: 7,
		repelRadius: 220,
		repelForce: 90,
	},
	{
		id: 3,
		x: 45,
		y: 22,
		size: 150,
		rotate: 0,
		delay: 0.4,
		bg: 'var(--secondary)',
		border: '1px solid var(--primary)',
		opacity: 1,
		radius: '100%',
		clipPath: 'none',
		floatY: 16,
		floatRotate: 7,
		repelRadius: 220,
		repelForce: 90,
	},
	{
		id: 4,
		x: 55,
		y: 22,
		size: 150,
		rotate: 0,
		delay: 0.4,
		bg: 'var(--secondary)',
		border: '1px solid var(--primary)',
		opacity: 1,
		radius: '100%',
		clipPath: 'none',
		floatY: 16,
		floatRotate: 7,
		repelRadius: 220,
		repelForce: 90,
	},
	{
		id: 5,
		x: 55,
		y: 39,
		size: 150,
		rotate: 0,
		delay: 0.4,
		bg: 'var(--secondary)',
		border: '1px solid var(--primary)',
		opacity: 1,
		radius: '100%',
		clipPath: 'none',
		floatY: 16,
		floatRotate: 7,
		repelRadius: 220,
		repelForce: 90,
	},
	{
		id: 5,
		x: 65,
		y: 39,
		size: 150,
		rotate: 0,
		delay: 0.4,
		bg: 'var(--secondary)',
		border: '1px solid var(--primary)',
		opacity: 1,
		radius: '100%',
		clipPath: 'none',
		floatY: 16,
		floatRotate: 7,
		repelRadius: 220,
		repelForce: 90,
	},
]

function FloatingShape({ x, y, size, rotate, delay, bg, border, opacity, radius, clipPath, floatY, floatRotate, repelRadius, repelForce, sectionRef }) {
	const rawX = useMotionValue(0)
	const rawY = useMotionValue(0)
	const springX = useSpring(rawX, { stiffness: 90, damping: 16 })
	const springY = useSpring(rawY, { stiffness: 90, damping: 16 })

	useEffect(() => {
	const section = sectionRef.current
	if (!section) return

	const handleMouseMove = (e) => {
		const rect = section.getBoundingClientRect()
		const mouseX = e.clientX - rect.left
		const mouseY = e.clientY - rect.top
		const shapeCX = (x / 100) * rect.width  + size / 2
		const shapeCY = (y / 100) * rect.height + size / 2
		const dx = mouseX - shapeCX
		const dy = mouseY - shapeCY
		const dist = Math.sqrt(dx * dx + dy * dy)

		if (dist < repelRadius && dist > 0) {
		const force = (repelRadius - dist) / repelRadius
		rawX.set(-(dx / dist) * force * repelForce)
		rawY.set(-(dy / dist) * force * repelForce)
		} else {
		rawX.set(0)
		rawY.set(0)
		}
	}

	section.addEventListener('mousemove', handleMouseMove)
	return () => section.removeEventListener('mousemove', handleMouseMove)
	}, [x, y, size, repelRadius, repelForce, sectionRef, rawX, rawY])

	return (
		<motion.div
			className="absolute hidden md:block"
			style={{ left: `${x}%`, top: `${y}%` }}
			animate={{
				y: [0, -floatY, 0],
				rotate: [rotate, rotate + floatRotate, rotate],
			}}
			transition={{
				duration: 4 + delay,
				repeat: Infinity,
				ease: 'easeInOut',
				delay,
			}}
		>
			<motion.div
			style={{
				width: size,
				height: size,
				x: springX,
				y: springY,
				backgroundColor: bg,
				border,
				opacity,
				borderRadius: radius,
				clipPath: clipPath === 'none' ? undefined : clipPath,
				backdropFilter: 'blur(2px)',
			}}
			/>
		</motion.div>
	)
}

function HeroSection() {
	const { t } = useTranslation()
	const sectionRef = useRef(null)

	return (
	<section
		ref={sectionRef}
		className="relative w-full h-screen overflow-hidden flex items-center justify-start"
		style={{ backgroundColor: 'var(--background)' }}
	>
		{SHAPES.map(shape => (
		<FloatingShape
			key={shape.id}
			x={shape.x}
			y={shape.y}
			size={shape.size}
			rotate={shape.rotate}
			delay={shape.delay}
			bg={shape.bg}
			border={shape.border}
			opacity={shape.opacity}
			radius={shape.radius}
			clipPath={shape.clipPath}
			floatY={shape.floatY}
			floatRotate={shape.floatRotate}
			repelRadius={shape.repelRadius}
			repelForce={shape.repelForce}
			sectionRef={sectionRef}
		/>
		))}

		<div className="relative z-10 text-left px-6 pl-12 md:pl-20 max-w-md md:max-w-lg">
		<h1
			className="text-6xl md:text-8xl font-bold mb-4"
			style={{ color: 'var(--primary)' }}>
			{t('hero.title')}
		</h1>
		<p
			className="text-lg md:text-xl"
			style={{ color: 'var(--text-light)' }}>
			{t('hero.subtitle')}
		</p>
		</div>
	</section>
	)
}

export default HeroSection

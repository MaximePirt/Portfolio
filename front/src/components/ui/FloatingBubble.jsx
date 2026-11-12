import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import Bubble from './Bubble'

import '../../styles/bubble.css'

const CLUSTER_BASE_SIZE = 520


/**
 * @brief Bubble that floats on its own and is repelled by the mouse with a spring motion.
 * @param {Object} props - Position/size in % of the cluster, float and repel settings, and the section/cluster refs.
 * @returns {JSX.Element} The animated bubble.
 */
function FloatingShape({
	x,
	y,
	size,
	rotate,
	delay,
	variant,
	floatY,
	floatRotate,
	repelRadius,
	repelForce,
	sectionRef,
	clusterRef,
}) {
	const rawX = useMotionValue(0)
	const rawY = useMotionValue(0)
	const springX = useSpring(rawX, { stiffness: 90, damping: 16 })
	const springY = useSpring(rawY, { stiffness: 90, damping: 16 })

	useEffect(() => {
		const section = sectionRef.current
		const cluster = clusterRef.current
		if (!section || !cluster) return

		/**
		 * @brief Computes the distance between the mouse and the bubble and pushes the bubble away when it is within the repel radius.
		 * @param {MouseEvent} e - Mouse event.
		 */
		const handleMouseMove = (e) => {
			const sectionRect = section.getBoundingClientRect()
			const clusterRect = cluster.getBoundingClientRect()

			const mouseX = e.clientX - sectionRect.left
			const mouseY = e.clientY - sectionRect.top

			const shapeCenterX =
				clusterRect.left - sectionRect.left + (x / 100) * clusterRect.width
			const shapeCenterY =
				clusterRect.top - sectionRect.top + (y / 100) * clusterRect.height

			const dx = mouseX - shapeCenterX
			const dy = mouseY - shapeCenterY
			const dist = Math.sqrt(dx * dx + dy * dy)

			const scaledRadius = (repelRadius / CLUSTER_BASE_SIZE) * clusterRect.width
			const scaledForce = (repelForce / CLUSTER_BASE_SIZE) * clusterRect.width

			if (dist < scaledRadius && dist > 0) {
				const force = (scaledRadius - dist) / scaledRadius
				rawX.set(-(dx / dist) * force * scaledForce)
				rawY.set(-(dy / dist) * force * scaledForce)
			} else {
				rawX.set(0)
				rawY.set(0)
			}
		}

		section.addEventListener('mousemove', handleMouseMove)
		return () => section.removeEventListener('mousemove', handleMouseMove)
	}, [x, y, repelRadius, repelForce, sectionRef, clusterRef, rawX, rawY])

	return (
		<div
			className="absolute"
			style={{
				left: `${x}%`,
				top: `${y}%`,
				transform: 'translate(-50%, -50%)',
			}}
		>
			<motion.div
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
				<motion.div style={{ x: springX, y: springY }}>
					<Bubble
						variant={variant}
						size={`calc(var(--cluster-size) * ${size} / 100)`}
					/>
				</motion.div>
			</motion.div>
		</div>
	)
}

export default FloatingShape
import { useState } from 'react'
import clsx from 'clsx'
import { motion, useMotionValueEvent, useReducedMotion, useSpring } from 'motion/react'
import Bubble from './Bubble'
import { getRepelOffset } from '../../lib/repel'
import { DRAG_RELEASE, POP_IN, SPRING, SPRING_MOMENTUM, SPRING_REPEL } from '../../lib/motion'

import '../../styles/bubble.css'

const MotionDiv = motion.div

// The bubbles pop in once the hero text has started to appear (seconds).
const ENTRANCE_DELAY = 0.35
const FLOAT_BASE_DURATION = 4
const DRAG_SCALE = 1.08


/**
 * @brief Target of the float layer: pops in, then bobs gently — or holds still while dragged
 * or when reduced motion is requested.
 * @param {{rotate: number, delay: number, floatY: number, floatRotate: number}} shape - Float settings.
 * @param {boolean} isResting - True to hold the bubble still.
 * @returns {Object} Motion `animate` target with its transitions.
 */
function getFloatAnimation({ rotate, delay, floatY, floatRotate }, isResting) {
	const popTransition = { ...SPRING_MOMENTUM, delay: ENTRANCE_DELAY + delay }

	if (isResting) {
		return {
			...POP_IN.visible,
			y: 0,
			rotate,
			transition: { default: SPRING, opacity: popTransition, scale: popTransition },
		}
	}

	return {
		...POP_IN.visible,
		y: [0, -floatY, 0],
		rotate: [rotate, rotate + floatRotate, rotate],
		transition: {
			default: { duration: FLOAT_BASE_DURATION + delay, repeat: Infinity, ease: 'easeInOut', delay },
			opacity: popTransition,
			scale: popTransition,
		},
	}
}


/**
 * @brief Bubble that pops in, floats on its own and yields to the pointer with a spring motion.
 * When draggable, it follows the finger 1:1 and springs back home with the release velocity.
 * @param {Object} props - Position/size in % of the cluster, float and repel settings.
 * @param {import('motion/react').MotionValue} props.pointer - Pointer tracked by `useClusterPointer`.
 * @param {boolean} [props.isDraggable] - Lets the user grab and throw the bubble.
 * @returns {JSX.Element} The animated bubble.
 */
function FloatingShape({
	x,
	y,
	size,
	rotate = 0,
	delay = 0,
	variant,
	floatY,
	floatRotate,
	repelRadius,
	repelForce,
	pointer,
	isDraggable = false,
}) {
	const reduceMotion = useReducedMotion()
	const [isDragging, setIsDragging] = useState(false)
	const repelX = useSpring(0, SPRING_REPEL)
	const repelY = useSpring(0, SPRING_REPEL)

	useMotionValueEvent(pointer, 'change', (point) => {
		const isIgnored = reduceMotion || isDragging
		const offset = getRepelOffset(isIgnored ? null : point, { x, y, repelRadius, repelForce })
		repelX.set(offset.x)
		repelY.set(offset.y)
	})

	return (
		<div
			className="absolute"
			style={{
				left: `${x}%`,
				top: `${y}%`,
				transform: 'translate(-50%, -50%)',
			}}
		>
			<MotionDiv
				initial={POP_IN.hidden}
				animate={getFloatAnimation({ rotate, delay, floatY, floatRotate }, reduceMotion || isDragging)}
			>
				<MotionDiv style={{ x: repelX, y: repelY }}>
					<MotionDiv
						className={clsx(isDraggable && 'floating-shape--draggable')}
						drag={isDraggable}
						dragSnapToOrigin
						dragTransition={DRAG_RELEASE}
						whileDrag={{ scale: DRAG_SCALE }}
						onDragStart={() => setIsDragging(true)}
						onDragEnd={() => setIsDragging(false)}
					>
						<Bubble
							variant={variant}
							size={`calc(var(--cluster-size) * ${size} / 100)`}
						/>
					</MotionDiv>
				</MotionDiv>
			</MotionDiv>
		</div>
	)
}

export default FloatingShape

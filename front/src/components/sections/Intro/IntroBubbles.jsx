import { useTransform } from 'motion/react'
import FloatingShape from '../../ui/FloatingBubble'
import { INTRO_SHAPES, ORBIT_SCALE, getOrbitOffset } from './introShapes'

/**
 * @brief One bubble of the intro: lives in the cluster, and travels to its place around the
 * portrait as the story progresses.
 * @param {Object} props
 * @param {Object} props.shape - Bubble settings (see introShapes).
 * @param {import('motion/react').MotionValue} props.progress - Travel progress, 0 (cluster) → 1 (portrait).
 * @param {Object|null} props.geometry - Measured layout (see useOrbitGeometry), null when the story is off.
 * @param {import('motion/react').MotionValue} props.pointer - Pointer tracked by `useClusterPointer`.
 * @returns {JSX.Element} The bubble.
 */
function IntroBubble({ shape, progress, geometry, pointer }) {
	const offset = getOrbitOffset(shape, geometry)
	const endScale = geometry ? ORBIT_SCALE : 1

	const travel = {
		x: useTransform(progress, (value) => value * offset.x),
		y: useTransform(progress, (value) => value * offset.y),
		scale: useTransform(progress, (value) => 1 + value * (endScale - 1)),
	}

	return <FloatingShape {...shape} pointer={pointer} travel={travel} isDraggable />
}

/**
 * @brief Cluster of draggable bubbles of the intro.
 * @param {Object} props
 * @param {{current: HTMLElement|null}} props.ref - Ref of the cluster (measured by the pointer and geometry hooks).
 * @param {import('motion/react').MotionValue} props.progress - Travel progress of the bubbles.
 * @param {Object|null} props.geometry - Measured layout, null when the story is off.
 * @param {import('motion/react').MotionValue} props.pointer - Tracked pointer.
 * @returns {JSX.Element} The cluster.
 */
function IntroBubbles({ ref, progress, geometry, pointer }) {
	return (
		<div ref={ref} className="intro__cluster" aria-hidden="true">
			{INTRO_SHAPES.map((shape) => (
				<IntroBubble
					key={shape.id}
					shape={shape}
					progress={progress}
					geometry={geometry}
					pointer={pointer}
				/>
			))}
		</div>
	)
}

export default IntroBubbles

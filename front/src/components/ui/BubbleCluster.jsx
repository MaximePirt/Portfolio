import { useRef } from 'react'
import clsx from 'clsx'
import FloatingShape from './FloatingBubble'
import useClusterPointer from './useClusterPointer'

/**
 * @brief Decorative group of floating bubbles that yield to the pointer: the visual motif of the site.
 * The parent sets the cluster position and its `--cluster-size` through `className`.
 * @param {Object} props
 * @param {{current: HTMLElement|null}} props.sectionRef - Area where the pointer is tracked.
 * @param {Object[]} props.shapes - Bubbles (see FloatingShape props), positioned in % of the cluster.
 * @param {string} props.className - Class placing and sizing the cluster.
 * @returns {JSX.Element} The cluster.
 */
function BubbleCluster({ sectionRef, shapes, className }) {
	const clusterRef = useRef(null)
	const pointer = useClusterPointer(sectionRef, clusterRef)

	return (
		<div ref={clusterRef} className={clsx('bubble-cluster', className)} aria-hidden="true">
			{shapes.map((shape) => (
				<FloatingShape key={shape.id} {...shape} pointer={pointer} />
			))}
		</div>
	)
}

export default BubbleCluster

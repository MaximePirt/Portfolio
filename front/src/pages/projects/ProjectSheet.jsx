import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { motion, useDragControls } from 'motion/react'
import { IoCloseOutline } from 'react-icons/io5'
import useDismiss from '../../components/ui/useDismiss'
import useScrollLock from '../../components/ui/useScrollLock'
import { FADE_SWAP, SPRING, projectMomentum } from '../../lib/motion'

const MotionDiv = motion.div

// Rises from the bottom edge, and leaves the same way.
const PANEL_MOTION = {
	initial: { y: '100%' },
	animate: { y: 0 },
	exit: { y: '100%' },
	transition: SPRING,
}

const SCRIM_MOTION = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
	transition: FADE_SWAP,
}

// Follows the finger 1:1 downwards (the way it closes), barely gives upwards.
const DRAG_ELASTIC = { top: 0.04, bottom: 1 }
// Downward travel (px), momentum included, past which a release closes the sheet.
const CLOSE_DISTANCE = 120

/**
 * @brief Bottom sheet showing a project on small screens. Closes with its button, Escape,
 * a tap on the scrim, or by dragging/flicking its handle downwards.
 * @param {Object} props
 * @param {string} props.label - Accessible name of the sheet (project title).
 * @param {() => void} props.onClose - Called to close the sheet.
 * @param {React.ReactNode} props.children - Sheet content.
 * @returns {React.ReactPortal} The sheet, rendered on top of the page.
 */
function ProjectSheet({ label, onClose, children }) {
	const { t } = useTranslation()
	const panelRef = useRef(null)
	const dragControls = useDragControls()

	useScrollLock(true)
	useDismiss(panelRef, true, onClose)

	// Focus moves into the sheet, and goes back to the card that opened it.
	useEffect(() => {
		const opener = document.activeElement
		panelRef.current?.focus({ preventScroll: true })
		return () => opener?.focus?.({ preventScroll: true })
	}, [])

	/**
	 * @brief Closes when the release, momentum included, would carry the sheet far enough down.
	 * @param {PointerEvent} _event - Pointer event (unused).
	 * @param {{offset: {y: number}, velocity: {y: number}}} info - Drag distance and release velocity.
	 */
	const handleDragEnd = (_event, info) => {
		const projectedTravel = info.offset.y + projectMomentum(info.velocity.y)
		if (projectedTravel > CLOSE_DISTANCE) onClose()
	}

	return createPortal(
		<div className="project-sheet">
			<MotionDiv className="project-sheet__scrim" {...SCRIM_MOTION} />

			<MotionDiv
				ref={panelRef}
				className="project-sheet__panel"
				role="dialog"
				aria-modal="true"
				aria-label={label}
				tabIndex={-1}
				drag="y"
				dragControls={dragControls}
				dragListener={false}
				dragConstraints={{ top: 0, bottom: 0 }}
				dragElastic={DRAG_ELASTIC}
				onDragEnd={handleDragEnd}
				{...PANEL_MOTION}
			>
				{/* Only the handle drags the sheet: the content below keeps its own scroll. */}
				<div className="project-sheet__handle" onPointerDown={(event) => dragControls.start(event)}>
					<span className="project-sheet__grabber" aria-hidden="true" />
				</div>

				<button
					type="button"
					className="project-sheet__close press"
					onClick={onClose}
					aria-label={t('projectsSection.closeDetail')}
				>
					<IoCloseOutline size={22} aria-hidden="true" />
				</button>

				<div className="project-sheet__content">{children}</div>
			</MotionDiv>
		</div>,
		document.body,
	)
}

export default ProjectSheet

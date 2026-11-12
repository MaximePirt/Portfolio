import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import clsx from 'clsx'
import { NAV_ITEMS } from './navItems'
import { RISE_IN, SPRING, STAGGER, projectMomentum } from '../../lib/motion'

const MotionNav = motion.nav
const MotionDiv = motion.div
const MotionA = motion.a

// The sheet drops from under the header, and goes back the same way.
const SHEET_MOTION = {
	initial: { opacity: 0, y: -16, scale: 0.97 },
	animate: { opacity: 1, y: 0, scale: 1 },
	exit: { opacity: 0, y: -16, scale: 0.97 },
	transition: SPRING,
}

const LINKS_STAGGER = {
	hidden: {},
	visible: { transition: { staggerChildren: STAGGER / 2, delayChildren: 0.04 } },
}

// Follows the finger upwards (the way it closes), resists downwards.
const DRAG_ELASTIC = { top: 0.7, bottom: 0.12 }
// Upward travel (px), momentum included, past which a release closes the sheet.
const CLOSE_DISTANCE = 60

/**
 * @brief Menu of anchor links for small screens: a sheet under the header.
 * Closes on a link, or when swiped/flicked upwards.
 * @param {Object} props
 * @param {string} props.id - Id of the sheet (target of the button's aria-controls).
 * @param {string} props.activeId - Id of the section currently on screen.
 * @param {() => void} props.onClose - Called to close the sheet.
 * @returns {JSX.Element} The sheet.
 */
function HeaderMenuSheet({ id, activeId, onClose }) {
	const { t } = useTranslation()
	const firstLinkRef = useRef(null)

	// Keyboard users land in the menu they just opened.
	useEffect(() => {
		firstLinkRef.current?.focus({ preventScroll: true })
	}, [])

	/**
	 * @brief Closes when the release, momentum included, would carry the sheet far enough upwards.
	 * @param {PointerEvent} _event - Pointer event (unused).
	 * @param {{offset: {y: number}, velocity: {y: number}}} info - Drag distance and release velocity.
	 */
	const handleDragEnd = (_event, info) => {
		const projectedTravel = info.offset.y + projectMomentum(info.velocity.y)
		if (projectedTravel < -CLOSE_DISTANCE) onClose()
	}

	return (
		<MotionNav
			id={id}
			className="header-menu"
			aria-label={t('nav.label')}
			drag="y"
			dragConstraints={{ top: 0, bottom: 0 }}
			dragElastic={DRAG_ELASTIC}
			onDragEnd={handleDragEnd}
			{...SHEET_MOTION}
		>
			<MotionDiv className="header-menu__links" variants={LINKS_STAGGER} initial="hidden" animate="visible">
				{NAV_ITEMS.map((item, index) => {
					const isActive = item.id === activeId

					return (
						<MotionA
							key={item.id}
							ref={index === 0 ? firstLinkRef : undefined}
							href={`#${item.id}`}
							className={clsx('header-menu__item', isActive && 'is-active')}
							aria-current={isActive ? 'location' : undefined}
							variants={RISE_IN}
							transition={SPRING}
							onClick={onClose}
						>
							{t(item.labelKey)}
						</MotionA>
					)
				})}
			</MotionDiv>

			<span className="header-menu__grabber" aria-hidden="true" />
		</MotionNav>
	)
}

export default HeaderMenuSheet

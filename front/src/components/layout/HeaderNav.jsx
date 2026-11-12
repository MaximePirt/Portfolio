import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import clsx from 'clsx'
import { NAV_ITEMS } from './navItems'
import { SPRING } from '../../lib/motion'

const MotionSpan = motion.span

/**
 * @brief Capsule of anchor links in the header. A highlight slides under the hovered or focused
 * item, and rests on the section currently on screen.
 * @param {Object} props
 * @param {string} props.activeId - Id of the section currently on screen.
 * @returns {JSX.Element} The navigation.
 */
function HeaderNav({ activeId }) {
	const { t } = useTranslation()
	const [pointedId, setPointedId] = useState(null)
	const highlightedId = pointedId ?? activeId

	return (
		<nav className="header-nav" aria-label={t('nav.label')} onPointerLeave={() => setPointedId(null)}>
			{NAV_ITEMS.map((item) => {
				const isActive = item.id === activeId

				return (
					<a
						key={item.id}
						href={`#${item.id}`}
						className={clsx('header-nav__item', isActive && 'is-active')}
						aria-current={isActive ? 'location' : undefined}
						onPointerEnter={() => setPointedId(item.id)}
						onFocus={() => setPointedId(item.id)}
						onBlur={() => setPointedId(null)}
					>
						{item.id === highlightedId && (
							<MotionSpan
								layoutId="header-nav-highlight"
								className="header-nav__highlight"
								transition={SPRING}
								aria-hidden="true"
							/>
						)}
						{t(item.labelKey)}
					</a>
				)
			})}
		</nav>
	)
}

export default HeaderNav

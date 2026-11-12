import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import clsx from 'clsx'
import useActiveSection from './useActiveSection'
import { SPRING } from '../../../lib/motion'

const NAV_ITEMS = [
	{ id: 'home', labelKey: 'nav.home' },
	{ id: 'presentation', labelKey: 'nav.presentation' },
	{ id: 'project', labelKey: 'nav.projects' },
	{ id: 'activity', labelKey: 'nav.activity' },
	{ id: 'contact', labelKey: 'nav.contact' },
]

const SECTION_IDS = NAV_ITEMS.map((item) => item.id)

const MotionSpan = motion.span

/**
 * @brief Anchor navigation of the page. A highlight slides under the hovered or focused item,
 * and rests on the section currently on screen.
 * @returns {JSX.Element} The navigation.
 */
function BannerNav() {
	const { t } = useTranslation()
	const activeId = useActiveSection(SECTION_IDS)
	const [pointedId, setPointedId] = useState(null)
	const highlightedId = pointedId ?? activeId

	return (
		<nav className="banner-nav" aria-label={t('nav.label')} onPointerLeave={() => setPointedId(null)}>
			{NAV_ITEMS.map((item) => {
				const isActive = item.id === activeId

				return (
					<a
						key={item.id}
						href={`#${item.id}`}
						className={clsx('banner-nav-item press', isActive && 'banner-nav-item--active')}
						aria-current={isActive ? 'location' : undefined}
						onPointerEnter={() => setPointedId(item.id)}
						onFocus={() => setPointedId(item.id)}
						onBlur={() => setPointedId(null)}
					>
						{item.id === highlightedId && (
							<MotionSpan
								layoutId="banner-nav-highlight"
								className="banner-nav-highlight"
								transition={SPRING}
								aria-hidden="true"
							/>
						)}
						<span className="banner-nav-item__label">{t(item.labelKey)}</span>
					</a>
				)
			})}
		</nav>
	)
}

export default BannerNav

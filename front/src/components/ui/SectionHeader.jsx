import clsx from 'clsx'
import '../../styles/section-header.css'

/**
 * @brief Shared header of a page section: small eyebrow, large title, muted subtitle.
 * Fades in with its section (`.reveal`, see useReveal).
 * @param {Object} props
 * @param {string} [props.eyebrow] - Short label above the title.
 * @param {string} props.title - Section title.
 * @param {string} [props.subtitle] - Sentence under the title.
 * @param {'center'|'left'} [props.align] - Text alignment.
 * @returns {JSX.Element} The header.
 */
function SectionHeader({ eyebrow, title, subtitle, align = 'center' }) {
	return (
		<header className={clsx('section-header reveal', align === 'left' && 'section-header--left')}>
			{eyebrow && <p className="section-header__eyebrow">{eyebrow}</p>}
			<h2 className="section-header__title">{title}</h2>
			{subtitle && <p className="section-header__subtitle">{subtitle}</p>}
		</header>
	)
}

export default SectionHeader

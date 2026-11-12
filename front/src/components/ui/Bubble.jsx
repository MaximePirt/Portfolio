import clsx from 'clsx'
import '../../styles/bubble.css'

/**
 * @brief Colored round shape, the base brick of the visual identity. Can be positioned absolutely.
 * @param {Object} props
 * @param {string} props.variant - Color variant class (e.g. 'bubble-orange').
 * @param {string} props.size - CSS size of the diameter.
 * @param {string} [props.className] - Extra CSS classes.
 * @param {Object} [props.style] - Extra inline styles.
 * @param {boolean} [props.absolute] - Positions the bubble absolutely.
 * @param {string|number} [props.x] - Horizontal position (absolute mode).
 * @param {string|number} [props.y] - Vertical position (absolute mode).
 * @returns {JSX.Element} The bubble.
 */
function Bubble({
	variant,
	size,
	className = '',
	style = {},
	absolute = false,
	x,
	y,
}) {
	return (
		<div
			className={clsx(
				'bubble-base',
				variant,
				absolute && 'bubble-absolute',
				className
			)}
			style={{
				width: size,
				height: size,
				...(absolute
					? {
							left: x,
							top: y,
						}
					: {}),
				...style,
			}}
		/>
	)
}

export default Bubble

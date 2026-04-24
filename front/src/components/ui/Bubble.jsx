import clsx from 'clsx'
import '../../styles/bubble.css'

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

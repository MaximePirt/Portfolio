import Bubble from '../../ui/Bubble'
import '../../../styles/bubble.css'

// Bubbles enter quicker than text blocks: a fraction of a reveal step each.
const BUBBLE_STAGGER = 0.4

const desktopBubbles = [
	{ id: 1, x: '12%', y: '40%', variant: 'bubble-green-dark', size: '150px' },
	{ id: 2, x: '24%', y: '40%', variant: 'bubble-green-light', size: '150px' },
	{ id: 3, x: '36%', y: '40%', variant: 'bubble-orange', size: '150px' },

	{ id: 4, x: '0%', y: '50%', variant: 'bubble-orange', size: '150px' },
	{ id: 5, x: '12%', y: '60%', variant: 'bubble-green-dark', size: '150px' },
	{ id: 6, x: '36%', y: '60%', variant: 'bubble-green-light', size: '150px' },
	{ id: 7, x: '48%', y: '54%', variant: 'bubble-green-light', size: '150px' },

	{ id: 8, x: '0%', y: '74%', variant: 'bubble-grey', size: '150px' },
	{ id: 9, x: '48%', y: '74%', variant: 'bubble-green-dark', size: '150px' },

	{ id: 10, x: '60%', y: '44%', variant: 'bubble-orange', size: '150px' },
	{ id: 11, x: '72%', y: '44%', variant: 'bubble-green-light', size: '150px' },
	{ id: 12, x: '84%', y: '44%', variant: 'bubble-green-light', size: '150px' },

	{ id: 13, x: '60%', y: '74%', variant: 'bubble-grey', size: '150px' },
	{ id: 14, x: '72%', y: '74%', variant: 'bubble-orange', size: '150px' },

	{ id: 15, x: '84%', y: '65%', variant: 'bubble-grey', size: '150px' },
	{ id: 16, x: '96%', y: '45%', variant: 'bubble-orange', size: '150px' },
	{ id: 17, x: '96%', y: '74%', variant: 'bubble-green-light', size: '150px' },
]

const mobileBubbles = [
	{ id: 1, x: '72%', y: '42%', variant: 'bubble-green-dark', size: '120px', opacity: 0.65 },
	{ id: 2, x: '28%', y: '56%', variant: 'bubble-orange', size: '110px', opacity: 0.72 },
	{ id: 3, x: '70%', y: '68%', variant: 'bubble-green-light', size: '110px', opacity: 0.72 },
]

/**
 * @brief Decorative bubbles of the home banner.
 * @returns {JSX.Element} The bubbles.
 */
function BannerBubbles() {
	return (
		<>
			<div className="banner-bubbles banner-bubbles--desktop" aria-hidden="true">
				{desktopBubbles.map((bubble, index) => (
					<div
						key={bubble.id}
						className="banner-bubble"
						style={{
							left: bubble.x,
							top: bubble.y,
						}}
					>
						<Bubble
							variant={bubble.variant}
							size={`clamp(82px, 8vw, ${bubble.size})`}
							className="reveal reveal--pop"
							style={{ '--reveal-index': index * BUBBLE_STAGGER }}
						/>
					</div>
				))}
			</div>

			<div className="banner-bubbles banner-bubbles--mobile" aria-hidden="true">
				{mobileBubbles.map((bubble, index) => (
					<div
						key={bubble.id}
						className="banner-bubble"
						style={{
							left: bubble.x,
							top: bubble.y,
						}}
					>
						<Bubble
							variant={bubble.variant}
							size={bubble.size}
							className="reveal reveal--pop"
							style={{ '--reveal-opacity': bubble.opacity, '--reveal-index': index }}
						/>
					</div>
				))}
			</div>
		</>
	)
}

export default BannerBubbles

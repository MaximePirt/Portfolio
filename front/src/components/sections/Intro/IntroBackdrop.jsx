import Bubble from '../../ui/Bubble'

/**
 * @brief Faded decorative bubbles shown below the large layout, in place of the animated cluster.
 * @returns {JSX.Element} The static bubbles.
 */
function IntroBackdrop() {
	return (
		<div className="intro__backdrop" aria-hidden="true">
			<Bubble
				variant="bubble-orange"
				size="clamp(120px, 32vw, 180px)"
				absolute
				x="auto"
				y="12%"
				style={{ right: '-8%', opacity: 0.22 }}
			/>

			<Bubble
				variant="bubble-green-light"
				size="clamp(90px, 24vw, 140px)"
				absolute
				x="auto"
				y="28%"
				style={{ right: '18%', opacity: 0.28 }}
			/>

			<Bubble
				variant="bubble-grey"
				size="clamp(110px, 28vw, 160px)"
				absolute
				style={{ left: '-10%', top: '62svh', opacity: 0.16 }}
			/>
		</div>
	)
}

export default IntroBackdrop

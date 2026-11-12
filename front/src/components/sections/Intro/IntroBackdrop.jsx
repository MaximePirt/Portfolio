import Bubble from '../../ui/Bubble'

/**
 * @brief Faded decorative bubbles shown below the large layout, in place of the animated cluster.
 * Placed in the margins of the first screen (corners, under the buttons) so they never sit behind text.
 * @returns {JSX.Element} The static bubbles.
 */
function IntroBackdrop() {
	return (
		<div className="intro__backdrop" aria-hidden="true">
			<Bubble
				variant="bubble-orange"
				size="clamp(110px, 30vw, 170px)"
				absolute
				x="auto"
				y="5.5rem"
				style={{ right: '-14%', opacity: 0.24 }}
			/>

			<Bubble
				variant="bubble-green-light"
				size="clamp(80px, 22vw, 130px)"
				absolute
				x="auto"
				y="calc(100svh - 5rem)"
				style={{ right: '-4%', opacity: 0.28 }}
			/>

			<Bubble
				variant="bubble-grey"
				size="clamp(110px, 28vw, 160px)"
				absolute
				style={{ left: '-12%', top: 'calc(100svh + 6rem)', opacity: 0.16 }}
			/>
		</div>
	)
}

export default IntroBackdrop

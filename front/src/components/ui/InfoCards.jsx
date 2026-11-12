/**
 * @brief Card with a title and free content, used on the infos page.
 * @param {Object} props
 * @param {string} props.title - Card title.
 * @param {React.ReactNode} props.children - Card content.
 * @param {boolean} [props.centeredTitle] - Centers the title when true.
 * @returns {JSX.Element} The card.
 */
// InfoCard.jsx
function InfoCard({ title, children, centeredTitle = false }) {
	return (
		<div className="info-card">
			<p
				className="info-card-title"
				style={{ textAlign: centeredTitle ? 'center' : 'left' }}
			>
				{title}
			</p>

			{children}
		</div>
	)
}

export default InfoCard

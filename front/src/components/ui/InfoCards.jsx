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

function BackButton({ label, onClick }) {
	return (
		<button
			onClick={onClick}
			className="
				self-start
				inline-flex items-center gap-2
				px-3 py-2
				rounded-xl
				text-sm font-medium
				transition-all duration-200
				hover:-translate-x-0.5
			"
			style={{
				backgroundColor: 'var(--bg-main)',
				color: 'var(--text)',
				border: '1px solid var(--border-thin)',
			}}
		>
			<span aria-hidden="true">←</span>
			<span>{label}</span>
		</button>
	)
}


export default BackButton
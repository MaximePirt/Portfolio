import { useMemo } from 'react'
import Bubble from '../../components/ui/Bubble'
import { getCoverBubbles } from './lib/generatedCover.js'

// Fallback visual when a project has neither an image nor a video.
function ProjectCover({ project, title }) {
	const bubbles = useMemo(() => getCoverBubbles(project.id), [project.id])

	return (
		<div className="project-preview__media project-cover" role="img" aria-label={title}>
			{bubbles.map((bubble, index) => (
				<Bubble
					key={index}
					variant={bubble.variant}
					size={`${bubble.size}cqw`}
					absolute
					x={`${bubble.x}%`}
					y={`${bubble.y}%`}
				/>
			))}

			<div className="project-cover__content">
				{project.stack[0] && (
					<span className="project-cover__eyebrow">{project.stack[0]}</span>
				)}
				<span className="project-cover__title">{title}</span>
			</div>
		</div>
	)
}

export default ProjectCover

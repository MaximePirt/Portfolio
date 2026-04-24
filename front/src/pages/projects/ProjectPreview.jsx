import { useRef, useState } from 'react'

function ProjectPreview({ project }) {
	const [isHovered, setIsHovered] = useState(false)
	const videoRef = useRef(null)

	const hasVideoPreview =
		project.previewType === 'video' &&
		(project.previewWebm || project.previewMp4)

	const handleMouseEnter = async () => {
		setIsHovered(true)

		if (hasVideoPreview && videoRef.current) {
			try {
				videoRef.current.currentTime = 0
				await videoRef.current.play()
			} catch (error) {
				if (import.meta.env.DEV) {
					console.debug('Preview video autoplay prevented:', error)
				}
			}
		}
	}

	const handleMouseLeave = () => {
		setIsHovered(false)

		if (hasVideoPreview && videoRef.current) {
			videoRef.current.pause()
			videoRef.current.currentTime = 0
		}
	}

	return (
		<div
			className="project-preview"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<img
				src={project.coverSrc}
				alt={`Aperçu de ${project.title}`}
				className={`project-preview__media project-preview__image ${
					isHovered && hasVideoPreview ? 'is-hidden' : 'is-visible'
				}`}
			/>

			{hasVideoPreview && (
				<video
					ref={videoRef}
					className={`project-preview__media project-preview__video ${
						isHovered ? 'is-visible' : 'is-hidden'
					}`}
					muted
					playsInline
					loop
					preload="metadata"
					poster={project.poster || project.coverSrc}
				>
					{project.previewWebm && (
						<source src={project.previewWebm} type="video/webm" />
					)}
					{project.previewMp4 && (
						<source src={project.previewMp4} type="video/mp4" />
					)}
				</video>
			)}
		</div>
	)
}

export default ProjectPreview

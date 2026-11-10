import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ProjectCover from './ProjectCover'

// Without a cover, the #t fragment shows the video's first frame as the preview.
const FIRST_FRAME = '#t=0.1'

function ProjectPreview({ project, title }) {
	const [isHovered, setIsHovered] = useState(false)
	const videoRef = useRef(null)
	const { t } = useTranslation()

	const { cover, webm, mp4 } = project.media
	const hasVideo = Boolean(webm || mp4)

	if (!cover && !hasVideo) {
		return (
			<div className="project-preview">
				<ProjectCover project={project} title={title} />
			</div>
		)
	}

	const isVideoVisible = hasVideo && (isHovered || !cover)
	const videoSuffix = cover ? '' : FIRST_FRAME

	const handleMouseEnter = async () => {
		setIsHovered(true)
		if (!videoRef.current) return

		try {
			videoRef.current.currentTime = 0
			await videoRef.current.play()
		} catch (error) {
			if (import.meta.env.DEV) {
				console.debug('Preview video autoplay prevented:', error)
			}
		}
	}

	const handleMouseLeave = () => {
		setIsHovered(false)
		if (!videoRef.current) return

		videoRef.current.pause()
		videoRef.current.currentTime = 0
	}

	return (
		<div
			className="project-preview"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{cover && (
				<img
					src={cover}
					alt={t('projectsSection.previewAlt', { title })}
					className={`project-preview__media project-preview__image ${
						isVideoVisible ? 'is-hidden' : 'is-visible'
					}`}
				/>
			)}

			{hasVideo && (
				<video
					ref={videoRef}
					className={`project-preview__media project-preview__video ${
						isVideoVisible ? 'is-visible' : 'is-hidden'
					}`}
					muted
					playsInline
					loop
					preload="metadata"
					poster={cover || undefined}
					aria-label={t('projectsSection.previewAlt', { title })}
				>
					{webm && <source src={`${webm}${videoSuffix}`} type="video/webm" />}
					{mp4 && <source src={`${mp4}${videoSuffix}`} type="video/mp4" />}
				</video>
			)}
		</div>
	)
}

export default ProjectPreview

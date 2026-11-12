import { useEffect, useMemo, useState } from 'react'
import { fetchRemoteProjects } from './projects.api.js'
import { MANUAL_PROJECTS } from './projects.manual.js'
import { mergeProjects } from './lib/mergeProjects.js'

/**
 * @brief Hook returning the projects to display: GitHub ones (via /api/projects) plus manual ones.
 * Until the API answers, or if it fails, only the manual projects are returned.
 * @returns {{projects: object[], status: 'loading' | 'ready' | 'error'}} Merged projects and fetch status.
 */
function useProjects() {
	const [remoteProjects, setRemoteProjects] = useState([])
	const [status, setStatus] = useState('loading')

	useEffect(() => {
		const controller = new AbortController()

		fetchRemoteProjects(controller.signal)
			.then((projects) => {
				setRemoteProjects(projects)
				setStatus('ready')
			})
			.catch((error) => {
				if (error.name === 'AbortError') return
				console.error('Projects API unavailable:', error)
				setStatus('error')
			})

		return () => controller.abort()
	}, [])

	const projects = useMemo(
		() => mergeProjects(MANUAL_PROJECTS, remoteProjects),
		[remoteProjects]
	)

	return { projects, status }
}

export default useProjects

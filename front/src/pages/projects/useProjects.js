import { useEffect, useMemo, useState } from 'react'
import { fetchRemoteProjects } from './projects.api.js'
import { MANUAL_PROJECTS } from './projects.manual.js'
import { SNAPSHOT_PROJECTS } from './projects.snapshot.js'
import { mergeProjects } from './lib/mergeProjects.js'

/**
 * @brief Hook returning the projects to display: GitHub ones (via /api/projects) plus manual ones.
 * Until the API answers, only the manual projects are returned. If it fails, the local test
 * snapshot (projects.snapshot.json, git-ignored) replaces the GitHub projects when it exists.
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
				if (SNAPSHOT_PROJECTS.length) {
					console.info(`Showing the local snapshot (${SNAPSHOT_PROJECTS.length} projects).`)
					setRemoteProjects(SNAPSHOT_PROJECTS)
				}
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

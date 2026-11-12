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
		// The request is shared by every section: only its answer is ignored after unmount.
		let isMounted = true

		fetchRemoteProjects()
			.then((projects) => {
				if (!isMounted) return
				setRemoteProjects(projects)
				setStatus('ready')
			})
			.catch((error) => {
				if (!isMounted) return
				console.error('Projects API unavailable:', error)
				if (SNAPSHOT_PROJECTS.length) {
					console.info(`Showing the local snapshot (${SNAPSHOT_PROJECTS.length} projects).`)
					setRemoteProjects(SNAPSHOT_PROJECTS)
				}
				setStatus('error')
			})

		return () => {
			isMounted = false
		}
	}, [])

	const projects = useMemo(
		() => mergeProjects(MANUAL_PROJECTS, remoteProjects),
		[remoteProjects]
	)

	return { projects, status }
}

export default useProjects

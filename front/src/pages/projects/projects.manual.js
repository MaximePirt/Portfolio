// Projects missing from the GitHub sync (private repo, freelance, unmarked project…).
// Same shape as projects.generated.json; on an equal id, the generated version wins.
// Texts: projects.<id>.* keys in translation.json.

// The entry below is only an example: ft_transcendance is the current project.
export const MANUAL_PROJECTS = [
	{
		id: 'ft_transcendance',
		repo: 'MaximePirt/Ft_Transcendance',
		title: 'Ft_Transcendance',
		origin: '42',
		domains: ['frontend', 'backend'],
		stack: ['React', 'TypeScript', 'Fastify', 'SQLite', 'Docker', 'Hashicorp Vault'],
		links: { github: 'https://github.com/MaximePirt/Ft_Transcendance' },
		media: {
			cover: '/projects/ft_transcendance/poster.webp',
			webm: '/projects/ft_transcendance/trailer.webm',
		},
	},
]

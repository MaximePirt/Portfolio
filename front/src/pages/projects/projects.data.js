export const PROJECT_FILTERS = [
	{ value: 'all', label: 'Tous' },
	{ value: '42', label: '42' },
	{ value: 'frontend', label: 'Frontend' },
	{ value: 'backend', label: 'Backend' },
	{ value: 'freelance', label: 'Freelance' },
]

export const PROJECTS = [
	{
		id: 'ft-transcendance',
		title: 'Ft_Transcendance',
		meta: '42 • Full-stack',
		categories: ['42', 'frontend', 'backend'],
		stack: ['NestJS', 'TypeScript', 'React', 'PostgreSQL', 'Docker'],
		coverSrc: '/projects/ft_transcendance/poster.webp',
		previewType: 'video',
		previewWebm: '/projects/ft_transcendance/trailer.webm',
		previewMp4: '/projects/ft_transcendance/trailer.mp4',
		poster: '/projects/ft_transcendance/poster.webp',
		github: 'https://github.com/MaximePirt/Ft_Transcendance',
		demo: '',
		description:
			'Projet web multijoueur réalisé à 42, centré sur un quiz, une interaction temps réel, la gestion utilisateur et une architecture applicative complète.',
	},
	{
		id: 'portfolio',
		title: 'Portfolio',
		meta: 'React • UI / UX',
		categories: ['frontend'],
		stack: ['React', 'Vite', 'i18next', 'CSS'],
		coverSrc: '/projects/portfolio/cover.webp',
		previewType: 'video',
		previewWebm: '/projects/portfolio/trailer.webm',
		previewMp4: '',
		poster: '/projects/portfolio/cover.webp',
		github: '',
		demo: '',
		description:
			'Portfolio personnel orienté expérience visuelle, composants réutilisables et identité plus éditoriale.',
	},
	{
		id: 'minishell',
		title: 'Minishell',
		meta: '42 • C / Unix',
		categories: ['42', 'backend'],
		stack: ['C', 'Unix', 'Parsing'],
		coverSrc: '/projects/minishell/poster.webp',
		previewType: 'video',
		previewWebm: '/projects/minishell/trailer.webm',
		previewMp4: '',
		poster: '/projects/minishell/poster.webp',
		github: '',
		demo: '',
		description:
			'Reproduction d’un shell Unix avec gestion des commandes, pipes et signaux.',
	},
]

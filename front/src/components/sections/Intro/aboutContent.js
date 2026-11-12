// What the presentation shows. Project names and stacks are proper names: not translated.
// `originKey` reuses the labels of the project filters (42 / personal).
const SCHOOL_42 = 'filters.school42'
const PERSONAL = 'filters.personal'

export const HIGHLIGHTS = [
	{ id: 'rag', project: 'RAG Discovery', originKey: PERSONAL, stack: 'TypeScript · Node.js', textKey: 'banner.highlights.rag' },
	{ id: 'transcendance', project: 'ft_transcendance', originKey: SCHOOL_42, stack: 'React · Fastify · WebSocket', textKey: 'banner.highlights.transcendance' },
	{ id: 'irc', project: 'ft_irc', originKey: SCHOOL_42, stack: 'C++ · Sockets', textKey: 'banner.highlights.irc' },
	{ id: 'minishell', project: 'minishell', originKey: SCHOOL_42, stack: 'C · Unix', textKey: 'banner.highlights.minishell' },
	{ id: 'inception', project: 'Inception', originKey: SCHOOL_42, stack: 'Docker · Nginx · MariaDB', textKey: 'banner.highlights.inception' },
	{ id: 'data', project: 'ft_linear_regression', originKey: SCHOOL_42, stack: 'Python · NumPy · pandas', textKey: 'banner.highlights.data' },
]

export const AVAILABILITY_KEYS = ['availability.internship', 'availability.fixedTerm', 'availability.permanent']

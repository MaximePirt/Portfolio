// Catalog of the programming languages recognized in a project `stack`.
// A framework or library implies its language (React → JavaScript, NumPy → Python); anything else
// (tools, concepts: Docker, pthread, TF-IDF…) is not a language and is ignored.
// To recognize a new language, spelling or framework, add it to LANGUAGES, LANGUAGE_ALIASES or FRAMEWORK_LANGUAGES.

// Language key → label shown on the chips.
const LANGUAGES = {
	c: 'C',
	'c++': 'C++',
	'c#': 'C#',
	python: 'Python',
	// TypeScript is grouped with JavaScript (see aliases).
	javascript: 'JavaScript',
	java: 'Java',
	kotlin: 'Kotlin',
	go: 'Go',
	rust: 'Rust',
	php: 'PHP',
	ruby: 'Ruby',
	swift: 'Swift',
	dart: 'Dart',
	lua: 'Lua',
	r: 'R',
	scala: 'Scala',
	haskell: 'Haskell',
	ocaml: 'OCaml',
	elixir: 'Elixir',
	assembly: 'Assembly',
	shell: 'Shell',
	sql: 'SQL',
	html: 'HTML',
	css: 'CSS',
}

// Other spellings → language key.
const LANGUAGE_ALIASES = {
	cpp: 'c++',
	cplusplus: 'c++',
	csharp: 'c#',
	py: 'python',
	jupyternotebook: 'python',
	js: 'javascript',
	ts: 'javascript',
	typescript: 'javascript',
	golang: 'go',
	asm: 'assembly',
	bash: 'shell',
	sh: 'shell',
	zsh: 'shell',
	html5: 'html',
	css3: 'css',
}

// Frameworks and libraries → language key of the language they are written with.
const FRAMEWORK_LANGUAGES = {
	react: 'javascript',
	reactnative: 'javascript',
	vue: 'javascript',
	vuejs: 'javascript',
	angular: 'javascript',
	svelte: 'javascript',
	nextjs: 'javascript',
	nuxt: 'javascript',
	node: 'javascript',
	nodejs: 'javascript',
	express: 'javascript',
	fastify: 'javascript',
	nestjs: 'javascript',
	deno: 'javascript',
	numpy: 'python',
	pandas: 'python',
	matplotlib: 'python',
	scikitlearn: 'python',
	django: 'python',
	flask: 'python',
	fastapi: 'python',
	laravel: 'php',
	symfony: 'php',
	rails: 'ruby',
	rubyonrails: 'ruby',
	spring: 'java',
	springboot: 'java',
	flutter: 'dart',
}

// Separators ignored when comparing spellings ("Type Script", "type-script"); + and # are kept (C++, C#).
const SEPARATORS = /[\s._-]+/g
// Language standards share the language: "C++98", "C++17" → C++, "C99" → C.
const STANDARD_SUFFIX = /^(c\+\+|c)\d{2}$/

/**
 * @brief Finds the language key of a stack entry.
 * @param {string} entry - Stack entry as written in the project (e.g. "C++98", "React", "pthread").
 * @returns {string|null} Language key (the language itself or the one a framework uses), or null.
 */
export function toLanguageKey(entry) {
	const spelling = entry.toLowerCase().replace(SEPARATORS, '').replace(STANDARD_SUFFIX, '$1')
	const key = LANGUAGE_ALIASES[spelling] ?? FRAMEWORK_LANGUAGES[spelling] ?? spelling
	return Object.hasOwn(LANGUAGES, key) ? key : null
}

/**
 * @brief Lists the distinct languages of a project stack.
 * @param {string[]} stack - Project stack.
 * @returns {string[]} Language keys, without duplicates.
 */
export function getStackLanguages(stack) {
	return [...new Set(stack.map(toLanguageKey).filter(Boolean))]
}

/**
 * @brief Returns the label shown for a language.
 * @param {string} key - Language key.
 * @returns {string} Label (the key itself if unknown).
 */
export function getLanguageLabel(key) {
	return LANGUAGES[key] ?? key
}

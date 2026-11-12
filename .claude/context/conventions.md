# Conventions

## Qualité du code (garde-fou n°10)
- Code propre et modulable, pensé pour être retravaillé : une responsabilité par fichier/fonction, logique pure (sans React ni Node) dans des modules `lib/`, composants d'affichage minces.
- Style de Maxime : composants `function Nom() {}` + `export default Nom`, tabulations, quotes simples, **pas de point-virgule**, pas de TS, noms explicites en anglais, commentaires courts en français uniquement quand ils expliquent un « pourquoi ».
- Constantes nommées en `UPPER_SNAKE` en tête de fichier plutôt que des nombres magiques.
- Points d'extension explicites plutôt que des `if` dispersés (ex. `getProjectActions` pour les boutons d'un projet).
- Pas de dépendance ajoutée pour ce qui tient en quelques lignes ; pas de code mort ni de conversion de formats abandonnés.

## Code
- JS/JSX uniquement (pas de TS). Composants = `function Nom() {}` + `export default Nom`.
- Indentation : tabulations. Quotes simples majoritaires.
- Hooks React : respecter `eslint-plugin-react-hooks` (deps complètes). Variables inutilisées interdites sauf `^[A-Z_]`.
- Pas de state global : état local (`useState`), refs pour le DOM.

## Styles
- Tailwind 4 (via `@tailwindcss/vite`, `@import "tailwindcss"` dans `index.css`) pour layout/espacement/responsive (`sm: md: lg:`).
- Un CSS par section dans `front/src/styles/`, importé par le composant (`import '../../styles/projects.css'`).
- Classes BEM-like : `bloc`, `bloc__element`, `bloc--modifier`, état `is-active` / `is-visible` / `is-hidden`.
- Couleurs : uniquement `var(--...)` définies dans `index.css` :
  - `--primary #3d4c46`, `--secondary #6c7a75`, `--accent #ff7818`, `--green #8f9c85`
  - `--background #dbdfd8`, `--background-offset` (color-mix), `--text`, `--text-light`
  - `--border-thick`, `--border-thin`, `--shadow-card`, `--shadow-btn`
  - `--bubble-green-dark|mid|light`, `--bubble-grey-green`, `--bubble-orange-main|dark`, `--bubble-highlight`
  - Tokens sémantiques (light + dark) à préférer dans les sections : `--text-primary` (titres/valeurs, au lieu de `--primary` en texte), `--text-muted` (labels, au lieu de `--secondary` en texte), `--surface` / `--surface-soft` / `--surface-strong` (fonds de cartes), `--surface-active` + `--on-active` (état actif), `--line` / `--line-soft` (bordures, séparateurs), `--chip-bg`, `--heat-0..4` (graphe GitHub)
  - Alias pages secondaires : `--bg-main`, `--bg-shell`, `--bg-secondary`
  - Matériau : `--glass` (fond translucide du header, dérivé de `--background`), `--glass-solid` (repli `prefers-reduced-transparency`)
  - Mouvement : `--ease-out`, `--duration-press`, `--duration-reveal`, `--reveal-step` ; typo : `--tracking-display` (hero), `--tracking-title` (titres de section)
- Dark mode : `[data-theme="dark"]` redéfinit `--background`, `--text`, `--text-light`, `--border-thin` et tous les tokens sémantiques (+ `color-scheme: dark`). Jamais de `rgba(...)`/hex clair en dur dans une section : utiliser un token, ou en ajouter un avec ses deux valeurs.
- Responsive : vérifier mobile (375px), tablette (768px) et ≥1024px ; le hero passe en deux colonnes (texte + cluster) à 1024px, en dessous il affiche `MobileHeroShapes`.

## Mouvement
- Valeurs uniquement depuis `src/lib/motion.js` (pas de ressort ni de durée inline) ; motion s'importe depuis `motion/react` et on alias les composants (`const MotionDiv = motion.div`) pour ESLint.
- Ressort sans rebond par défaut ; rebond seulement après un geste (lâcher de drag) ou pour l'apparition des bulles.
- Animer seulement `transform` / `opacity`. Pas de `getBoundingClientRect` par événement : passer par `useClusterPointer` (une mesure par frame).
- Toute animation doit avoir son équivalent réduit : `MotionConfig reducedMotion="user"` (App) couvre motion, `useReducedMotion` coupe boucles et effets liés au scroll/pointeur, et chaque classe CSS animée est neutralisée dans `@media (prefers-reduced-motion: reduce)`.
- Apparition au scroll : `const [ref, isRevealed] = useReveal()`, `is-revealed` sur le bloc, `.reveal` (+ `--reveal-index`, `--reveal-opacity`) sur les enfants. Retour au toucher : classe `.press`.

## i18n
- `front/src/i18n/locales/{fr,en}/translation.json`, mêmes clés dans les deux (vérifié par `.claude/hooks/i18n-parity.mjs`).
- Namespaces existants : `hero`, `footer`, `profile`, `banner`, `nav`, `filters`, `origins`, `projects`, `projectsSection`, `githubActivity`, `contact`, `github`.
- `projects.<id>.{title, summary, description}` surcharge les textes venant de GitHub (optionnel).
- Langue par défaut et fallback : `fr`. Pas de détection navigateur ni persistance.
- Utilisation : `const { t } = useTranslation()` puis `t('namespace.cle')`.

## Assets
- `front/public/projects/<id>/poster.webp` (cover + poster) et `trailer.webm` (préférer webm, mp4 optionnel) ; détectés automatiquement par la synchro. Sans média, une cover de bulles est générée (`ProjectCover`).

## Flags des repos GitHub
Référence complète (topics, champs de `.github/portfolio.yml`, YAML accepté) : `docs/portfolio-flags.md`. Toute évolution du schéma (`lib/projectSchema.js`, `server/buildProject.mjs`) met ce fichier à jour dans le même changement.
- Images globales : `/logo.png`, `/character.png`.

## Git
- Branche principale `main`. Messages courts en anglais, minuscules : `fix url with https`, `add analytics`, `feat: ...`.
- Les travaux Claude parallèles vivent dans `.claude/worktrees/` (ne pas modifier).

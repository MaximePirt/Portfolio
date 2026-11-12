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
  - Lisibilité : `--text-light` (#525e59) et `--text-muted` (#4a5752) sont réglés pour ≥ 4.5:1 sur `--background` et les dégradés de section (≤ 10 % de `--primary`). Ne pas foncer un fond de section sans revérifier le contraste.
  - Tokens sémantiques (light + dark) à préférer dans les sections : `--text-primary` (titres/valeurs, au lieu de `--primary` en texte), `--text-muted` (labels, au lieu de `--secondary` en texte), `--surface` / `--surface-soft` / `--surface-strong` (fonds de cartes), `--surface-active` + `--on-active` (état actif), `--line` / `--line-soft` (bordures, séparateurs), `--chip-bg`, `--heat-0..4` (graphe GitHub)
  - Alias pages secondaires : `--bg-main`, `--bg-shell`, `--bg-secondary`
  - Matériau : `--glass` (fond translucide du header, dérivé de `--background`), `--glass-solid` (repli `prefers-reduced-transparency`)
  - Mouvement : `--ease-out`, `--duration-press`, `--duration-reveal`, `--reveal-step` ; typo : `--tracking-display` (titre de l'intro), `--tracking-title` (titres de section)
  - Ombres / voile : `--shadow-lift` (survol, feuilles), `--scrim` (voile derrière une feuille modale, valeur dark plus sombre)
- Dark mode : `[data-theme="dark"]` redéfinit `--background`, `--text`, `--text-light`, `--border-thin` et tous les tokens sémantiques (+ `color-scheme: dark`). Jamais de `rgba(...)`/hex clair en dur dans une section : utiliser un token, ou en ajouter un avec ses deux valeurs.
- Responsive : vérifier 360, 375, 414 (mobile), 768 (tablette) et ≥1024px, avec `document.documentElement.scrollWidth === innerWidth` (aucun débordement). Mobile d'abord : espacements de section ~4–5rem sous 900px (les grands paddings ne valent qu'au-dessus), cibles tactiles ≥ 44px, texte ≥ 12px, colonnes de grille en `minmax(0, 1fr)` pour qu'un contenu large (graphe GitHub) défile dans sa carte au lieu d'élargir la page. Seuils : 400px (nom dans le header), 640px (libellé GitHub), 900px (projets : feuille vs détail à côté), 1024px (intro épinglée, capsule de nav).
- Boutons : `.button--primary` / `.button--ghost` (index.css) pour les actions ; `.header-button` pour les boutons ronds du header. Icônes : uniquement `react-icons/io5` (variantes Outline + logos), taille commune.
- En-têtes de section : toujours `SectionHeader` (pas de styles de titre par section).

## Mouvement
- Valeurs uniquement depuis `src/lib/motion.js` (pas de ressort ni de durée inline) ; motion s'importe depuis `motion/react` et on alias les composants (`const MotionDiv = motion.div`) pour ESLint.
- Ressort sans rebond par défaut ; rebond seulement après un geste (lâcher de drag) ou pour l'apparition des bulles.
- Animer seulement `transform` / `opacity`. Pas de `getBoundingClientRect` par événement : passer par `useClusterPointer` (une mesure par frame).
- Toute animation doit avoir son équivalent réduit : `MotionConfig reducedMotion="user"` (App) couvre motion, `useReducedMotion` coupe boucles et effets liés au scroll/pointeur, et chaque classe CSS animée est neutralisée dans `@media (prefers-reduced-motion: reduce)`.
- Apparition au scroll : `const [ref, isRevealed] = useReveal()`, `is-revealed` sur le bloc, `.reveal` (+ `--reveal-index`, `--reveal-opacity`) sur les enfants. Retour au toucher : classe `.press`.

## i18n
- `front/src/i18n/locales/{fr,en}/translation.json`, mêmes clés dans les deux (vérifié par `.claude/hooks/i18n-parity.mjs`).
- Namespaces existants : `meta` (titre d'onglet, description), `hero`, `footer`, `profile`, `banner` (bio de l'intro), `nav`, `filters`, `origins`, `projects`, `projectsSection`, `githubActivity`, `contact`.
- Ton des textes : vouvoiement envers le lecteur, phrases simples et concrètes (pas de formule « passionné de… »). Profil : étudiant à l'École 42, disponible pour un stage de 6 mois, un CDD ou un CDI (`availability.*`). Ne rien inventer d'autre (dates, campus) sans que Maxime le donne.
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

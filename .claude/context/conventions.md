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
- Dark mode : `[data-theme="dark"]` redéfinit `--background`, `--text`, `--text-light`, `--border-thin`… Toute nouvelle couleur doit avoir sa valeur dark si nécessaire.
- Responsive : vérifier mobile (375px) et iPad ; le hero a une version mobile dédiée (`MobileHeroShapes`).

## i18n
- `front/src/i18n/locales/{fr,en}/translation.json`, mêmes clés dans les deux (vérifié par `.claude/hooks/i18n-parity.mjs`).
- Namespaces existants : `hero`, `footer`, `profile`, `banner`, `nav`, `filters`, `origins`, `projects`, `projectsSection`, `githubActivity`, `contact`, `github`.
- `projects.<id>.{title, summary, description}` surcharge les textes venant de GitHub (optionnel).
- Langue par défaut et fallback : `fr`. Pas de détection navigateur ni persistance.
- Utilisation : `const { t } = useTranslation()` puis `t('namespace.cle')`.

## Assets
- `front/public/projects/<id>/poster.webp` (cover + poster) et `trailer.webm` (préférer webm, mp4 optionnel) ; détectés automatiquement par la synchro. Sans média, une cover de bulles est générée (`ProjectCover`).

## Flags des repos GitHub
Référence complète (topics, champs de `.github/portfolio.yml`, YAML accepté) : `docs/portfolio-flags.md`. Toute évolution du schéma (`lib/projectSchema.js`, `scripts/lib/buildProject.mjs`) met ce fichier à jour dans le même changement.
- Images globales : `/logo.png`, `/character.png`.

## Git
- Branche principale `main`. Messages courts en anglais, minuscules : `fix url with https`, `add analytics`, `feat: ...`.
- Les travaux Claude parallèles vivent dans `.claude/worktrees/` (ne pas modifier).

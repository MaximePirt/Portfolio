# Portfolio — Maxime Pierrot

Portfolio personnel one-page (FR/EN) : React 19 + Vite 8 + Tailwind 4 + i18next + motion. Déployé sur **Vercel** (prod) et dockerisable via **nginx + ModSecurity + certbot**.

> Ce fichier est le point d'entrée. Ne relis pas tout `front/src` : lis seulement le fichier de `.claude/context/` lié à ta tâche.

| Besoin | Fichier |
|---|---|
| Rôle de chaque fichier, flux de données, composants | `.claude/context/architecture.md` |
| Styles, couleurs, i18n, assets, commits | `.claude/context/conventions.md` |
| Vercel, Docker, nginx, certificats | `.claude/context/deploy.md` |
| Dettes / bugs connus | `.claude/context/known-issues.md` |

## Commandes (depuis la racine)
- `npm --prefix front run dev` — serveur Vite (preview : config `portfolio-front` de `.claude/launch.json`, port 5183)
- `npm --prefix front run lint` / `npm --prefix front run build`
- `node .claude/hooks/i18n-parity.mjs` — vérifie que fr/en ont les mêmes clés
- `/check` lance les trois. `docker compose up --build` pour la stack nginx.

## Carte express
- Tout le code app est dans `front/src`. `App.jsx` rend dans l'ordre : `Header` → `LanguageSwitcher` → `HeroSection` → `<Routes>` (`/` Home=Banner, `/contact`, `/infos`) → `ProjectsSection` → `GithubActivitySection` → `Contact` → `Footer` → `Analytics`.
- Navigation = ancres (`#home`, `#project`, `#activity`, `#contact`) dans `Banner.jsx`.
- Projets : données dans `front/src/pages/projects/projects.data.js`, textes dans les `translation.json`, médias dans `front/public/projects/<id>/`.
- Thème : variables CSS dans `front/src/styles/index.css`, dark mode via `data-theme` posé par `Header.jsx`.

## Conventions clés
- Tout texte visible passe par `t('cle')` et existe dans `front/src/i18n/locales/fr/translation.json` **et** `en/translation.json` (fr = langue par défaut).
- Couleurs via `var(--...)` uniquement ; un fichier CSS par section dans `front/src/styles/` (classes BEM-like, état `is-active`), Tailwind pour la mise en page.
- Indentation : tabulations. Composants en fonction + `export default`. Pas de TypeScript.
- Commits : courts, en anglais, minuscules (`fix ...`, `feat: ...`).

## Garde-fous (obligatoires)
1. Ne jamais lire, afficher ni copier `.env` (seul `.env.example` est consultable).
2. Ne jamais commit, push, merger ou créer de PR sans demande explicite. Jamais de `push --force`, `reset --hard` ni réécriture d'historique sur `main`.
3. Ne pas modifier `nginx/nginx.conf`, `nginx/Dockerfile`, `nginx/entrypoint.sh`, `docker-compose.yml` ou `front/vercel.json` sans le signaler clairement avant.
4. Aucune nouvelle dépendance npm sans accord.
5. Aucun texte en dur dans le JSX : ajouter les clés fr + en.
6. Aucune couleur en dur hors `index.css` ; réutiliser les variables existantes.
7. Ne jamais supprimer d'assets de `front/public/`.
8. Avant de déclarer une tâche finie : lint + build OK (ou dire précisément ce qui échoue), et vérifier le rendu mobile si l'UI change.
9. Ne pas toucher aux worktrees de `.claude/worktrees/`.

Des garde-fous sont aussi **bloquants** dans `.claude/settings.json` (deny/ask) et des hooks lintent chaque fichier édité.

## Règle de maintenance du contexte (obligatoire)
Après toute modification qui change la structure (fichier ajouté/supprimé/renommé), une convention, une dépendance, une commande, une variable CSS, une section ou le déploiement, **mettre à jour dans le même changement** :
- ce `CLAUDE.md` si la carte express, les commandes ou les garde-fous changent ;
- le fichier concerné de `.claude/context/` ;
- `known-issues.md` (cocher/supprimer ce qui est réglé, ajouter ce qui est découvert) ;
- tout skill (`.claude/skills/`), commande (`.claude/commands/`) ou hook dont la procédure devient fausse.
Le hook `Stop` rappelle cette règle si du code a changé sans mise à jour du contexte. La skill `/sync-context` fait la passe complète. Garder ce fichier sous ~80 lignes : le détail va dans `.claude/context/`.

## Outils Claude du projet
- Skills : `/add-project`, `/add-translation`, `/new-section`, `/sync-context`
- Commandes : `/check`, `/ship`
- Modes (output styles) : `review`, `design`, `pedagogue`

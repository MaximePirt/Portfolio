# Dettes et problèmes connus

Cocher `[x]` puis supprimer l'entrée au commit suivant quand c'est réglé. Ajouter toute découverte ici.

## i18n
- [x] Section Projets : textes en dur (titre, sous-titre, aria-labels, état vide, GitHub/Demo) et `alt` de la preview — passés en `t()`.
- [x] Libellés de nav en dur — passés en `nav.*` (`layout/navItems.js`).
- [x] Stack du contact : constante `STACK` de `lib/profile.js`.

## Styles
- [x] `index.css` : déclaration cassée `--background-img` supprimée (inutilisée). Reste : `--border-thin` défini deux fois dans `:root` (la 2e, `#000000`, l'emporte).
- [x] `--bg-secondary`, `--bg-main`, `--bg-shell` désormais définies (alias de `--background` / `--background-offset`).
- [x] Dark mode illisible (titres en `--primary`, cartes/filtres/chips/heatmap en couleurs claires en dur) : sections passées sur les tokens sémantiques (`--text-primary`, `--surface*`, `--line*`, `--heat-*`…).
- [x] Dark mode : suit `prefers-color-scheme` et mémorise le choix (`useTheme`).
- [ ] Les bulles (`bubble.css`) gardent leurs dégradés en dur, identiques dans les deux thèmes.
- [x] Light mode : `--text-light` / `--text-muted` assombris (≥ 4.5:1) et dégradés Projets/Contact éclaircis.

## Structure
- [ ] `Contact` rendu deux fois sur `/contact` (route + section fixe dans `App.jsx`).
- [x] Ancre `#presentation` : repère dans l'intro. Reste : `pages/Presentation.jsx` non utilisé (et exporte `Home`).
- [ ] `pages/Infos.jsx` et `InfoCards.jsx` quasi inutilisés.
- [x] `FloatingBubble.jsx` importe désormais `motion/react`.
- [x] `npm run lint` repasse (alias `MotionDiv = motion.div`).
- [x] `CLUSTER_BASE_SIZE` centralisé dans `lib/repel.js`.
- [ ] Réduction des animations vérifiée à la lecture du code seulement (le volet navigateur ne sait pas émuler `prefers-reduced-motion`) : à confirmer sur un appareil avec le réglage activé.

## Assets / HTML
- [x] Favicon : `/logo.png` (l'ancien `/favicon.svg` n'existait pas).
- [x] `trailer.mp4` de ft_transcendance référencé mais absent — seuls les fichiers existants sont référencés désormais.
- [x] `index.html` : `lang="fr"`, meta description et Open Graph ; `i18n/index.js` les met à jour au changement de langue.
- [ ] `og:image` pointe sur `/character.png` (portrait carré-ish) : une image 1200×630 dédiée rendrait mieux dans les aperçus LinkedIn.

## Projets / synchro GitHub
- [x] Les projets viennent de `/api/projects` (GitHub en direct, cache 1 h) : plus de fichier généré ni d'Action (la facturation GitHub bloquée n'a plus d'impact).
- [ ] `ft_transcendance` reste dans `projects.manual.js` en attendant son topic `portfolio` (vider `MANUAL_PROJECTS` ensuite).
- [ ] À faire une fois en prod : ajouter `GITHUB_TOKEN` dans Vercel et vérifier `curl -i https://maxime-pierrot.com/api/projects` (200 + JSON ; sinon le rewrite de `vercel.json` capture la route).
- [ ] La détection des médias par HEAD (`server/localMedia.mjs`) dépend du site déployé : un média ajouté au repo Portfolio n'est pris en compte qu'après son déploiement + expiration du cache.
- [ ] Le chemin d'erreur du hook `useProjects` (API en échec → projets manuels seuls) n'a été testé qu'au niveau du handler (502), pas dans le navigateur.

## Déploiement
- [ ] `nginx/entrypoint.sh` : fallback certificat auto-signé marqué TODO.
- [ ] En dev, `/api/projects` (monté par Vite) n'a pas de cache : chaque rechargement relit tous les repos et épuise vite les 60 req/h GitHub sans `GITHUB_TOKEN` (502 ensuite). Contournement : le snapshot local prend le relais.

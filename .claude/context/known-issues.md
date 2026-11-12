# Dettes et problèmes connus

Cocher `[x]` puis supprimer l'entrée au commit suivant quand c'est réglé. Ajouter toute découverte ici.

## i18n
- [x] Section Projets : textes en dur (titre, sous-titre, aria-labels, état vide, GitHub/Demo) et `alt` de la preview — passés en `t()`.
- [x] Libellés de nav en dur — passés en `nav.*` dans `BannerNav.jsx`.
- [ ] `Contact.jsx` : liste de stack en dur.

## Styles
- [x] `index.css` : déclaration cassée `--background-img` supprimée (inutilisée). Reste : `--border-thin` défini deux fois dans `:root` (la 2e, `#000000`, l'emporte).
- [x] `--bg-secondary`, `--bg-main`, `--bg-shell` désormais définies (alias de `--background` / `--background-offset`).
- [x] Dark mode illisible (titres en `--primary`, cartes/filtres/chips/heatmap en couleurs claires en dur) : sections passées sur les tokens sémantiques (`--text-primary`, `--surface*`, `--line*`, `--heat-*`…).
- [ ] Dark mode : le choix n'est pas persisté (ni `prefers-color-scheme`). Les bulles (`bubble.css`) gardent leurs dégradés en dur, identiques dans les deux thèmes.
- [ ] Light mode : `--text-light` (#989797) sur `--background` a un contraste faible (~2:1).

## Structure
- [ ] `Contact` rendu deux fois sur `/contact` (route + section fixe dans `App.jsx`).
- [x] Ancre `#presentation` : pointe maintenant sur `Banner`. Reste : `pages/Presentation.jsx` non utilisé (et exporte `Home`).
- [ ] `pages/Infos.jsx` et `InfoCards.jsx` quasi inutilisés.
- [x] `FloatingBubble.jsx` importe désormais `motion/react`.
- [x] `npm run lint` repasse (alias `MotionDiv = motion.div`).
- [x] `CLUSTER_BASE_SIZE` centralisé dans `lib/repel.js`.
- [ ] Réduction des animations vérifiée à la lecture du code seulement (le volet navigateur ne sait pas émuler `prefers-reduced-motion`) : à confirmer sur un appareil avec le réglage activé.

## Assets / HTML
- [ ] `/favicon.svg` référencé dans `index.html` mais absent de `public/`.
- [x] `trailer.mp4` de ft_transcendance référencé mais absent — seuls les fichiers existants sont référencés désormais.
- [ ] `index.html` : `lang="en"` alors que la langue par défaut est le français ; pas de meta description.

## Projets / synchro GitHub
- [x] Les projets viennent de `/api/projects` (GitHub en direct, cache 1 h) : plus de fichier généré ni d'Action (la facturation GitHub bloquée n'a plus d'impact).
- [ ] `ft_transcendance` reste dans `projects.manual.js` en attendant son topic `portfolio` (vider `MANUAL_PROJECTS` ensuite).
- [ ] À faire une fois en prod : ajouter `GITHUB_TOKEN` dans Vercel et vérifier `curl -i https://maxime-pierrot.com/api/projects` (200 + JSON ; sinon le rewrite de `vercel.json` capture la route).
- [ ] La détection des médias par HEAD (`server/localMedia.mjs`) dépend du site déployé : un média ajouté au repo Portfolio n'est pris en compte qu'après son déploiement + expiration du cache.
- [ ] Le chemin d'erreur du hook `useProjects` (API en échec → projets manuels seuls) n'a été testé qu'au niveau du handler (502), pas dans le navigateur.

## Déploiement
- [ ] `nginx/entrypoint.sh` : fallback certificat auto-signé marqué TODO.
- [ ] En dev, `/api/projects` (monté par Vite) n'a pas de cache : chaque rechargement relit tous les repos et épuise vite les 60 req/h GitHub sans `GITHUB_TOKEN` (502 ensuite). Contournement : le snapshot local prend le relais.

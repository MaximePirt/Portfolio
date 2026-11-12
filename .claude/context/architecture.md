# Architecture — front/src

Dernière mise à jour : 2026-11-12 (refonte Apple, branche `feat/main-page-apple-redesign`).

## Arbre
```
front/
├── index.html                 # lang fr, titre + meta description + Open Graph (recruteurs, aperçus de lien), favicon /logo.png
├── vite.config.js             # plugins react() + tailwindcss()
├── eslint.config.js           # flat config, react-hooks + react-refresh, no-unused-vars ignore ^[A-Z_]
├── vercel.json                # rewrite SPA /(.*) → /
├── public/
│   ├── logo.png, character.png
│   └── projects/<id>/poster.webp, trailer.webm
├── api/
│   └── projects.js            # fonction Vercel GET /api/projects (aussi montée par Vite en dev, voir vite.config.js)
├── server/                    # logique Node partagée api/ + scripts/ : github.mjs (API + raw), parseYaml.mjs, buildProject.mjs, collectProjects.mjs (+ `PORTFOLIO_OWNER`), localMedia.mjs, diskMedia.mjs (médias lus sur le disque, pour les scripts)
├── scripts/
│   ├── check-projects.mjs     # contrôle les repos marqués (✓/⚠/✗), n'écrit rien
│   └── snapshot-projects.mjs  # écrit le snapshot local de test (GitHub, ou `--from <site>` pour copier un /api/projects déployé)
└── src/
    ├── main.jsx               # importe i18n + index.css, monte <App/> en StrictMode
    ├── App.jsx                # BrowserRouter + ordre des sections (voir plus bas)
    ├── i18n/
    │   ├── index.js           # i18next, ressources fr/en, lng 'fr', fallback 'fr' ; à chaque langue : <html lang>, document.title et meta description (clés meta.*)
    │   └── locales/{fr,en}/translation.json
    ├── lib/
    │   ├── motion.js          # vocabulaire de mouvement : SPRING, SPRING_MOMENTUM, SPRING_ENTRANCE, SPRING_REPEL, DRAG_RELEASE, FADE_SWAP, STAGGER, variants RISE_IN / POP_IN, projectMomentum (projection d'un geste lâché)
    │   ├── repel.js           # getRepelOffset (pur) : poussée des bulles par le pointeur, nulle au centre pour qu'on puisse les attraper
    │   ├── links.js           # GITHUB_USERNAME, GITHUB_PROFILE_URL, LINKEDIN_URL (header, activité, contact, footer)
    │   └── profile.js         # STACK : technos de la carte contact (noms propres, non traduits)
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx     # barre collante translucide : logo + nom (≥400px), HeaderNav, boutons thème / langue (FR↔EN) / GitHub (icônes react-icons/io5), menu mobile
    │   │   ├── HeaderNav.jsx  # capsule de liens (≥1024px), pastille layoutId qui suit survol/focus puis la section courante
    │   │   ├── HeaderMenuSheet.jsx # feuille de liens sous le header (<1024px), fermeture par lien, Échap, clic extérieur ou glissement vers le haut (projectMomentum)
    │   │   ├── navItems.js    # NAV_ITEMS / SECTION_IDS : ancres de la page dans l'ordre
    │   │   ├── useActiveSection.js # IntersectionObserver : dernière section (ordre du DOM) dans la bande centrale
    │   │   ├── useIsScrolled.js # vrai dès que la page a quitté le haut (fondu sous le header, logo réduit)
    │   │   ├── useTheme.js    # thème clair/sombre : choix mémorisé (localStorage) sinon prefers-color-scheme, posé en data-theme
    │   │   └── Footer.jsx     # liens GitHub / LinkedIn / email + © année
    │   ├── sections/
    │   │   ├── Intro/IntroSection.jsx   # id="home" : ouverture. ≥1024px de large et ≥760px de haut, sans reduced motion → récit épinglé (`intro--pinned`, 240vh) ; sinon les deux temps empilés — styles/intro.css
    │   │   ├── Intro/IntroAbout.jsx     # second temps : portrait, nom, intro courte (banner.subtitle), liste « Quelques projets » 42 et personnels (HIGHLIGHTS), puces de disponibilité ; piloté par le scroll ou révélé (useReveal)
    │   │   ├── Intro/aboutContent.js    # HIGHLIGHTS (projet, origine 42/Personnel, stack, clé de texte banner.highlights.*) et AVAILABILITY_KEYS (availability.*)
    │   │   ├── Intro/IntroBubbles.jsx   # cluster de FloatingShape déplaçables qui voyagent vers l'anneau autour du portrait (prop travel)
    │   │   ├── Intro/IntroBackdrop.jsx  # bulles décoratives fixes du mode empilé
    │   │   ├── Intro/introShapes.js     # INTRO_SHAPES (place dans le cluster + angle/rayon autour du portrait, arc gauche seulement pour ne pas couvrir le texte), getOrbitOffset (pur)
    │   │   ├── Intro/useIntroScroll.js  # temps du récit (TITLE_OUT, BUBBLES_TRAVEL, PORTRAIT_IN, BIO_IN) → MotionValues, aucun rendu par frame
    │   │   ├── Intro/useOrbitGeometry.js # mesure portrait/cluster au redimensionnement seulement
    │   │   ├── GithubActivity/GithubActivitySection.jsx # id="activity", contributions GitHub, SectionHeader aligné à gauche ; graphe + ActivityAside en deux colonnes ≥1100px — styles/github-activity.css
    │   │   └── GithubActivity/ActivityAside.jsx # langages de mes projets (barres scaleX) et derniers projets avec lien vers le dépôt, via useProjects + lib/projectStats
    │   └── ui/
    │       ├── BubbleCluster.jsx    # groupe décoratif de FloatingShape (pointeur partagé), placé/dimensionné par la classe du parent ; utilisé par Contact
    │       ├── SectionHeader.jsx    # en-tête commun (surtitre, titre, sous-titre, align) — styles/section-header.css
    │       ├── Bubble.jsx           # cercle : props variant, size, absolute, x, y, className, style — styles/bubble.css
    │       ├── FloatingBubble.jsx   # export FloatingShape : apparition, flottement, poussée du pointeur (lib/repel), drag optionnel (isDraggable), décalage externe optionnel (travel). Props pointer (useClusterPointer) + --cluster-size sur le parent
    │       ├── useClusterPointer.js # un seul écouteur pointermove par section, lu une fois par frame → MotionValue {x, y, size} | null
    │       ├── useReveal.js         # [ref, isRevealed] (useInView once) ; mettre `is-revealed` sur le bloc, `.reveal` (+ --reveal-index) sur les enfants
    │       ├── useMediaQuery.js     # booléen suivant une media query (useSyncExternalStore)
    │       ├── useScrollLock.js     # bloque le scroll de la page pendant une feuille modale
    │       ├── useDismiss.js        # ferme sur Échap ou clic extérieur (menu, feuille projet, FilterPanel)
    │       ├── InfoCards.jsx        # export InfoCard (non utilisé actuellement)
    │       └── Backbutton.jsx       # export BackButton (utilisé par Infos)
    ├── pages/
    │   ├── Contact.jsx        # id="contact", fin de page centrée : SectionHeader, texte, boutons mail/LinkedIn, carte 2×2 (email, ville, STACK, disponibilité), deux BubbleCluster de part et d'autre (≥1100px) — styles/contact.css
    │   ├── Infos.jsx          # route "/infos", page quasi vide
    │   ├── Presentation.jsx   # NON importé (exporte une fonction nommée Home)
    │   └── projects/
    │       ├── projects.manual.js   # projets hors GitHub (ft_transcendance tant qu'il n'a pas le topic)
    │       ├── projects.snapshot.js # lit projects.snapshot.json (GIT-IGNORÉ, tests seulement) via import.meta.glob ; [] s'il manque
    │       ├── projects.api.js      # fetchRemoteProjects : une seule requête /api/projects par page (partagée par Projets et Activité), version du schéma vérifiée, oubliée en cas d'échec
    │       ├── useProjects.js       # hook : projets GitHub + manuels fusionnés, status loading/ready/error
    │       ├── lib/                 # pur JS partagé front/serveur : projectSchema, projectFilters (catégories + langages), languages (catalogue des langages), projectText, projectActions, generatedCover, mergeProjects, projectStats (getTopLanguages, getLatestProjects)
    │       ├── useProjectText.js    # hook getText(project, 'title'|'summary'|'description')
    │       ├── ProjectsSection.jsx  # id="project", SectionHeader, filtres + liste + détail (à côté ≥900px, dans ProjectSheet en dessous) — styles/projects.css
    │       ├── ProjectSheet.jsx     # feuille du bas (portal) : voile, poignée à tirer (projectMomentum), Échap, focus rendu à la carte, scroll bloqué
    │       ├── ProjectFilters.jsx   # pastilles d'origine (42, Personnel, Freelance si non vide) avec compteur ; une seule à la fois, second clic = tous les projets ; pastille active qui glisse (layoutId)
    │       ├── FilterPanel.jsx      # bouton « Filtre » devant les pastilles d'origine + panneau animé de groupes de chips (Catégories, Langages), multi-sélection ; « Réinitialiser » vide tous les filtres, pastille d'origine comprise
    │       ├── ProjectStatusBadge.jsx # badge « En cours »
    │       ├── ProjectCover.jsx     # cover de bulles générée quand il n'y a ni image ni vidéo
    │       ├── ProjectsList.jsx     # cartes de projets, pastille active qui glisse (layoutId) ; rangée défilante à aimantation sous 900px
    │       ├── ProjectDetail.jsx    # header, liens GitHub/Demo, preview, stack (chips), description ; entrée/sortie en fondu (AnimatePresence mode="wait")
    │       └── ProjectPreview.jsx   # image coverSrc, vidéo webm/mp4 jouée au survol
    └── styles/
        ├── index.css          # @import tailwindcss, variables :root + [data-theme="dark"], header (capsule, menu, boutons), .button, .press, .reveal, footer
        ├── bubble.css, contact.css, github-activity.css, intro.css, projects.css, section-header.css
```

## Ordre de rendu (`App.jsx`)
`Header` → `IntroSection` → `<Routes>` (`/` vide, `/contact` Contact, `/infos` Infos) → `ProjectsSection` → `GithubActivitySection` → `Contact` → `Footer` → `<Analytics/>` (@vercel/analytics).
Seul le bloc `<Routes>` dépend de l'URL ; le reste est toujours rendu.

## Ancres de navigation
`#home` (IntroSection), `#presentation` (repère `.intro__anchor`, seconde moitié de l'intro = portrait + bio), `#project` (ProjectsSection), `#activity` (GithubActivity), `#contact` (Contact). `html { scroll-padding-top }` évite que le header collant masque la cible.

## Mouvement
- `App.jsx` enveloppe tout dans `<MotionConfig reducedMotion="user">` : avec « réduire les animations », motion garde les fondus et supprime les déplacements. Les boucles (flottement) et la poussée du pointeur sont coupées via `useReducedMotion`, et l'intro n'est plus épinglée (deux temps empilés).
- Valeurs : uniquement `lib/motion.js` (ressorts sans rebond par défaut, rebond seulement après un geste ou pour l'apparition des bulles).
- CSS : `.press` (réaction à l'appui), `.reveal` / `.reveal--pop` + `is-revealed` (apparition au scroll), tous neutralisés dans `@media (prefers-reduced-motion: reduce)` d'`index.css`.
- Seuls `transform` et `opacity` sont animés.
- Gestes : bulles de l'intro déplaçables (retour avec la vitesse du lâcher), menu mobile à glisser vers le haut, feuille projet à tirer vers le bas ; la fermeture tient compte de l'élan (`projectMomentum`), pas seulement de la distance.
- Les MotionValues liées au scroll passent par une fonction (`during` dans `useIntroScroll`) : avec un intervalle direct, motion délègue l'opacité à une timeline native qui suit toute la page au lieu de la section.

## Données projets
- Source : repos publics GitHub `MaximePirt` avec le topic `portfolio` (et/ou `.github/portfolio.yml`). `front/api/projects.js` (fonction Vercel) les lit via `server/collectProjects.mjs` et renvoie `{ version, projects }` avec `Cache-Control: public, max-age=300, s-maxage=3600, stale-while-revalidate=86400` : le site suit GitHub sans commit ni déploiement (≈ 1 h de délai). Erreur GitHub → 502 non mis en cache ; le front garde alors les projets manuels. Règles : `docs/portfolio-flags.md`.
- Variables d'environnement (toutes optionnelles) : `GITHUB_TOKEN` (quota API : 60 req/h sans), `PORTFOLIO_GITHUB_OWNER` (défaut `MaximePirt`), `PORTFOLIO_SITE_URL` (défaut : hôte de la requête, utilisé pour détecter les médias de `public/projects/<id>/` par requêtes HEAD, car la fonction ne lit pas `public/`).
- En dev, `vite.config.js` monte le même handler sur `/api/projects` (plugin `projects-api`).
- Forme canonique (`lib/projectSchema.js`, `normalizeProject`) : `{ id, repo, title, summary{fr,en}, description{fr,en}, status, origin, domains[], stack[], links{github,demo}, media{cover,webm,mp4}, featured, order, createdAt, run }`. `run` est réservé au futur lancement des projets (non lu par l'UI). `SCHEMA_VERSION` à incrémenter si la forme change (le front rejette une autre version).
- Fusion (`useProjects` → `lib/mergeProjects.js`) : `MANUAL_PROJECTS` puis projets GitHub (GitHub gagne à id égal), tri `compareProjects` (featured → order → date de création).
- Snapshot de test : si `/api/projects` échoue ou n'existe pas (`vite preview`, Docker, quota GitHub, hors ligne), `useProjects` remplace les projets GitHub par `projects.snapshot.json` quand il existe. Fichier jamais commité (`.gitignore`) : Vercel build sans lui, la prod reste en direct.
- Filtres (`lib/projectFilters.js`) : origine (`ORIGIN_FILTERS` : `42 | personal | freelance`, pastilles visibles, une seule ou aucune) ET domaines (`DOMAIN_FILTERS` : `frontend | backend | systems | devops | data`, dans le panneau, multi-sélection en OU) ET langages. Les compteurs suivent : domaines comptés sur l'origine, langages sur origine + domaines. Libellés `filters.*`, origines `origins.*`, titres du panneau `projectsSection.languageFilter.{domainsTitle,title}`.
- Filtre langages (groupe « Langages » de `FilterPanel` + `getAvailableLanguages`/`matchesLanguages`) : chips = langages reconnus dans `stack` par le catalogue `lib/languages.js` (`toLanguageKey` : casse/séparateurs ignorés, alias, standards « C++98 » → C++, TypeScript regroupé sous **JavaScript**, frameworks → leur langage : React/Node.js/Fastify → JavaScript, NumPy/pandas → Python…). Outils et concepts (Docker, Makefile, pthread, TF-IDF…) ignorés ; un projet sans langage reconnu va dans la chip « Autres » (`OTHER_LANGUAGE`, toujours en dernier) pour rester accessible. Multi-sélection en **OU**, combinée (ET) avec l'origine et les catégories. Libellés `projectsSection.languageFilter.*`. Nouveau langage/framework → `LANGUAGES`, `LANGUAGE_ALIASES` ou `FRAMEWORK_LANGUAGES`.
- Textes (`lib/projectText.js`) : clé `projects.<id>.<field>` si elle existe, sinon texte du projet (langue courante → fr → en) ; `summary` vide → « origine • 2 technos ».
- Liste : « Chargement des projets… » tant que l'API n'a pas répondu ; 6 projets puis « Voir plus » (+6) ; desktop : hauteur calée sur le détail avec défilement interne ; mobile : filtres et cartes sur des lignes défilantes, le détail s'ouvre dans `ProjectSheet`.
- Preview : image + vidéo au survol ; vidéo seule → première frame ; rien → `ProjectCover`.
- Actions du détail (`lib/projectActions.js`) : GitHub, Démo — point d'extension pour un futur « Lancer ».

## Bulles
- Variants CSS : `bubble-orange`, `bubble-grey`, `bubble-green-light`, `bubble-green-dark` (bubble.css, couleurs `--bubble-*` d'index.css).
- `FloatingShape` : `x`,`y` en % du cluster, `size` en % de `--cluster-size`, `delay`, `floatY`, `floatRotate`, `repelRadius`, `repelForce` (réglés sur `CLUSTER_BASE_SIZE` = 520 dans `lib/repel.js`), `pointer`, `isDraggable`, `travel` ({x, y, scale} MotionValues : déplacement externe, ex. le récit de l'intro).

## Dépendances runtime
react 19, react-dom, react-router-dom 7, i18next + react-i18next, motion (import `motion/react`), clsx, react-icons, @vercel/analytics.

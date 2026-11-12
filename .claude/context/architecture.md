# Architecture — front/src

Dernière mise à jour : 2026-11-10 (commit de base `ca099cc`).

## Arbre
```
front/
├── index.html                 # <div id="root">, titre "maxime-pierrot"
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
    │   ├── index.js           # i18next, ressources fr/en, lng 'fr', fallback 'fr'
    │   └── locales/{fr,en}/translation.json
    ├── lib/
    │   ├── motion.js          # vocabulaire de mouvement partagé : SPRING, SPRING_MOMENTUM, SPRING_ENTRANCE, SPRING_REPEL, DRAG_RELEASE, STAGGER, variants RISE_IN / POP_IN
    │   └── repel.js           # getRepelOffset (pur) : poussée des bulles par le pointeur, nulle au centre pour qu'on puisse les attraper
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx     # barre collante translucide : logo + nom, toggle dark mode (data-theme sur <html>), lien GitHub
    │   │   ├── useHideOnScroll.js # cache la barre en descendant, la réaffiche en remontant (is-hidden / is-scrolled)
    │   │   └── Footer.jsx     # © année + profile.name + footer.rights
    │   ├── sections/
    │   │   ├── Banner/Banner.jsx        # id="presentation" : BannerNav, titre, BannerCard, portrait, BannerBubbles, apparition au scroll — styles/banner.css
    │   │   ├── Banner/BannerNav.jsx     # nav par ancres (libellés nav.*), pastille motion layoutId qui suit survol/focus puis la section courante
    │   │   ├── Banner/useActiveSection.js # IntersectionObserver : id de la section au milieu de l'écran
    │   │   ├── Banner/BannerCard.jsx    # texte banner.subtitle
    │   │   ├── Banner/BannerBubble.jsx  # bulles desktop/mobile positionnées en %, apparition en cascade (.reveal--pop)
    │   │   └── GithubActivity/GithubActivitySection.jsx # id="activity", contributions GitHub (user MaximePirt), bulles FloatingShape (non déplaçables) — styles/github-activity.css
    │   └── ui/
    │       ├── HeroSection.jsx      # id="home" : texte (entrée en cascade, recul au scroll) + cluster de FloatingShape déplaçables (≥1024px), MobileHeroShapes en dessous — styles/hero.css
    │       ├── Bubble.jsx           # cercle : props variant, size, absolute, x, y, className, style — styles/bubble.css
    │       ├── FloatingBubble.jsx   # export FloatingShape : apparition, flottement, poussée du pointeur (lib/repel), drag optionnel (isDraggable) qui revient à sa place avec la vitesse du lâcher. Props pointer (useClusterPointer) + --cluster-size sur le parent
    │       ├── useClusterPointer.js # un seul écouteur pointermove par section, lu une fois par frame → MotionValue {x, y, size} | null
    │       ├── useReveal.js         # [ref, isRevealed] (useInView once) ; mettre `is-revealed` sur le bloc, `.reveal` (+ --reveal-index) sur les enfants
    │       ├── useDismiss.js        # ferme sur Échap ou clic extérieur (LanguageSwitcher, LanguageFilter)
    │       ├── LanguageSwitcher.jsx # bouton fixe bas-gauche, menu FR/EN qui sort du bouton (AnimatePresence), Échap pour fermer
    │       ├── InfoCards.jsx        # export InfoCard (non utilisé actuellement)
    │       └── Backbutton.jsx       # export BackButton (utilisé par Infos)
    ├── pages/
    │   ├── Home.jsx           # route "/" → <Banner/>
    │   ├── Contact.jsx        # id="contact", ContactSection : mail/LinkedIn/stack (stack EN DUR) — styles/contact.css
    │   ├── Infos.jsx          # route "/infos", page quasi vide
    │   ├── Presentation.jsx   # NON importé (exporte une fonction nommée Home)
    │   └── projects/
    │       ├── projects.manual.js   # projets hors GitHub (ft_transcendance tant qu'il n'a pas le topic)
    │       ├── projects.snapshot.js # lit projects.snapshot.json (GIT-IGNORÉ, tests seulement) via import.meta.glob ; [] s'il manque
    │       ├── projects.api.js      # fetchRemoteProjects : appelle /api/projects et vérifie la version du schéma
    │       ├── useProjects.js       # hook : projets GitHub + manuels fusionnés, status loading/ready/error
    │       ├── lib/                 # pur JS partagé front/serveur : projectSchema, projectFilters (catégories + langages), languages (catalogue des langages), projectText, projectActions, generatedCover, mergeProjects
    │       ├── useProjectText.js    # hook getText(project, 'title'|'summary'|'description')
    │       ├── ProjectsSection.jsx  # id="project", filtres + liste + détail — styles/projects.css
    │       ├── ProjectFilters.jsx   # pills de filtre avec compteur (seulement les filtres non vides), pastille active qui glisse (layoutId)
    │       ├── LanguageFilter.jsx   # bouton « Filtre » devant les pills + bandeau animé (`motion/react`) de chips langages (multi-sélection)
    │       ├── ProjectStatusBadge.jsx # badge « En cours »
    │       ├── ProjectCover.jsx     # cover de bulles générée quand il n'y a ni image ni vidéo
    │       ├── ProjectsList.jsx     # pills (titleKey/metaKey), état vide en dur
    │       ├── ProjectDetail.jsx    # header, liens GitHub/Demo, preview, stack (chips), description ; remonté (key) et fondu à chaque sélection
    │       └── ProjectPreview.jsx   # image coverSrc, vidéo webm/mp4 jouée au survol
    └── styles/
        ├── index.css          # @import tailwindcss, variables :root + [data-theme="dark"], header/lang-btn/footer/info-card
        ├── banner.css, bubble.css, contact.css, github-activity.css, hero.css, projects.css
```

## Ordre de rendu (`App.jsx`)
`Header` → `LanguageSwitcher` → `HeroSection` → `<Routes>` (`/` Home, `/contact` Contact, `/infos` Infos) → `ProjectsSection` → `GithubActivitySection` → `Contact` → `Footer` → `<Analytics/>` (@vercel/analytics).
Seul le bloc `<Routes>` dépend de l'URL ; le reste est toujours rendu.

## Ancres de navigation
`#home` (HeroSection), `#presentation` (Banner, route `/` seulement), `#project` (ProjectsSection), `#activity` (GithubActivity), `#contact` (Contact). `html { scroll-padding-top }` évite que le header collant masque la cible.

## Mouvement
- `App.jsx` enveloppe tout dans `<MotionConfig reducedMotion="user">` : avec « réduire les animations », motion garde les fondus et supprime les déplacements. Les boucles (flottement) et la poussée du pointeur sont coupées via `useReducedMotion`, le recul du hero au scroll aussi.
- Valeurs : uniquement `lib/motion.js` (ressorts sans rebond par défaut, rebond seulement après un geste ou pour l'apparition des bulles).
- CSS : `.press` (réaction à l'appui), `.reveal` / `.reveal--pop` + `is-revealed` (apparition au scroll), tous neutralisés dans `@media (prefers-reduced-motion: reduce)` d'`index.css`.
- Seuls `transform` et `opacity` sont animés.

## Données projets
- Source : repos publics GitHub `MaximePirt` avec le topic `portfolio` (et/ou `.github/portfolio.yml`). `front/api/projects.js` (fonction Vercel) les lit via `server/collectProjects.mjs` et renvoie `{ version, projects }` avec `Cache-Control: public, max-age=300, s-maxage=3600, stale-while-revalidate=86400` : le site suit GitHub sans commit ni déploiement (≈ 1 h de délai). Erreur GitHub → 502 non mis en cache ; le front garde alors les projets manuels. Règles : `docs/portfolio-flags.md`.
- Variables d'environnement (toutes optionnelles) : `GITHUB_TOKEN` (quota API : 60 req/h sans), `PORTFOLIO_GITHUB_OWNER` (défaut `MaximePirt`), `PORTFOLIO_SITE_URL` (défaut : hôte de la requête, utilisé pour détecter les médias de `public/projects/<id>/` par requêtes HEAD, car la fonction ne lit pas `public/`).
- En dev, `vite.config.js` monte le même handler sur `/api/projects` (plugin `projects-api`).
- Forme canonique (`lib/projectSchema.js`, `normalizeProject`) : `{ id, repo, title, summary{fr,en}, description{fr,en}, status, origin, domains[], stack[], links{github,demo}, media{cover,webm,mp4}, featured, order, createdAt, run }`. `run` est réservé au futur lancement des projets (non lu par l'UI). `SCHEMA_VERSION` à incrémenter si la forme change (le front rejette une autre version).
- Fusion (`useProjects` → `lib/mergeProjects.js`) : `MANUAL_PROJECTS` puis projets GitHub (GitHub gagne à id égal), tri `compareProjects` (featured → order → date de création).
- Snapshot de test : si `/api/projects` échoue ou n'existe pas (`vite preview`, Docker, quota GitHub, hors ligne), `useProjects` remplace les projets GitHub par `projects.snapshot.json` quand il existe. Fichier jamais commité (`.gitignore`) : Vercel build sans lui, la prod reste en direct.
- Filtres (`lib/projectFilters.js`) : `all`, origines `42 | personal | freelance`, domaines `frontend | backend | systems | devops | data` ; un projet matche par `origin` ou `domains`. Libellés `filters.*`, origines `origins.*`.
- Filtre langages (`LanguageFilter` + `getAvailableLanguages`/`matchesLanguages`) : chips = langages reconnus dans `stack` par le catalogue `lib/languages.js` (`toLanguageKey` : casse/séparateurs ignorés, alias, standards « C++98 » → C++, TypeScript regroupé sous **JavaScript**, frameworks → leur langage : React/Node.js/Fastify → JavaScript, NumPy/pandas → Python…). Outils et concepts (Docker, Makefile, pthread, TF-IDF…) ignorés ; un projet sans langage reconnu va dans la chip « Autres » (`OTHER_LANGUAGE`, toujours en dernier) pour rester accessible. Multi-sélection en **OU**, combinée (ET) avec la catégorie active ; compteurs calculés sur les projets de la catégorie. Libellés `projectsSection.languageFilter.*`. Nouveau langage/framework → `LANGUAGES`, `LANGUAGE_ALIASES` ou `FRAMEWORK_LANGUAGES`.
- Textes (`lib/projectText.js`) : clé `projects.<id>.<field>` si elle existe, sinon texte du projet (langue courante → fr → en) ; `summary` vide → « origine • 2 technos ».
- Liste : « Chargement des projets… » tant que l'API n'a pas répondu ; 6 projets puis « Voir plus » (+6) ; desktop : hauteur calée sur le détail avec défilement interne ; mobile : filtres sur une ligne défilante.
- Preview : image + vidéo au survol ; vidéo seule → première frame ; rien → `ProjectCover`.
- Actions du détail (`lib/projectActions.js`) : GitHub, Démo — point d'extension pour un futur « Lancer ».

## Bulles
- Variants CSS : `bubble-orange`, `bubble-grey`, `bubble-green-light`, `bubble-green-dark` (bubble.css, couleurs `--bubble-*` d'index.css).
- `FloatingShape` : `x`,`y` en % du cluster, `size` en % de `--cluster-size`, `delay`, `floatY`, `floatRotate`, `repelRadius`, `repelForce` (réglés sur `CLUSTER_BASE_SIZE` = 520 dans `lib/repel.js`), `pointer`, `isDraggable`.

## Dépendances runtime
react 19, react-dom, react-router-dom 7, i18next + react-i18next, motion (import `motion/react`), clsx, react-icons, @vercel/analytics.

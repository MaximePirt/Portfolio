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
├── server/                    # logique Node partagée api/ + scripts/ : github.mjs (API + raw), parseYaml.mjs, buildProject.mjs, collectProjects.mjs, localMedia.mjs
├── scripts/
│   └── check-projects.mjs     # contrôle les repos marqués (✓/⚠/✗), n'écrit rien
└── src/
    ├── main.jsx               # importe i18n + index.css, monte <App/> en StrictMode
    ├── App.jsx                # BrowserRouter + ordre des sections (voir plus bas)
    ├── i18n/
    │   ├── index.js           # i18next, ressources fr/en, lng 'fr', fallback 'fr'
    │   └── locales/{fr,en}/translation.json
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx     # logo + nom, toggle dark mode (state local → data-theme sur <html>), lien GitHub
    │   │   └── Footer.jsx     # © année + profile.name + footer.rights
    │   ├── sections/
    │   │   ├── Banner/Banner.jsx        # nav par ancres (labels EN DUR), titre, BannerCard, portrait, BannerBubbles — styles/banner.css
    │   │   ├── Banner/BannerCard.jsx    # texte banner.subtitle
    │   │   ├── Banner/BannerBubble.jsx  # bulles statiques desktop/mobile positionnées en %
    │   │   └── GithubActivity/GithubActivitySection.jsx # id="activity", lib github-calendar (user MaximePirt), bulles FloatingShape — styles/github-activity.css
    │   └── ui/
    │       ├── HeroSection.jsx      # id="home", hero.title/subtitle, cluster de FloatingShape (SHAPES) desktop + MobileHeroShapes
    │       ├── Bubble.jsx           # cercle : props variant, size, absolute, x, y, style — styles/bubble.css
    │       ├── FloatingBubble.jsx   # export FloatingShape : flottement motion + répulsion souris (repelRadius/repelForce mis à l'échelle sur CLUSTER_BASE_SIZE=520). Nécessite sectionRef + clusterRef + --cluster-size
    │       ├── LanguageSwitcher.jsx # bouton fixe bas-gauche, menu FR/EN (i18n.changeLanguage)
    │       ├── InfoCards.jsx        # export InfoCard (non utilisé actuellement)
    │       └── Backbutton.jsx       # export BackButton (utilisé par Infos)
    ├── pages/
    │   ├── Home.jsx           # route "/" → <Banner/>
    │   ├── Contact.jsx        # id="contact", ContactSection : mail/LinkedIn/stack (stack EN DUR) — styles/contact.css
    │   ├── Infos.jsx          # route "/infos", page quasi vide
    │   ├── Presentation.jsx   # NON importé (exporte une fonction nommée Home)
    │   └── projects/
    │       ├── projects.manual.js   # projets hors GitHub (ft_transcendance tant qu'il n'a pas le topic)
    │       ├── projects.api.js      # fetchRemoteProjects : appelle /api/projects et vérifie la version du schéma
    │       ├── useProjects.js       # hook : projets GitHub + manuels fusionnés, status loading/ready/error
    │       ├── lib/                 # pur JS partagé front/serveur : projectSchema, projectFilters (catégories + langages), projectText, projectActions, generatedCover, mergeProjects
    │       ├── useProjectText.js    # hook getText(project, 'title'|'summary'|'description')
    │       ├── ProjectsSection.jsx  # id="project", filtres + liste + détail — styles/projects.css
    │       ├── ProjectFilters.jsx   # pills de filtre avec compteur (seulement les filtres non vides)
    │       ├── LanguageFilter.jsx   # bouton « Filtre » devant les pills + bandeau animé (`motion/react`) de chips langages (multi-sélection)
    │       ├── useDismiss.js        # hook : ferme sur Échap ou clic extérieur
    │       ├── ProjectStatusBadge.jsx # badge « En cours »
    │       ├── ProjectCover.jsx     # cover de bulles générée quand il n'y a ni image ni vidéo
    │       ├── ProjectsList.jsx     # pills (titleKey/metaKey), état vide en dur
    │       ├── ProjectDetail.jsx    # header, liens GitHub/Demo, preview, stack (chips), description
    │       └── ProjectPreview.jsx   # image coverSrc, vidéo webm/mp4 jouée au survol
    └── styles/
        ├── index.css          # @import tailwindcss, variables :root + [data-theme="dark"], header/lang-btn/footer/info-card
        ├── banner.css, bubble.css, contact.css, github-activity.css, projects.css
```

## Ordre de rendu (`App.jsx`)
`Header` → `LanguageSwitcher` → `HeroSection` → `<Routes>` (`/` Home, `/contact` Contact, `/infos` Infos) → `ProjectsSection` → `GithubActivitySection` → `Contact` → `Footer` → `<Analytics/>` (@vercel/analytics).
Seul le bloc `<Routes>` dépend de l'URL ; le reste est toujours rendu.

## Ancres de navigation
`#home` (HeroSection), `#presentation` (aucune cible actuellement), `#project` (ProjectsSection), `#activity` (GithubActivity), `#contact` (Contact).

## Données projets
- Source : repos publics GitHub `MaximePirt` avec le topic `portfolio` (et/ou `.github/portfolio.yml`). `front/api/projects.js` (fonction Vercel) les lit via `server/collectProjects.mjs` et renvoie `{ version, projects }` avec `Cache-Control: public, max-age=300, s-maxage=3600, stale-while-revalidate=86400` : le site suit GitHub sans commit ni déploiement (≈ 1 h de délai). Erreur GitHub → 502 non mis en cache ; le front garde alors les projets manuels. Règles : `docs/portfolio-flags.md`.
- Variables d'environnement (toutes optionnelles) : `GITHUB_TOKEN` (quota API : 60 req/h sans), `PORTFOLIO_GITHUB_OWNER` (défaut `MaximePirt`), `PORTFOLIO_SITE_URL` (défaut : hôte de la requête, utilisé pour détecter les médias de `public/projects/<id>/` par requêtes HEAD, car la fonction ne lit pas `public/`).
- En dev, `vite.config.js` monte le même handler sur `/api/projects` (plugin `projects-api`).
- Forme canonique (`lib/projectSchema.js`, `normalizeProject`) : `{ id, repo, title, summary{fr,en}, description{fr,en}, status, origin, domains[], stack[], links{github,demo}, media{cover,webm,mp4}, featured, order, createdAt, run }`. `run` est réservé au futur lancement des projets (non lu par l'UI). `SCHEMA_VERSION` à incrémenter si la forme change (le front rejette une autre version).
- Fusion (`useProjects` → `lib/mergeProjects.js`) : `MANUAL_PROJECTS` puis projets GitHub (GitHub gagne à id égal), tri `compareProjects` (featured → order → date de création).
- Filtres (`lib/projectFilters.js`) : `all`, origines `42 | personal | freelance`, domaines `frontend | backend | systems | devops | data` ; un projet matche par `origin` ou `domains`. Libellés `filters.*`, origines `origins.*`.
- Filtre langages (`LanguageFilter` + `getAvailableLanguages`/`matchesLanguages`) : langages = valeurs de `stack` regroupées par `toLanguageKey` (casse, séparateurs `. - _ espace`, suffixe « js » et alias JS/TS/Golang… ignorés : « Node.js » = « NodeJS »), multi-sélection en **OU**, combiné (ET) avec la catégorie active ; compteurs calculés sur les projets de la catégorie. Libellés `projectsSection.languageFilter.*`.
- Textes (`lib/projectText.js`) : clé `projects.<id>.<field>` si elle existe, sinon texte du projet (langue courante → fr → en) ; `summary` vide → « origine • 2 technos ».
- Liste : « Chargement des projets… » tant que l'API n'a pas répondu ; 6 projets puis « Voir plus » (+6) ; desktop : hauteur calée sur le détail avec défilement interne ; mobile : filtres sur une ligne défilante.
- Preview : image + vidéo au survol ; vidéo seule → première frame ; rien → `ProjectCover`.
- Actions du détail (`lib/projectActions.js`) : GitHub, Démo — point d'extension pour un futur « Lancer ».

## Bulles
- Variants CSS : `bubble-orange`, `bubble-grey`, `bubble-green-light`, `bubble-green-dark` (bubble.css, couleurs `--bubble-*` d'index.css).
- `FloatingShape` : `x`,`y` en % du cluster, `size` en % de `--cluster-size`, `delay`, `floatY`, `floatRotate`, `repelRadius`, `repelForce`.

## Dépendances runtime
react 19, react-dom, react-router-dom 7, i18next + react-i18next, motion (import réel : `framer-motion`), clsx, react-icons, github-calendar, @vercel/analytics.

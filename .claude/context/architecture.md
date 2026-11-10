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
├── scripts/
│   ├── sync-projects.mjs      # repos GitHub marqués → src/pages/projects/projects.generated.json (--check : valide sans écrire)
│   └── lib/                   # github.mjs (API + raw), parseYaml.mjs (sous-ensemble YAML), buildProject.mjs (topics/yml → projet)
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
    │       ├── projects.generated.json # écrit par scripts/sync-projects.mjs (ne pas éditer à la main)
    │       ├── projects.manual.js   # projets hors GitHub (ft_transcendance tant qu'il n'a pas le topic)
    │       ├── projects.data.js     # fusion généré + manuel → PROJECTS triés ; réexporte PROJECT_FILTERS
    │       ├── lib/                 # pur JS partagé front/script : projectSchema, projectFilters, projectText, projectActions, generatedCover
    │       ├── useProjectText.js    # hook getText(project, 'title'|'summary'|'description')
    │       ├── ProjectsSection.jsx  # id="project", filtres + liste + détail — styles/projects.css
    │       ├── ProjectFilters.jsx   # pills de filtre avec compteur (seulement les filtres non vides)
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
- Source : repos GitHub `MaximePirt` avec le topic `portfolio` (et/ou `.github/portfolio.yml`) → `scripts/sync-projects.mjs` → `projects.generated.json` `{ version, projects }`. Action `.github/workflows/sync-projects.yml` : quotidienne + manuelle + `repository_dispatch: sync-projects`, commit sur `main` si le JSON change. Règles : `docs/portfolio-flags.md`.
- Forme canonique (`lib/projectSchema.js`, `normalizeProject`) : `{ id, repo, title, summary{fr,en}, description{fr,en}, status, origin, domains[], stack[], links{github,demo}, media{cover,webm,mp4}, featured, order, createdAt, run }`. `run` est réservé au futur lancement des projets (non lu par l'UI). `SCHEMA_VERSION` à incrémenter si la forme change.
- Fusion (`projects.data.js`) : `MANUAL_PROJECTS` puis généré (le généré gagne à id égal), tri `compareProjects` (featured → order → date de création).
- Filtres (`lib/projectFilters.js`) : `all`, origines `42 | personal | freelance`, domaines `frontend | backend | systems | devops | data` ; un projet matche par `origin` ou `domains`. Libellés `filters.*`, origines `origins.*`.
- Textes (`lib/projectText.js`) : clé `projects.<id>.<field>` si elle existe, sinon texte du projet (langue courante → fr → en) ; `summary` vide → « origine • 2 technos ».
- Liste : 6 projets puis « Voir plus » (+6) ; desktop : hauteur calée sur le détail avec défilement interne ; mobile : filtres sur une ligne défilante.
- Preview : image + vidéo au survol ; vidéo seule → première frame ; rien → `ProjectCover`.
- Actions du détail (`lib/projectActions.js`) : GitHub, Démo — point d'extension pour un futur « Lancer ».

## Bulles
- Variants CSS : `bubble-orange`, `bubble-grey`, `bubble-green-light`, `bubble-green-dark` (bubble.css, couleurs `--bubble-*` d'index.css).
- `FloatingShape` : `x`,`y` en % du cluster, `size` en % de `--cluster-size`, `delay`, `floatY`, `floatRotate`, `repelRadius`, `repelForce`.

## Dépendances runtime
react 19, react-dom, react-router-dom 7, i18next + react-i18next, motion (import réel : `framer-motion`), clsx, react-icons, github-calendar, @vercel/analytics.

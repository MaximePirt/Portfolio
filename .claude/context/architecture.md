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
    │       ├── projects.data.js     # PROJECT_FILTERS + PROJECTS
    │       ├── ProjectsSection.jsx  # id="project", filtres + liste + détail — styles/projects.css
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

## Données projets (`projects.data.js`)
- `PROJECT_FILTERS` : `{ value, labelKey }` — valeurs `all | 42 | frontend | backend | freelance`, libellés sous `filters.*`.
- `PROJECTS[]` : `{ id, titleKey, metaKey, descriptionKey, categories[], stack[], coverSrc, previewType: 'video', previewWebm, previewMp4, poster, github, demo }`.
- Clés i18n : `projects.<id_snake>.{title, meta, description}` (ex. id `ft-transcendance` → clés `projects.ft_transcendance.*`).
- Actif : `ft-transcendance`. Commentés : `portfolio`, `minishell` (textes déjà traduits).
- `ProjectsSection` filtre par `categories.includes(filter)` et resélectionne le premier projet si la sélection sort du filtre.

## Bulles
- Variants CSS : `bubble-orange`, `bubble-grey`, `bubble-green-light`, `bubble-green-dark` (bubble.css, couleurs `--bubble-*` d'index.css).
- `FloatingShape` : `x`,`y` en % du cluster, `size` en % de `--cluster-size`, `delay`, `floatY`, `floatRotate`, `repelRadius`, `repelForce`.

## Dépendances runtime
react 19, react-dom, react-router-dom 7, i18next + react-i18next, motion (import réel : `framer-motion`), clsx, react-icons, github-calendar, @vercel/analytics.

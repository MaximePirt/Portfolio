# Marquer un repo pour le portfolio — guide pour agents IA

Ce document est autonome : il suffit à un agent pour ajouter, sur un repo GitHub de **MaximePirt**, les informations qui le font apparaître dans la section « Projets » du portfolio. Suis-le à la lettre.

## Comment ça marche
- Le site (`maxime-pierrot.com`) interroge `/api/projects`, une fonction Vercel qui lit les repos publics de `MaximePirt` sur GitHub. La réponse est mise en cache 1 h : un repo marqué apparaît donc au plus tard environ 1 h après (5 min de cache navigateur en plus). Rien à lancer ni à commiter dans le repo Portfolio.
- Un repo apparaît dans le portfolio s'il porte le **topic GitHub `portfolio`** (ou `portfolio: true` dans `.github/portfolio.yml`).
- Les détails (textes FR/EN, stack, médias…) viennent, dans l'ordre : de `.github/portfolio.yml` s'il existe, sinon des topics et des infos GitHub du repo (description, langages, site web).
- **Le README n'est jamais lu.** N'y ajoute ni front matter, ni balise, ni commentaire pour le portfolio.

## Règle d'or
1. Toujours ajouter le topic `portfolio`.
2. Ajouter les topics qui décrivent l'origine et les domaines (voir tableau ci-dessous).
3. Créer `.github/portfolio.yml` **seulement** si des textes ou réglages plus précis sont utiles.
4. Ne rien inventer : lis le code et le README du repo avant d'écrire une description.

## Étape 1 — Topics
Via la CLI (dans n'importe quel dossier) :
```bash
gh repo edit MaximePirt/<repo> --add-topic portfolio,42,systems
```
Ou dans l'UI GitHub : page du repo → roue dentée « About » → « Topics ».

| Topic | Effet |
|---|---|
| `portfolio` | **obligatoire** : le repo est affiché |
| `42` ou `42school` | origine = projet École 42 |
| `personal` | origine = projet perso |
| `freelance` | origine = mission freelance |
| `frontend`, `backend`, `systems`, `devops`, `data` | domaines (plusieurs possibles) |
| `wip` | statut « En cours » (badge sur le portfolio) |

Sans topic d'origine → `personal`. Sans topic de domaine → déduit du langage principal : C/C++/Rust → `systems`, Python/Jupyter → `data`, Shell/Dockerfile → `devops`, TypeScript/JavaScript/HTML/CSS → `frontend`.

Topics autres que ceux-ci : autorisés (ils restent sur GitHub), ignorés par le portfolio.

## Étape 2 (optionnelle) — `.github/portfolio.yml`
Tous les champs sont optionnels. Un champ présent l'emporte sur ce qui est déduit des topics.

| Champ | Type | Valeurs / format | Défaut |
|---|---|---|---|
| `portfolio` | booléen | `true` affiche le repo même sans topic ; `false` le masque même avec le topic | — |
| `title` | texte | nom affiché | nom du repo |
| `status` | texte | `completed` ou `in-progress` | `completed` (`in-progress` si topic `wip`) |
| `origin` | texte | `42`, `personal` ou `freelance` | topic, sinon `personal` |
| `domains` | liste | parmi `frontend`, `backend`, `systems`, `devops`, `data` | topics, sinon langage principal |
| `summary` | objet `fr` / `en` | ligne courte sous le titre, **≤ 40 caractères** | « origine • 2 premières technos » |
| `description` | objet `fr` / `en` | 1 à 3 phrases factuelles | description GitHub du repo |
| `stack` | liste | technos affichées en puces (4 à 6 max) | 4 langages principaux du repo |
| `demo` | URL | `https://…` | champ « Website » du repo |
| `cover` | chemin ou URL | image 16:10, ex. `.github/portfolio/poster.webp` | fichier du portfolio, sinon visuel généré |
| `video` | chemin ou URL | `.webm` (préféré) ou `.mp4`, ex. `.github/portfolio/trailer.webm` | fichier du portfolio, sinon aucune |
| `featured` | booléen | `true` = en tête et sélectionné par défaut | `false` |
| `order` | nombre | plus petit = plus haut | `100` |
| `id` | texte | `a-z`, `0-9`, `-`, `_` | nom du repo en minuscules |
| `run` | — | **réservé, ne pas remplir** | — |

Un champ inconnu est ignoré et signalé. Une valeur hors liste (`status`, `origin`, `domains`) exclut le repo jusqu'à correction.

### YAML accepté (sous-ensemble strict)
- `clé: valeur`, indentation par **espaces** (jamais de tabulation), objets imbriqués par indentation.
- Listes : `[a, b]` ou une ligne `- valeur` par élément. Pas de liste d'objets, pas d'objet en ligne `{ }`.
- Chaînes simples, ou entre `"…"` / `'…'` si elles contiennent `:` ou `#`.
- Texte long : `>` (lignes repliées en un paragraphe) ou `|` (retours à la ligne conservés).
- `true`, `false`, nombres, commentaires `# …`.

## Règles de rédaction
- Dès qu'un texte est fourni, **FR et EN sont obligatoires** et disent la même chose.
- `summary` : très court, style « 42 • C / Unix », « Perso • React ».
- `description` : ce que fait le projet et ce qu'il démontre techniquement. Pas de superlatifs, pas de fonctionnalité non présente dans le code.
- Ne mets `featured: true` ou `order` que si Maxime le demande.
- Médias : `poster.webp` en 16:10 (≈ 1600×1000), `trailer.webm` court (≤ 15 s), muet, léger (< 5 Mo).
  - Soit dans le repo du projet (`.github/portfolio/…`, référencé par `cover` / `video`),
  - soit dans le repo Portfolio : `front/public/projects/<id>/poster.webp` et `trailer.webm` (détectés automatiquement, sans champ).
  - Sans image ni vidéo, le portfolio génère un visuel : ce n'est pas une erreur.

## Exemples

### Projet 42 minimal (topics seuls, pas de fichier)
```bash
gh repo edit MaximePirt/Get_next_line --add-topic portfolio,42,systems
```

### Projet perso complet — `.github/portfolio.yml`
```yaml
title: Portfolio
origin: personal
domains: [frontend]
summary:
  fr: Perso • React / UI
  en: Personal • React / UI
description:
  fr: >
    Portfolio one-page bilingue en React 19 et Vite, avec une section projets
    synchronisée automatiquement depuis GitHub.
  en: >
    Bilingual one-page portfolio built with React 19 and Vite, with a projects
    section synced automatically from GitHub.
stack: [React, Vite, Tailwind, i18next]
demo: https://example.com
cover: .github/portfolio/poster.webp
video: .github/portfolio/trailer.webm
```

### Projet en cours
Topics : `portfolio`, `personal`, `wip` — ou dans le yml :
```yaml
status: in-progress
```

### Masquer un repo qui a le topic
```yaml
portfolio: false
```

## Commit dans le repo du projet
- Un seul commit : `chore: add portfolio metadata` (anglais, minuscules).
- Ne touche à aucun autre fichier du repo, en particulier pas au README.

## Vérifier
Depuis un clone du repo Portfolio :
```bash
npm --prefix front run check:projects
```
Chaque repo marqué est listé avec ✓ (valide), ⚠ (avertissement, ex. origine absente) ou ✗ (erreur à corriger). Le code de sortie vaut 1 s'il reste une erreur. Le cache de `raw.githubusercontent.com` peut retarder la prise en compte d'un `portfolio.yml` de quelques minutes.

La mise en ligne est ensuite automatique : aucune action requise. Le contrôle lit GitHub directement, comme le site.

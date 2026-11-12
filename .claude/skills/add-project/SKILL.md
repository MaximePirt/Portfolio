---
name: add-project
description: Ajouter (ou réactiver/modifier) un projet dans la section Projets du portfolio — marquage du repo GitHub (topic portfolio, .github/portfolio.yml), contrôle, médias, surcharges de textes et vérifications. À utiliser quand l'utilisateur veut afficher un nouveau projet ou en modifier un.
---

# Ajouter un projet

Les projets viennent des repos GitHub marqués. Référence complète des flags : `docs/portfolio-flags.md`. Données et rendu : `.claude/context/architecture.md` (section « Données projets »). Ne pas relire tout `front/src`.

## Cas 1 — le projet a un repo GitHub public (cas normal)
1. **Marquer le repo** (action sur un autre repo : demander l'accord avant) : topics `portfolio` + origine (`42`/`personal`/`freelance`) + domaines, selon `docs/portfolio-flags.md`. Créer `.github/portfolio.yml` seulement si des textes FR/EN ou réglages précis sont utiles. Ne jamais toucher au README pour ça.
2. **Médias** (optionnels) : `front/public/projects/<id>/poster.webp` (16:10) et `trailer.webm`, `<id>` = nom du repo en minuscules. Détectés automatiquement. Sans média, une cover générée s'affiche. Ne jamais supprimer d'asset existant.
3. **Contrôle** : `npm --prefix front run check:projects` (✓ / ⚠ / ✗ par repo). Rien à synchroniser ni à commiter : le site lit GitHub via `/api/projects` (cache 1 h).
4. **Textes plus fins (optionnel)** : ajouter `projects.<id>.{title, summary, description}` dans `fr/translation.json` ET `en/translation.json` — ils l'emportent sur le yml.
5. Si le projet était dans `projects.manual.js`, le retirer une fois qu'il est marqué sur GitHub (la version GitHub gagne de toute façon à id égal).

## Cas 2 — pas de repo public (freelance, privé…)
Ajouter un objet dans `front/src/pages/projects/projects.manual.js` à la forme de `lib/projectSchema.js` (`normalizeProject` complète les champs absents) et ses textes `projects.<id>.*` fr + en.

## Nouvelle origine / nouveau domaine ?
Modifier `ORIGINS`/`DOMAINS` (`lib/projectSchema.js`), `PROJECT_FILTERS` (`lib/projectFilters.js`), les tables d'inférence (`front/server/buildProject.mjs`), les clés `filters.*` / `origins.*` fr + en, et `docs/portfolio-flags.md`.

## Vérifier
`node .claude/hooks/i18n-parity.mjs`, `npm --prefix front run lint`, `npm --prefix front run build`, puis preview `portfolio-front` sur `#project` (filtre, sélection, preview/cover, mobile 375px).

## Contexte
Mettre à jour `.claude/context/known-issues.md` (média manquant, projet en attente de topic…).

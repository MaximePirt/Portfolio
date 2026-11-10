---
name: add-project
description: Ajouter (ou réactiver) un projet dans la section Projets du portfolio — données, traductions fr/en, médias et vérifications. À utiliser quand l'utilisateur veut afficher un nouveau projet ou en modifier un.
---

# Ajouter un projet

Contexte utile : `.claude/context/architecture.md` (section « Données projets »). Ne pas relire tout `front/src`.

## Infos à obtenir (demander ce qui manque)
- `id` en kebab-case (ex. `cub3d`), titre, méta courte (ex. « 42 • C / Graphisme »), description FR **et** EN.
- Catégories parmi `42 | frontend | backend | freelance` (une nouvelle catégorie = ajouter un filtre, voir étape 4).
- Stack (liste de technos), lien GitHub, lien démo (optionnels).
- Médias : `poster.webp` (obligatoire), `trailer.webm` (optionnel).

## Étapes
1. **Données** — `front/src/pages/projects/projects.data.js` : ajouter un objet dans `PROJECTS` au même format que `ft-transcendance`. Clés i18n en snake_case : `projects.<id_snake>.title|meta|description`. Si le projet est commenté (portfolio, minishell), le décommenter plutôt que dupliquer. Mettre `previewMp4: ''` si pas de mp4.
2. **Traductions** — ajouter `projects.<id_snake>` dans `fr/translation.json` ET `en/translation.json` (même structure).
3. **Médias** — vérifier que `front/public/projects/<id_snake_ou_dossier>/poster.webp` existe (et `trailer.webm` si référencé). Ne pas inventer de fichier : si absent, le signaler.
4. **Nouvelle catégorie ?** — ajouter `{ value, labelKey: 'filters.<cle>' }` dans `PROJECT_FILTERS` + clés `filters.<cle>` fr/en.
5. **Vérifier** — `node .claude/hooks/i18n-parity.mjs`, `npm --prefix front run lint`, `npm --prefix front run build`. Si possible, ouvrir la preview (`portfolio-front`) et contrôler `#project` (filtre, sélection, vidéo au survol).
6. **Contexte** — mettre à jour la liste « Actif / Commentés » dans `.claude/context/architecture.md` et `known-issues.md` si un média manque.

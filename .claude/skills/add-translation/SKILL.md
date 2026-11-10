---
name: add-translation
description: Ajouter, renommer ou corriger des textes traduits (i18next fr/en) du portfolio, ou remplacer un texte en dur par une clé t(). À utiliser dès qu'un texte visible change.
---

# Ajouter / modifier une traduction

Fichiers : `front/src/i18n/locales/fr/translation.json` et `front/src/i18n/locales/en/translation.json`. Le français est la langue par défaut et la référence.

## Étapes
1. Choisir le namespace existant le plus proche (`hero`, `nav`, `projectsSection`, `contact`, `githubActivity`…, voir `.claude/context/conventions.md`). En créer un nouveau seulement pour une nouvelle section (nom en camelCase).
2. Ajouter la clé **dans les deux fichiers**, au même emplacement, avec une vraie traduction (pas de copie FR dans EN). Respecter l'indentation existante du fichier.
3. Dans le composant : `const { t } = useTranslation()` (import `react-i18next`) puis `t('namespace.cle')`. Ne jamais laisser le texte en dur, y compris `aria-label` et `alt`.
4. Renommage de clé : chercher toutes les utilisations (`grep -rn "ancienne.cle" front/src`) avant de renommer ; supprimer l'ancienne dans les deux fichiers.
5. Vérifier : `node .claude/hooks/i18n-parity.mjs` doit sortir sans erreur, puis `npm --prefix front run lint`.
6. Si le texte corrigé figurait dans `.claude/context/known-issues.md` (section i18n), cocher/supprimer l'entrée.

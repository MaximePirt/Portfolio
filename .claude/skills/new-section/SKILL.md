---
name: new-section
description: Créer une nouvelle section de la page (composant, CSS dédié, traductions, ancre de navigation, intégration dans App.jsx) en respectant le style du portfolio.
---

# Créer une section

Lire d'abord `.claude/context/conventions.md` (couleurs, classes, i18n) et la partie « Ordre de rendu » de `.claude/context/architecture.md`.

## Étapes
1. **Composant** — `front/src/components/sections/<Nom>/<Nom>Section.jsx` : `<section className="<nom>-section" id="<ancre>">`, contenu dans un `<div className="<nom>-shell">` comme `ProjectsSection` / `GithubActivitySection`. Textes via `t()`.
2. **Styles** — `front/src/styles/<nom>.css`, importé par le composant. Classes BEM-like (`<nom>-header__title`), couleurs uniquement via `var(--...)`. Prévoir le rendu en `[data-theme="dark"]`.
3. **Bulles décoratives (optionnel)** — réutiliser `FloatingShape` (`components/ui/FloatingBubble.jsx`) avec `sectionRef`, `clusterRef` et un conteneur qui définit `--cluster-size` ; `aria-hidden="true"`.
4. **Traductions** — namespace camelCase dans fr + en (voir skill `add-translation`).
5. **Intégration** — importer dans `front/src/App.jsx` à la bonne position ; si la section doit être accessible depuis la nav, ajouter l'entrée dans `navItems` de `Banner.jsx`.
6. **Responsive** — tester 375px, 768px et desktop dans la preview (`portfolio-front`).
7. **Vérifier** — parité i18n, lint, build.
8. **Contexte** — ajouter la section dans l'arbre et l'ordre de rendu de `.claude/context/architecture.md`, la carte express de `CLAUDE.md` et la liste des namespaces de `conventions.md`.

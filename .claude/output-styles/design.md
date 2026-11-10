---
name: design
description: Mode UI/UX — identité visuelle du portfolio, variantes, vérification visuelle
keep-coding-instructions: true
---

# Mode design

Tu travailles sur l'interface du portfolio. Réponds en français.

- Avant toute proposition, relis `.claude/context/conventions.md` (palette, variables, classes). Identité : tons vert-gris (`--primary`, `--secondary`, `--green`), accent orange `--accent`, fond clair `--background`, bulles flottantes animées, typographie grasse et éditoriale.
- N'utilise que les variables CSS existantes ; si une nouvelle couleur est indispensable, propose-la d'abord comme variable dans `index.css` avec sa valeur dark.
- Pour un choix visuel ouvert, propose 2 à 3 variantes courtes (description + impact) et recommande-en une avant de coder.
- Après chaque changement visuel : ouvre la preview `portfolio-front`, vérifie en 375px, 768px et desktop, en clair et en sombre, et décris ce que tu as constaté (capture si utile).
- Soigne les animations (motion) : douces, `prefers-reduced-motion` respecté si tu en ajoutes.
- Respecte les garde-fous de `CLAUDE.md` (i18n fr/en, pas de dépendance sans accord) et mets à jour le contexte si une convention visuelle change.

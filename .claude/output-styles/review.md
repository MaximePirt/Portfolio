---
name: review
description: Mode relecture critique — trouve les problèmes, ne modifie rien
keep-coding-instructions: true
---

# Mode review

Tu es en mode relecture. Réponds en français.

- **Ne modifie aucun fichier** et ne lance aucune commande qui écrit. Lecture, `git diff`, lint et build sont autorisés.
- Commence par `CLAUDE.md` puis le fichier de `.claude/context/` pertinent ; ne relis que les fichiers concernés par la relecture.
- Cherche, par ordre de priorité : bugs et régressions, textes en dur non traduits (fr/en), couleurs en dur hors variables CSS, accessibilité (`alt`, `aria-*`, contrastes, focus clavier), responsive mobile/iPad, dark mode, performance (vidéos, re-renders, listeners non nettoyés), respect des garde-fous.
- Format : liste classée par sévérité (🔴 bloquant, 🟠 important, 🟡 mineur), chaque point avec `fichier:ligne`, le problème en une phrase et la correction proposée.
- Termine par ce qui est bien fait (2–3 points max) et propose d'appliquer les corrections — sans les appliquer.
- Si un point est déjà listé dans `.claude/context/known-issues.md`, le préciser.

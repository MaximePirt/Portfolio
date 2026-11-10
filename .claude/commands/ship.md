---
description: Prépare un commit — vérifications, contexte à jour, message proposé
---

1. Exécute les vérifications de `/check` (parité i18n, lint, build). S'il y a un échec, arrête-toi et liste les problèmes.
2. Vérifie la règle de maintenance : si `git status` montre des changements de code sans mise à jour de `CLAUDE.md` / `.claude/context/`, applique la skill `sync-context` d'abord.
3. Montre `git status --short` et un résumé du diff.
4. Propose un message de commit au style du dépôt (court, anglais, minuscules, ex. `fix mobile banner presentation`, `feat: ...`). $ARGUMENTS peut préciser l'intention.
5. **N'exécute ni `git commit` ni `git push`** : attends ma confirmation explicite.

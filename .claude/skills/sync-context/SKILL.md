---
name: sync-context
description: Remettre à jour CLAUDE.md et .claude/context/* (et les skills/commandes/hooks si besoin) pour qu'ils reflètent l'état réel du projet. À utiliser après des modifications, quand le hook Stop le rappelle, ou quand le contexte semble périmé.
---

# Synchroniser le contexte du projet

But : que la prochaine session comprenne le projet en lisant `CLAUDE.md` + un fichier de contexte, sans relire tout le code.

## Étapes
1. Repérer ce qui a changé :
   - `git status --short` et `git diff --stat` (non commité) ;
   - `git log --oneline <commit de base>..HEAD` où le commit de base est noté en tête de `.claude/context/architecture.md`.
2. Pour chaque fichier modifié, ajouté, supprimé ou renommé, lire **seulement ce fichier** (ou son diff) et mettre à jour :
   - `.claude/context/architecture.md` : arbre, rôles, ordre de rendu, ancres, format des données, dépendances ;
   - `.claude/context/conventions.md` : variables CSS, namespaces i18n, règles de style ;
   - `.claude/context/deploy.md` : Docker, nginx, Vercel, variables d'env (noms seulement) ;
   - `.claude/context/known-issues.md` : retirer ce qui est réglé, ajouter ce qui est découvert ;
   - `CLAUDE.md` : carte express, commandes, garde-fous (rester sous ~80 lignes).
3. Vérifier que les skills (`.claude/skills/*`), commandes (`.claude/commands/*`) et hooks (`.claude/hooks/*`) décrivent encore des chemins et procédures valides ; les corriger sinon.
4. Mettre à jour la date et le commit de base en tête de `architecture.md` (`git rev-parse --short HEAD`).
5. Contrôle : chaque chemin cité dans `CLAUDE.md` et `.claude/context/` existe (`ls`).
6. Résumer à l'utilisateur ce qui a été mis à jour. Ne pas commit sans demande.

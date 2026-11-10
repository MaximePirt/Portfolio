---
description: Vérifie le projet — parité i18n, lint et build du front
allowed-tools: Bash(node .claude/hooks/i18n-parity.mjs), Bash(npm --prefix front run lint), Bash(npm --prefix front run build)
---

Lance, dans cet ordre, et continue même si une étape échoue :

1. `node .claude/hooks/i18n-parity.mjs`
2. `npm --prefix front run lint`
3. `npm --prefix front run build`

Puis donne un résumé court : ✅/❌ par étape, et pour chaque erreur le fichier:ligne et une proposition de correction. Ne corrige rien sans que je le demande, sauf si $ARGUMENTS contient « fix ».

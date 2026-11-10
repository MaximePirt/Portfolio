# Déploiement

## Vercel (prod actuelle)
- Racine du projet Vercel : `front/` (build `vite build`, sortie `dist`).
- `front/vercel.json` : rewrite `/(.*)` → `/` pour le routing SPA.
- `@vercel/analytics` monté dans `App.jsx`.

## Synchro des projets (GitHub Action)
- `.github/workflows/sync-projects.yml` : cron 06:00 UTC + `workflow_dispatch` + `repository_dispatch` (`sync-projects`). Node 20, aucune dépendance installée.
- Lance `node front/scripts/sync-projects.mjs` avec le `GITHUB_TOKEN` de l'Action, puis commit `chore: sync github projects` par `github-actions[bot]` et push sur `main` si `projects.generated.json` a changé → Vercel redéploie.
- Le build (Vercel/Docker) ne fait aucun appel réseau : il utilise le JSON commité.
- Limites : repos publics uniquement (un PAT en secret serait nécessaire pour les privés) ; GitHub suspend les crons après 60 jours sans activité du repo ; une protection de branche sur `main` bloquerait le push du bot.

## Docker (auto-hébergement)
- `docker-compose.yml` : service `nginx` (build `nginx/Dockerfile`, ports 80/443, env `DOMAIN_NAME`, `WEB_PORT`, volumes `certs` et `certbot-webroot`) + service `certbot` (renouvellement toutes les 12 h).
- `nginx/Dockerfile` : étape `node:20-alpine` → `npm ci` + `npm run build` dans `front/`, puis image `owasp/modsecurity-crs:nginx-alpine` qui sert `dist` depuis `/usr/share/nginx/html`.
- `nginx/entrypoint.sh` : tente `certbot certonly --standalone` pour `DOMAIN_NAME`, sinon **fallback certificat auto-signé** (marqué TODO à retirer), puis `sed` remplace `DOMAIN_NAME` / `WEB_PORT` dans `nginx.conf` et lance nginx.
- `nginx/nginx.conf` : module ModSecurity, TLS 1.2/1.3, `limit_req` 20 r/s, port 80 → redirection HTTPS (seulement GET/HEAD/OPTIONS), challenge ACME sur `/.well-known/acme-challenge/`.
- Variables (`.env.example`) : `DOMAIN_NAME`, `WEB_PORT`, `SSL_PORT`. Le vrai `.env` ne doit jamais être lu.

## Points d'attention
- Toute modif de `nginx/*`, `docker-compose.yml` ou `vercel.json` doit être annoncée avant (garde-fou n°3).
- Node 20 dans le Dockerfile ; vérifier la compatibilité si Vite/deps exigent plus récent.

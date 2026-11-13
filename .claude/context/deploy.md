# Déploiement

## Vercel (prod actuelle)
- Racine du projet Vercel : `front/` (build `vite build`, sortie `dist`).
- `front/vercel.json` : rewrite `/(.*)` → `/` pour le routing SPA.
- `@vercel/analytics` monté dans `App.jsx`.

## Projets : fonction Vercel `/api/projects`
- `front/api/projects.js` est déployée automatiquement par Vercel (racine du projet = `front/`, aucune config à ajouter). Elle lit GitHub à la demande ; le CDN met la réponse en cache 1 h (`s-maxage=3600`) puis la sert périmée pendant son recalcul. Aucune Action GitHub, aucun commit de données.
- Variables Vercel recommandées : `GITHUB_TOKEN` (token en lecture seule sur les repos publics, évite la limite de 60 req/h des IP partagées de Vercel). Optionnelles : `PORTFOLIO_GITHUB_OWNER`, `PORTFOLIO_SITE_URL`.
- `front/vercel.json` n'est pas modifié : son rewrite `/(.*)` → `/` ne s'applique qu'aux chemins sans fichier ni fonction, donc `/api/projects` reste servie par la fonction (à vérifier une fois après le premier déploiement avec `curl -i https://maxime-pierrot.com/api/projects`).
- Limite : la stack Docker/nginx n'a pas de fonctions Vercel : `/api/projects` n'y existe pas, la section n'y affiche que `projects.manual.js` — sauf si un `projects.snapshot.json` local (git-ignoré) existe au moment du build : il est alors embarqué, utile pour tester l'image en local.

## Docker (auto-hébergement)
- `docker-compose.yml` : service `nginx` (build `nginx/Dockerfile`, ports 80/443, env `DOMAIN_NAME`, `WEB_PORT`, volumes `certs` et `certbot-webroot`) + service `certbot` (renouvellement toutes les 12 h).
- `nginx/Dockerfile` : étape `node:20-alpine` → `npm ci` + `npm run build` dans `front/`, puis image `owasp/modsecurity-crs:nginx-alpine` qui sert `dist` depuis `/usr/share/nginx/html`.
- `nginx/entrypoint.sh` : tente `certbot certonly --standalone` pour `DOMAIN_NAME`, sinon **fallback certificat auto-signé** (marqué TODO à retirer), puis `sed` remplace `DOMAIN_NAME` / `WEB_PORT` dans `nginx.conf` et lance nginx.
- `nginx/nginx.conf` : module ModSecurity, TLS 1.2/1.3, `limit_req` 20 r/s, port 80 → redirection HTTPS (seulement GET/HEAD/OPTIONS), challenge ACME sur `/.well-known/acme-challenge/`.
- Variables (`.env.example`) : `DOMAIN_NAME`, `WEB_PORT`, `SSL_PORT`. Le vrai `.env` ne doit jamais être lu.

## SEO & mesure d'audience (sans cookies)
- `front/public/robots.txt` (tout autorisé + lien sitemap) et `front/public/sitemap.xml` (seule URL `/` : `/contact` et `/infos` sont des feuilles sur la même page, la canonical pointe vers `/`). Mettre à jour `lastmod` après une refonte notable.
- `front/index.html` : canonical, robots, Open Graph/Twitter (`summary_large_image`, `character.png` 1368×768), JSON-LD `Person` (`sameAs` GitHub/LinkedIn, à garder synchro avec les liens du site) et un contenu de secours FR dans `#root` pour les robots, remplacé au montage React.
- Le JSON-LD est un bloc de données non exécuté : compatible avec la CSP `script-src 'self'` de nginx.
- Mesure : uniquement `@vercel/analytics` (sans cookies → pas de bandeau CNIL). Pas de Google Analytics. Référencement suivi dans Google Search Console (propriété Domaine, vérif DNS TXT, sitemap soumis) et Bing Webmaster Tools.

## Points d'attention
- Toute modif de `nginx/*`, `docker-compose.yml` ou `vercel.json` doit être annoncée avant (garde-fou n°3).
- Node 20 dans le Dockerfile ; vérifier la compatibilité si Vite/deps exigent plus récent.

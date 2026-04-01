# nginx/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY front/package*.json ./
RUN npm ci

COPY front/ .
RUN npm run build


FROM owasp/modsecurity-crs:nginx-alpine

USER root


COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/entrypoint.sh /entrypoint.sh

RUN apk add --no-cache bash certbot openssl \
    && sed -i 's/\r$//' /entrypoint.sh \
    && chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
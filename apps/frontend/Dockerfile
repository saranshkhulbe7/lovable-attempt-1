FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock turbo.json ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json

RUN bun install --frozen-lockfile

COPY packages/ui ./packages/ui
COPY packages/typescript-config ./packages/typescript-config
COPY apps/frontend ./apps/frontend

WORKDIR /app/apps/frontend

RUN bun run build

FROM nginx:alpine as runner

COPY --from=base /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
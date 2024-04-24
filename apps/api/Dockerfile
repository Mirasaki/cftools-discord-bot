# Builder
FROM node:18-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=@repo/api --docker

# Installer
FROM node:18-alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
RUN yarn global add pnpm
RUN yarn global add turbo

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install --filter=api...

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm generate
RUN turbo build --filter=api...

# Runner
FROM node:18-alpine AS runner
WORKDIR /app

# Copy the build artifacts from the installer stage
# We depend on local packages, and they have root symlinked dependencies
# If only app/apps/**/node_modules was supported =(
COPY --from=installer /app/node_modules /app/node_modules
COPY --from=installer /app/packages /app/packages

# Manage local logs and data folders
# Don't run production as root
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nodejs
# USER nodejs

WORKDIR /app/apps/api
COPY --from=installer /app/apps/api/node_modules ./node_modules
COPY --from=installer /app/apps/api/dist ./dist
COPY --from=installer /app/apps/api/package.json .

CMD node dist/src/index.js
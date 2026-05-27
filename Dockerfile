# -- stage 1: install dependencies and build --
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci

COPY . .
RUN npm run build

# -- stage 2: production image --
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# standalone output (small, self-contained server)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# prisma schema + seed script for db management
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

# Copy all node_modules to guarantee Prisma CLI and all its sub-dependencies (like @prisma/debug, chalk, etc.) are available for the entrypoint script
COPY --from=builder /app/node_modules ./node_modules

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]

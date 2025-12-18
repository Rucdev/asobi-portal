# syntax=docker/dockerfile:1

# ===== Build stage =====
FROM oven/bun:1 AS builder

WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source files
COPY . .

# Build the application
RUN bun run build

# Compile serve.ts for production
RUN bun build serve.ts --outdir dist --target bun

# ===== Production stage =====
FROM oven/bun:1-slim AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 app && \
    adduser --system --uid 1001 --ingroup app app

# Copy built assets and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Create data directory for SQLite
RUN mkdir -p /data && chown -R app:app /data /app

# Switch to non-root user
USER app

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/data/portal.db

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["bun", "run", "start"]

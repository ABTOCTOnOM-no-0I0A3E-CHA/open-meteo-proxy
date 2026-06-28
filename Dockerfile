FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1-slim
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY index.ts undici.d.ts ./
EXPOSE 3001
CMD ["bun", "run", "index.ts"]

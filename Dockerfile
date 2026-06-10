FROM oven/bun:1.0
WORKDIR /app

# Copy only package.json
COPY package.json ./

# Run standard install (Drizzle needs development packages like drizzle-kit to push schemas)
RUN bun install

# Copy the rest of the application files
COPY src ./src
COPY tsconfig.json ./
COPY drizzle.config.ts ./

EXPOSE 3000

# DevOps Pattern: Push the schema to DB first, then start the server
ENTRYPOINT [ "bun", "run", "src/index.ts" ]
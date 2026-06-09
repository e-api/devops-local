FROM oven/bun:1.0
WORKDIR /app

# Copy only package.json
COPY package.json ./

# Run a standard install (allows Bun to generate a clean, local dependency tree)
RUN bun install

# Copy the rest of the application files
COPY src ./src
COPY tsconfig.json ./

EXPOSE 3000
ENTRYPOINT [ "bun", "run", "src/index.ts" ]
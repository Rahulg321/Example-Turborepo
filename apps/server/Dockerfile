FROM oven/bun:1

WORKDIR /app/server

# Copy package files
COPY package.json .

# Install dependencies
RUN bun install

# Copy the source code
COPY index.ts .
COPY tsconfig.json .

EXPOSE 8000

# Start the application
CMD ["bun", "run", "dev"]

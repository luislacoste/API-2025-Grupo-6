# Dockerfile to run the frontend (Vite) dev server
# Builds a small image that installs dependencies and runs `npm run dev`.
# The dev server is started with `--host 0.0.0.0` so it's reachable from the host
# when the container is published by docker-compose.

# Use Node 20 (Vite requires >= 20.19). Alpine keeps the image small.
FROM node:22-alpine

# Create app dir
WORKDIR /app

# Copy package manifest first for better cache
COPY package.json package-lock.json* ./

# Install dependencies (use `ci` if lockfile present)
RUN if [ -f package-lock.json ]; then npm ci --silent; else npm install --silent; fi

# Copy rest of the sources
COPY . .

# Expose Vite default port (5173). You can override with --port in dev args.
EXPOSE 5173

# Use the project's dev script and force Vite to listen on all interfaces so
# the container port mapping works. The `--` tells npm to forward the flags
# to the underlying script (vite). Adjust the port if needed.
CMD ["npm", "run", "dev"]

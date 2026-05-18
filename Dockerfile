# Dockerfile
#
# Multi-stage build for the Translation Lab React SPA.
#
# Stage 1 builds the Vite production bundle with Node.
# Stage 2 serves the static dist/ output with Nginx.

FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first so Docker can cache npm ci when source
# files change but dependencies do not.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

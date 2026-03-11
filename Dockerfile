FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies and build the Vite app
COPY package.json package-lock.json* ./
COPY tsconfig.json vite.config.ts ./
COPY . .
RUN npm ci && npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

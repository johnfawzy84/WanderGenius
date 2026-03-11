FROM node:20-slim AS builder
WORKDIR /app

# Install small build dependencies for optional native modules
RUN apt-get update && apt-get install -y python3 build-essential --no-install-recommends \
	&& rm -rf /var/lib/apt/lists/*

# Install dependencies first (cacheable)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy rest of the source and build
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

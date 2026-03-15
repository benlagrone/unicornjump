# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
# CRA 3 resolves cleanly in container builds with legacy peer dep handling.
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# Runtime stage
FROM nginx:1.27-alpine AS runtime

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

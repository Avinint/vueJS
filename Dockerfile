FROM node:16.15.0 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:bookworm

WORKDIR /var/www/html

COPY --from=builder /app/dist/ .

CMD ["nginx", "-g", "daemon off;"]

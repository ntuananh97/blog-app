FROM node:22-alpine as deps

WORKDIR /app

# Cài đặt OpenSSL cho Prisma trên Alpine
RUN apk add --no-cache openssl

COPY package.json package-lock.json ./

RUN npm install

FROM node:22-alpine as builder

WORKDIR /app

# Cài đặt OpenSSL cho Prisma trên Alpine
RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules

COPY . .

# Generate Prisma Client trước khi build code TypeScript
RUN npx prisma generate

RUN npm run build

# Dọn dẹp devDependencies để giảm kích thước node_modules cho môi trường production
ENV NODE_ENV=production
RUN npm prune --production

FROM node:22-alpine as runner

WORKDIR /app

# Cài OpenSSL để Prisma Client kết nối Cloud Database
RUN apk add --no-cache openssl

ENV NODE_ENV=production

USER node

COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/package.json ./package.json
COPY --chown=node:node --from=builder /app/prisma ./prisma

EXPOSE 4000

CMD ["node", "dist/src/main.js"]
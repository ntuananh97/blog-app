FROM node:22-alpine as deps

WORKDIR /app

# Thêm libc6-compat để tránh lỗi SWC / Sharp trên Alpine
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./

RUN npm ci

FROM node:22-alpine as builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

# Tắt telemetry của Next.js trong quá trình build
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

FROM node:22-alpine as runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

USER node


COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/.next/standalone ./
COPY --chown=node:node --from=builder /app/.next/static ./.next/static


EXPOSE 3000

CMD ["node", "server.js"]
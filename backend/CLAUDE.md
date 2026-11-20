# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

NestJS 11 API using Prisma v7 and PostgreSQL (cloud-hosted). Run commands from `backend/`.

## Commands

```bash
npm run dev            # nest start --watch
npm run build          # nest build (output: dist/src/main.js)
npm run lint           # eslint --fix
npm run format         # prettier
npm test               # jest (unit, *.spec.ts under src/)
npx jest src/path/to/file.spec.ts   # single test file
npx jest -t "test name"             # single test by name
npm run test:e2e       # jest --config ./test/jest-e2e.json
```

Prisma: the config file is named `prisma7.config.ts` (not the default), so pass it explicitly, e.g. `npx prisma generate` / `npx prisma migrate dev --config prisma7.config.ts`. Schema is `prisma/schema.prisma`; it needs `DATABASE_URL` (read via dotenv from `.env`). Required env at runtime: `PORT`, `DATABASE_URL`, `JWT_SECRET` (optional `JWT_EXPIRES_IN`, default `1d`).

## Architecture

- `src/main.ts`: global prefix `api`, URI versioning with default `v1` (routes are `/api/v1/...`), CORS is `*` outside production; in production, origins come from the comma-separated `CORS_ORIGIN` env var (required when `NODE_ENV=production`), global `ValidationPipe` with `whitelist` + `forbidNonWhitelisted` + `transform` (DTOs reject unknown properties). Listens on `0.0.0.0:$PORT` (4000 in Docker).
- `src/app.module.ts`: global `ConfigModule`, global `ThrottlerGuard` (100 req / 60s), and feature modules `auth`, `blog`, `comment`, `prisma`.
- Feature modules follow `controller / service / dto / entities` layout. Auth is protected via `auth/guard/auth.guard.ts` plus the `@CurrentUser` decorator in `common/decorator`.
- Login brute-force protection is an **in-memory** `Map` (`auth/rate-limit-login/login-attemp.service.ts`, keyed by email+ip, 3 attempts → 60s lock, surfaced through `LoginLockedException` and its filter). It does not survive restarts or work across multiple instances.
- Pagination: blog and comment endpoints have both offset-style and cursor-style query DTOs.
- Data model (`prisma/schema.prisma`): `User` → `Blog` → `Comment`; `Comment` is self-referencing (`parentId` / `replies`, named relation `CommentReplies`) for threaded replies; deletes cascade.

## Prisma v7 specifics

- Generator is `prisma-client` with output `generated/prisma` (`backend/generated`); import from `generated/prisma/client`, not `@prisma/client`. Run `npx prisma generate` after schema changes or fresh clone.
- `PrismaService` extends `PrismaClient` and uses a `pg` `Pool` through the `@prisma/adapter-pg` driver adapter (required in v7); it is built from `DATABASE_URL` via `ConfigService`.
- Source files import with `src/...` and `generated/...` absolute paths (tsconfig baseUrl), which is why the Docker `CMD` is `node dist/src/main.js`.

## Misc

- `docs/projects/` holds Vietnamese-language planning notes (MVP, Schedules, Done).
- Error messages and comments in the code are partly Vietnamese.

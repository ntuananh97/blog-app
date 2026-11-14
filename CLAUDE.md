# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Monorepo root for a blog app with two independent npm projects (no workspaces; install in each):

- `backend/` — NestJS 11 + Prisma v7 + PostgreSQL API. See `backend/CLAUDE.md`.
- `client/` — Next.js 16 (App Router, React 19, Tailwind, shadcn/ui, React Query). See `client/CLAUDE.md` / `client/AGENTS.md` (Next.js here has breaking changes; read `client/node_modules/next/dist/docs/` before writing Next code).

## Client commands (run in `client/`)

```bash
npm run dev     # next dev (port 3000)
npm run build
npm run lint
```

No test runner is configured for the client.

## How the pieces connect

- Client talks to the API at `NEXT_PUBLIC_API_URL` (API routes are `/api/v1/...`). Auth token is stored in a cookie (`ACCESS_TOKEN_KEY` in `client/lib/constants.ts`); `client/middleware.ts` redirects to `/login` when it is missing (login/register/auth routes excluded). Google login uses `@react-oauth/google` (`NEXT_PUBLIC_GOOGLE_CLIENT_ID`).
- Client structure: `app/` route groups `(admin)`, `(auth)`, `(main)`; domain logic in `features/blogs/`; HTTP helpers in `lib/httpRequest.ts`; React Query setup in `lib/query-client.ts` (see `client/REACT_QUERY_CLIENT_API_GUIDE.md`).

## Deployment

- `docker-compose.yml` builds `api` (port 4000, `backend/.env`) and `web` (port 3000, `client/.env`); `docker-compose.dev.yml` is the dev variant.
- `.github/workflows/deploy.yml` runs on push to `main` on a self-hosted Windows runner: writes `.env` files from GitHub secrets (`BACKEND_ENV`, `CLIENT_ENV`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`), sets `NEXT_PUBLIC_API_URL` to the runner's LAN IP on port 4000, then `docker compose up -d --build`. A Docker build failure fails the deploy, so make sure both projects build before pushing to `main`.

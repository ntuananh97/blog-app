<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project structure overview

This project follows a flat Next.js App Router layout rather than a `src/` folder. In practice, the structure is:

```text
project-root/
├── app/                          # Next.js App Router: pages, layouts, route groups
├── components/                   # Reusable UI and app-level shared building blocks
│   ├── provider/                 # React Query and auth providers
│   └── ui/                      # shadcn/ui primitives (button, card, input, etc.)
├── features/                    # Feature-based modules
│   └── blogs/
│       ├── api/                 # Blog API fetchers / service layer
│       └── ...                 # Feature-specific components/hooks as needed
├── lib/                         # Shared utilities, constants, client configs, helpers
│   ├── blog-data.ts             # Blog-related local/static data
│   ├── httpRequest.ts           # HTTP helpers
│   ├── query-client.ts          # React Query client setup
│   └── utils.ts                 # General utilities
├── types/                       # Shared TypeScript interfaces/types
```

Overall pattern:
- `app/` handles routing and page composition.
- `components/ui/` contains reusable primitives from shadcn/ui.
- `features/` keeps feature logic organized by domain (currently blog-focused).
- `lib/` centralizes generic helpers and shared client-side configuration.
- `types/` stores model/type contracts used across the app.
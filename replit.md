# SwiftMart

A pnpm monorepo with a SwiftMart Expo/React Native mobile app and an Express 5 API server backed by PostgreSQL.

## Status

- Dependencies installed via `pnpm install`
- **API Server** — running (Express 5, `artifacts/api-server: API Server` workflow)
- **SwiftMart Expo app** — running (Metro bundler, `artifacts/swiftmart: expo` workflow)

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — build and run the API server (port from `$PORT`)
- `pnpm --filter @workspace/swiftmart run dev` — start the Expo dev server (mobile + web)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Stack

- pnpm workspaces, Node.js 20, TypeScript 5.9
- API: Express 5 (esbuild CJS bundle, auto-rebuilt on `dev`)
- Mobile: Expo / React Native (SwiftMart)
- DB: PostgreSQL + Drizzle ORM (`DATABASE_URL` is runtime-managed by Replit — no manual setup needed)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)

## Where things live

- `artifacts/api-server/` — Express API server
- `artifacts/swiftmart/` — Expo mobile app
- `lib/db/` — Drizzle ORM schema and DB client
- `lib/api-spec/` — OpenAPI spec (source of truth for API contracts)
- `lib/api-zod/` — generated Zod schemas from OpenAPI spec
- `lib/api-client-react/` — generated React Query hooks from OpenAPI spec

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `DATABASE_URL` and all `PG*` env vars are runtime-managed by Replit; do not set them manually.
- The DB schema (`lib/db/src/schema/index.ts`) is currently empty — add tables there and run `pnpm --filter @workspace/db run push` to apply them.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

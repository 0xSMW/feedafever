# Opinionated Migration Plan: PHP (Fever) to Next.js (TypeScript)

The aim is to port Fever to a modern stack that maximizes performance and keeps the UX snappy. Rather than mirroring the PHP code line for line, we will embrace modern Next.js features and simplify the data layer since the application mostly stores infrequently changing project information.

## 1. Project Setup
1. Follow `boot-up.md` to create a new Next.js project with TypeScript using the `app` router and React Server Components.
2. Install `rss-parser`, `@prisma/client` with `prisma`, and `next-auth` for authentication.
3. Configure `.env.local` with the SQLite file path (or Postgres connection string) and any required secrets.

## 2. Data Layer
1. Review `firewall/config/db.php` and the PHP code to understand the existing tables.
2. Design a minimal schema with Prisma using SQLite by default (Postgres as an option). Because the data rarely changes, avoid complex transactions and keep tables lean.
3. Store settings and other static information in JSON/YAML files checked into the repo where possible. Seed the database only with data that must be queried dynamically.

## 3. API Endpoints
1. Translate the actions handled in `firewall/app/libs/fever.php` and `api.php` into API routes using the Next.js `app` directory (`app/api`).
2. Implement endpoints for:
   - Installation/setup
   - User authentication and sessions
   - Adding/removing feeds and groups
   - Fetching feed data and updating unread counts
   - Export/import (OPML, etc.)
3. Ensure responses mirror the structure expected by the existing front‑end scripts so that functionality remains the same.

## 4. Feed Processing
1. Replace PHP feed parsing (`SimplePie` in `firewall/app/libs/simplepie`) with a Node solution such as `rss-parser`.
2. Use `node-cron` (or a serverless cron) to periodically fetch feeds in parallel and update the data store. Cache HTTP responses to avoid unnecessary network traffic.
3. Handle favicon fetching and caching similar to the PHP implementation and store icons in a CDN or local cache for faster loading.

## 5. Front‑end Pages
1. Convert view templates from `firewall/app/views` into React Server Components and client components where needed.
2. Recreate the login screen, installer, reader interface, mobile pages, and feedlet using a modern UI library such as Tailwind CSS for a clean and responsive design.
3. Migrate existing JavaScript (`fever.js`, `reader.js`) into TypeScript React components or hooks and leverage Next.js caching strategies (SWR/React Query) for speedy updates.
4. Preserve keyboard shortcuts and other UI behavior found in the original scripts while adding a service worker for optional offline reading.

## 6. Authentication
1. Implement session handling with `next-auth` or a custom JWT approach.
2. Migrate password hashing and user management logic from PHP to Node.
3. Secure API routes so only authenticated users can access protected resources.

## 7. Configuration & Install Flow
1. Translate the installer views (`firewall/app/views/default/install`) into a guided setup wizard in Next.js with a CLI option for headless installs.
2. Persist configuration such as activation keys and DB paths primarily in environment variables or small JSON config files. Keep the database schema lightweight so upgrades are trivial.
3. Provide an upgrade/uninstall path similar to the PHP scripts (`boot.php`, `safety-reboot.php`, `safety-unlace.php`) but scripted via Node CLI commands.

## 8. Testing & Validation
1. Create unit tests for API routes and utility functions using Jest and Testing Library.
2. Add end‑to‑end tests with Playwright or Cypress for critical flows such as login and reading feeds.
3. Verify parity with the PHP version and include performance budgets in CI so pages remain fast over time.

## 9. Deployment
1. Configure a production build with `npm run build` and deploy to a serverless platform like Vercel or a lightweight Docker container.
2. Set up environment variables and a scheduled function for feed refreshing so the app stays fast without manual cron jobs.

Following these steps will migrate the project from a legacy PHP codebase to a modern, maintainable Next.js TypeScript application while preserving all original features.

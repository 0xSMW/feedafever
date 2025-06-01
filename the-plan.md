# Migration Plan: PHP (Fever) to Next.js (TypeScript)

The goal is to reimplement all existing functionality of the Fever PHP application in a modern Next.js TypeScript stack. Below is a high‑level plan of attack.

## 1. Project Setup
1. Follow `boot-up.md` to create a new Next.js project with TypeScript.
2. Add `rss-parser`, `mysql2` (or `prisma`), and `next-auth` packages.
3. Configure `.env.local` with database credentials and any required secrets.

## 2. Database Schema
1. Inspect `firewall/config/db.php` and the PHP source (especially `fever.php`) to determine the tables and fields used.
2. Recreate these tables using an ORM such as Prisma or raw SQL migrations.
3. Seed the database with any default data required for installation.

## 3. API Endpoints
1. Translate the actions handled in `firewall/app/libs/fever.php` and `api.php` into Next.js API routes (under `src/pages/api` or `app/api`).
2. Implement endpoints for:
   - Installation/setup
   - User authentication and sessions
   - Adding/removing feeds and groups
   - Fetching feed data and updating unread counts
   - Export/import (OPML, etc.)
3. Ensure responses mirror the structure expected by the existing front‑end scripts so that functionality remains the same.

## 4. Feed Processing
1. Replace PHP feed parsing (`SimplePie` in `firewall/app/libs/simplepie`) with a Node solution such as `rss-parser`.
2. Create a scheduled job (using `cron`, `node-cron`, or a serverless function) to periodically fetch feeds and update the database.
3. Handle favicon fetching and caching similar to the PHP implementation.

## 5. Front‑end Pages
1. Convert view templates from `firewall/app/views` into React components/pages.
2. Recreate the login screen, installer, reader interface, mobile pages, and feedlet functionality.
3. Migrate existing JavaScript (`fever.js`, `reader.js`) into TypeScript React components or hooks.
4. Preserve keyboard shortcuts and other UI behavior found in the original scripts.

## 6. Authentication
1. Implement session handling with `next-auth` or a custom JWT approach.
2. Migrate password hashing and user management logic from PHP to Node.
3. Secure API routes so only authenticated users can access protected resources.

## 7. Configuration & Install Flow
1. Translate the installer views (`firewall/app/views/default/install`) into a guided setup wizard in Next.js.
2. Store configuration such as activation keys and database info using environment variables or a dedicated configuration table.
3. Provide an upgrade/uninstall path similar to the PHP scripts (`boot.php`, `safety-reboot.php`, `safety-unlace.php`).

## 8. Testing & Validation
1. Create unit tests for API routes and utility functions.
2. Add end‑to‑end tests (e.g., Playwright or Cypress) for critical flows like login and feed reading.
3. Verify that all functionality from the PHP version is available in the Next.js build.

## 9. Deployment
1. Configure a production build with `npm run build` and deploy to your chosen host (Vercel, Docker container, etc.).
2. Set up environment variables and cron tasks on the server for feed refreshing.

Following these steps will migrate the project from a legacy PHP codebase to a modern, maintainable Next.js TypeScript application while preserving all original features.

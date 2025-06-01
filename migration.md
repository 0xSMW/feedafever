# Migration Capabilities Tracker

This document summarizes the features and capabilities found in both the original PHP codebase and the new Next.js implementation. It serves as a checklist for the migration effort.

## Legacy PHP Application

- Server capability detection via `Fever::capabilities()`
- Database access layer with mysqli/PDO fallbacks
- User authentication and session management
- Installation and uninstall routines (`route_installation`, `route_uninstall`)
- Feed management
  - Add/edit/delete feeds and groups
  - Import/export OPML
  - Authorize feeds with credentials
- Feed fetching and caching
  - Refresh feeds on demand or via cron
  - Parse RSS/Atom using SimplePie
  - Favicon caching
  - Housekeeping and cache cleanup
- Reading interface
  - Mark items as read/unread/saved
  - Mark feeds/groups as read
  - Blacklist and link weighting
- API endpoints for third‑party clients (`route_api`)
- Extras: feedlet bookmarklet, keyboard shortcuts, mobile views
- Update mechanism with gateway requests
- Error handling utilities and debugging

## Next.js TypeScript Application

- Prisma schema defining `User`, `Group`, `Feed`, and `Item`
- NextAuth credentials provider for login
- API routes
  - `/api/feeds` – list and create feeds
  - `/api/items` – list feed items
  - `/api/opml` – import/export OPML
  - `/api/auth/[...nextauth]` – authentication
  - `/api/groups` – list and create groups
  - `/api/capabilities` – environment capabilities
- React pages
  - `/login` – sign‑in form
  - `/feeds` – list of feeds
  - `/groups` – list of groups
- Feed fetching scripts (`scripts/fetchFeeds.ts`, `scripts/refreshFeeds.ts`)
- Application layout with font loading and session provider
- ESLint configuration and Next.js tooling

## Migration Status Overview

- [ ] Database schema parity with legacy MySQL
- [ ] Full installer/upgrade flow
 - [x] Reader interface with keyboard shortcuts
 - [ ] Favicon caching and image proxy
 - [x] Item state management (read)
 - [x] Cron‑based refresh and background jobs
 - [x] Group management API
 - [ ] PHP API compatibility layer


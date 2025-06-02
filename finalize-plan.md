# Development Overview

## Migration Task Checklist

- [x] Next.js project and dependencies
- [x] Prisma schema and database
- [x] Authentication via NextAuth
- [x] Fever API routes
- [x] Bookmarklet endpoint
- [x] Cron refresh and fetch scripts
- [x] Favicon caching
- [x] Mobile reader with service worker
- [x] Installation wizard
- [x] Preferences page
- [x] Feed/group management UI
- [x] Import/export UI
- [x] Uninstall script
- [x] Reset script

This document summarizes the legacy **Fever** PHP codebase and its views. Each section details the purpose of the files and the main functions exposed.

## 1. Directory Layout

- `firewall/app` – core PHP application
  - `index.php` – entry point that loads helpers and routes requests through `Fever`.
  - `libs/` – PHP libraries (database wrappers, request helpers, feed parsing, etc.).
  - `views/` – templates for the classic interface.
- `firewall/config` – configuration constants (`db.php`, `key.php`).
- `boot.php`, `safety-reboot.php`, `safety-unlace.php` – installer and recovery scripts.

## 2. Application Flow

1. **Request entry**: `firewall/app/index.php` defines `FIREWALL_ROOT`, loads `util.php` and database libs, instantiates `Fever`, then dispatches `$Fever->route()`.
2. **Routing**: `Fever::route()` examines the request and delegates to other `route_*` methods such as `route_reader`, `route_manage`, `route_refresh`, etc.
3. **Rendering**: `Fever::render($view)` loads a PHP template from `views/default` or `views/mobile` depending on the request (desktop vs. mobile). Variables collected in `Fever::$vars` are extracted for the view.
4. **Database**: all SQL is handled via `SIDB423.php` / `SIDB5.php` depending on available extensions. `Fever` uses methods like `query`, `insert`, `get_all`, etc. for persistence.
5. **Assets and JS**: scripts under `views/*/scripts` (e.g., `fever.js`, `reader.js`) power the interactive UI. Styles live under `views/*/styles`.

## 3. Libraries and Key Functions

Below is a high‑level list of the important libraries and their functions. Only the most relevant functions are listed here for brevity.

### 3.1 `libs/util.php`
Utility helpers used throughout the app:
- `ms()` – current microtime in floating seconds.
- `elapsed_execution_time()` – time elapsed since script start.
- `e()` / `p()` / `ptab()` – echo/print helpers for debugging.
- `low()` / `up()` – shorthand for `strtolower`/`strtoupper`.
- `sr()` / `r()` / `m()` / `ma()` – wrappers around `str_replace`, `preg_replace`, `preg_match`, `preg_match_all`.
- `excerpt($html, $max)` – extract a short excerpt from HTML content.
- `pluralize($num, $singular)` – basic pluralizer.
- `checksum($value)` – 32/64‑bit safe CRC32.
- `array_to_query($array)` – build query string from array data.
- `array_frequency($array)` – frequency count of array values.
- `key_remap($key, $multi)` – reindex an array by a nested key.
- `strip_tags_sane()` / `strip_html()` – safe HTML stripping utilities.
- `resolve($base, $target)` – resolve a relative URL against a base.
- `redirect_to($link)` – redirect with optional `?errors` flag.
- `debug()` / `debug_flush()` – debug output utilities.
- `true_url()` / `rebuild_url()` / `normalize_url()` – URL normalization helpers.
- `ago($time)` – human readable “x minutes ago”.
- `memory_event()` / `memory_report()` – profiling helpers.
- `ico_to_png($data)` – convert Windows `.ico` data to PNG.

### 3.2 `libs/api.php`
Functions for serializing data to XML/JSON:
- `is_associative($array)` – whether an array is associative.
- `remove_control_characters($data)` – strip control chars.
- `array_to_xml($array, $container)` – recursive XML builder.
- `array_to_json($array)` – JSON serialization used in API output.

### 3.3 `libs/request.php`
HTTP client for fetching feeds and remote resources:
- `get($url)`, `post($url, $post)`, `head($url)` – wrappers for `request()`.
- `request($method, $url, $post, $headers)` – performs HTTP via cURL or sockets with redirect support.
- `get_redirect_terminal($url)` – follow redirects until the final URL.

### 3.4 `libs/omdomdom.php`
Minimal DOM parser used when processing feed content:
- `OMDOMDOM::parse($xml)` – returns root node for XML/HTML.
- Node helper methods like `has_attr()`, `get_attr()`, `children()`, `parent()`, `inner_content()`, `outer_content()`, `inner_text()` to navigate and inspect the DOM tree.

### 3.5 `libs/SIDB423.php` & `libs/SIDB5.php`
Database abstraction targeting PDO/MySQL first with fallbacks:
- `SIDB()` – constructor selecting an API.
- `connect()`, `close()`, `query($sql)` – database operations.
- `rows()`, `affected_rows()`, `insert_id()` – result helpers.
- `quote($str)` – escape/quote values.
- Version/info helpers `client_version()` and `server_version()`.

### 3.6 `libs/fever.php`
Main application class containing all business logic. Highlights include:
- **Routing methods** (`route_reader`, `route_manage`, `route_refresh`, etc.) – handle different endpoints and pages.
- **Authentication** (`login`, `logout`, `authenticate`, `is_logged_in`).
- **Database helpers** (`query`, `insert`, `get_all`, `get_one`, etc.).
- **Feed management** (`add_feed`, `edit_feed`, `delete_feed`, `add_group`, `mark_item_as_read`, etc.).
- **Refresh and caching** (`refresh`, `refresh_feed`, `cache_favicon`).
- **Import/Export** (`import`, `export` for OPML files).
- **Utility** (`title`, `content`, `favicon_class`, `feedlet_link`).
Due to size, see `grep -n "function" firewall/app/libs/fever.php` for the full list of methods.


## 4. Views
Views are under `firewall/app/views`. The `default` directory provides the desktop layout while `mobile` targets phones. Key templates include:

### 4.1 Reader Interface (`views/default/reader`)
- `header.php`, `footer.php` – page chrome.
- `groups.php`, `feeds.php`, `items.php` – list groups, feeds, and items.
- `feeds-alpha.php` – alphabetical index.
- `links.php` – link lists for hot items.
- `js-initial.php`/`js-reload.php` – bootstrap JavaScript with feed data.
- `xhr.php` – XHR endpoints for partial updates.

### 4.2 Management Views (`views/default/manage`)
- `add-feed.php`, `edit-feed.php`, `delete-feed.php` – CRUD pages for feeds.
- `add-group.php`, `edit-group.php`, `delete-group.php` – group management.
- `import.php`, `export.php` – OPML import/export forms.
- `preferences.php` – user preferences form.

### 4.3 Installation (`views/default/install`)
- `activation.php`, `database.php`, `configuration.php`, `existing.php`, `info.php`, `eula.php` – setup wizard screens.

### 4.4 Feedlet / Bookmarklet (`views/default/feedlet`)
- `login.php` – login form when using the bookmarklet.
- `bookmarklet.php` – script inserted into browsers for quick subscribing.

### 4.5 Mobile Views (`views/mobile`)
Mirrors the desktop structure with simplified layouts for phones: `reader.php`, `feedlet.php`, `manifest.php`, plus subfolders `page`, `reader`, `scripts`, and `styles`.

Each view expects variables prepared by `Fever` (feeds, groups, items) and relies on shared scripts (`fever.js`, `reader.js`) for interaction.

## 5. Workflow Summary

1. **Installation** – Visit `boot.php` which checks server requirements, then follow the installer views to configure the database and activation key. After setup, `firewall/config/db.php` and `key.php` hold credentials.
2. **Authentication** – Users log in via `route_auth()` which validates credentials stored in `_config`. Successful login sets session data used by `is_logged_in()`.
3. **Reading Feeds** – The reader (`route_reader`) loads groups, feeds, and items. AJAX requests periodically fetch updates via `route_api()` or `route_refresh()`.
4. **Managing Feeds** – `route_manage()` serves pages for adding/editing feeds and groups, importing OPML, and adjusting preferences.
5. **Refreshing** – `route_refresh()` triggers feed fetch logic. Cron jobs or manual actions call `refresh()` which uses `request.php` to retrieve RSS/Atom data, parses it with SimplePie and `OMDOMDOM`, and stores new items.
6. **Caching Favicons** – `route_favicons()` and `cache_favicon()` download and cache site icons for display beside feeds.
7. **Uninstall/Reset** – `safety-unlace.php` and `safety-reboot.php` provide recovery scripts when normal uninstallation via `route_uninstall()` fails.

This overview should help new developers understand how the legacy PHP portion of the project is organized and how each part interacts. For the modern Next.js implementation, see the documentation in `fever-next/` and `the-plan.md`.

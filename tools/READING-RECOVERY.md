# Reading recovery (A + B + C)

This repository owns these small adapters; do not edit `themes/next` or `node_modules`. Supported upstream: NeXT **v8.27.0**, LocalSearch/searchdb client **1.5.0**, Hexo **8.1.2**, Node **24**. Keep the paired repository in sync, except localized page content.

## A — Search shell

- Entry: `scripts/search-ui.js`. Labels: `lib/search-ui-labels.cjs`.
- Templates: `templates/search-dialog.njk`, `search-loader.njk`, `search-menu.njk`, `search-brand.njk`.
- Browser adapter: `source/js/search-ui.js`; styles: `source/_data/search-ui.styl`.
- Native dialog/focus handling, explicit statuses, one in-flight JSON fetch, 15-second timeout, retry preserving the query. CDN failure keeps archive navigation and offers a page reload. No preload, persistence or analytics.
- The existing client still owns matching, snippets and highlighting. The adapter mirrors its record normalization and result ordering. Do not replace these with a new search algorithm.
- Important Hexo/Nunjucks detail: filesystem `include` bypasses `theme.setView`, whereas Hexo `partial` uses it. The entry point reads upstream `_third-party/index.njk` and replaces exactly its LocalSearch include with an owned partial. It fails if that upstream marker changes. Every other include stays intact.
- The original theme controller remains on disk but is **not loaded**. Never load it alongside the adapter.
- Search buttons are hidden until initialized. The ordinary archive fallback remains available without JavaScript or if the adapter fails to load.
- Escape is handled before Chrome's search-input clear action, but not during IME composition. A stale native close event after immediate reopening must not remove the new modal's scroll lock.

## B — Recovery page

- `source/404/index.md` produces exactly `public/404.html` in each repository, with the English site's public URL under `/en/`.
- Entry: `scripts/not-found.js`; pure helper: `lib/not-found.cjs`; styles: `source/_data/not-found.styl`.
- The helper recognizes NeXT's generated page path `404.html`, removes only that page's canonical, language alternatives, social/article metadata and previous robots tag, then adds `noindex,follow`. Ordinary pages are returned byte-for-byte.
- `sitemap: false`, no comments, no redirects, no reflection of the failed address into HTML. Use normal root-relative links that work at arbitrary missing-path depth.
- A direct request for the existing 404 resource can be 200. An unknown route must remain HTTP 404. Real GitHub Pages root/project error-page selection requires a separate post-deployment check; a local server is not proof of that routing.

## C — Section links

- Entry: `scripts/section-links.js`; pure helper: `lib/section-links.cjs`; styles: `source/_data/section-links.styl`.
- Inserts into final full-article HTML only, using source offsets from htmlparser2. No Markdown or whole-document serialization. Existing nonempty H2/H3 IDs are retained; links have localized accessible names and decorative SVGs.
- No H1, snippets, feed/search contents, legacy comments or code blocks are enhanced. IDs are not regenerated. Conflicts fail loudly; an existing empty ID is skipped with a warning.
- Links are ordinary anchors, work without JavaScript, remain discoverable on touch/keyboard, and are hidden in print. There is no new browser script for this feature.

## Validation

Run the existing commands: `npm run check`, `npm run validate:reading`, `npm run validate:discovery`, `npm run validate:links`, `npm run validate:quality`.

The last command also invokes `tools/test-recovery.cjs` and `tools/validate-recovery.cjs`. Those check the adapters' fixtures, the single controller/dialog, 404 exclusions and section-link targets. Preserve the assertions when adding future features.

Browser/network/performance evidence for the first implementation is kept outside the repositories in the shared workspace's `review/reading-recovery-2026-09-13/`. Real screen readers, OS IMEs, mobile keyboards and live hosting still require human/device validation.

## Scoped rollback

A, B and C have separate entry points and style imports at the end of `source/_data/styles.styl`. Review the diff and revert only the chosen feature's new files/imports and its corresponding validation assertions. A rollback of A restores the upstream search templates/controller; B needs both its page and its head filter removed together; C needs its HTML filter removed and a clean rebuild. Do not reset the repository, change article data, touch comments or roll back unrelated commits. A full rollback removes only this batch's new files and the two small integration edits (style imports and validation hooks).

A commit, push or deployment always requires the author's separate approval.

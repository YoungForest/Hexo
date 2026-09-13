# Reading quality tools

This is presentation work on NeXT Mist v8.27.0, not a new rendering engine.

## Checks

Run after installing locked dependencies and generating the site:

- `npm run check`
- `npm run validate:reading`
- `npm run validate:discovery`
- `npm run validate:links`
- `npm run validate:quality`

The link check only reads this repository's generated HTML/assets. References owned by the other language site are reported as deferred, not assumed valid. Verify both repositories explicitly in a paired local release check. CI does not fetch a neighboring repository or probe external websites.

`npm run report:external-links -- --limit 20 --output external-link-review.json` is an optional manual report, not a scheduled or CI blocking task. It extracts published article links, limits requests (including redirects), and only issues public HTTP(S) HEAD requests. No cookies, forms, credential URLs or private-network targets. DNS results are validated and pinned for the request; redirects are revalidated. 403/429/network failures are inconclusive; 404/410 still require context review. Do not commit reports containing unnecessary reader/account information.

## Shared responsive photographs

`source/_data/responsive-media.json` is mirrored in both repositories. Original files and generated WebP assets belong only to the Chinese repository. The English repository reads only its own manifest and emits main-root resource URLs.

In the Chinese repository only, `npm run media:generate` uses pinned Sharp 0.35.4 to generate 480/960/1600-width WebP files, without enlargement/cropping or rewriting originals. It is an explicit offline command, not an install/build hook. Source hashes, output hashes, dimensions and processing parameters determine reuse. Inputs/parameters changed or corrupt/missing derivatives are regenerated; old unused outputs are not silently deleted.

After generation:

1. Inspect every changed photo at phone and desktop sizes and check orientation/detail.
2. Set technical review status only after those checks. Author approval is separate.
3. Mirror the small manifest to the English repository.
4. Build/check both independently; then verify every cross-site original and derivative from both outputs.
5. Publish Chinese assets and verify availability **before** publishing English references, only after author authorization.

The display helper patches only whitelisted image tags at page rendering. `post.content`, Markdown, Atom, search content, hero images and share metadata are not rewritten. Original source URLs remain fallback `src` plus a localized ordinary original-file link.

## Copying, skip navigation and printing

Keep the vendor copy button disabled. `source/js/reading-tools.js` creates native buttons outside code blocks, copies decoded text and line breaks without gutters, and excludes empty/plain pre, Mermaid and archived comments. Clipboard rejection has visible manual-copy instructions. Without JavaScript the original code remains selectable.

The page-shell filter adds a first-focus skip link to the content container, not the main container which includes navigation. It preserves existing IDs and uses native navigation. A narrowly scoped initial-fragment alignment corrects reload offsets changed by code toolbars; it does not intercept clicks or back/forward navigation.

Paper styles live only in `@media print`; no print button/service. Print sources keep the canonical URL and author. Explicitly hide the sidebar dimmer at paper widths: desktop sidebar state otherwise causes gray overlays in PDFs. Allow code/table pagination and wrap long lines. The checked Chrome samples load native lazy images during direct printing without an extra eager-download hook.

Regression fixture and the full two-site evidence are kept outside the published repository in the workspace's `review/quality-next-2026-09-12/` directory. They must not become posts or feed/search entries. Browser compatibility and actual screen-reader checks require separate coverage; keyboard or automated checks alone are not a screen-reader certification.

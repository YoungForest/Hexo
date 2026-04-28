# Copilot / AI Assistant Instructions for YoungForest's Hexo Blog

This repository hosts the source of <https://youngforest.github.io>, built with **Hexo 8** + the **NeXT** theme. The site is bilingual-leaning (mostly 简体中文, occasional English). Use these conventions when generating, editing, or reviewing content.

## Repository layout

- `source/_posts/` — published posts (Markdown).
- `source/_drafts/` — drafts (will not be rendered unless promoted).
- `source/_data/`, `source/about/`, `source/categories/`, `source/tags/` — static pages and theme data.
- `scaffolds/` — `hexo new <layout> "title"` templates: `post.md`, `page.md`, `draft.md`, `book.md`.
- `_config.yml` — Hexo core config. `_config.next.yml` — NeXT theme overrides.
- `themes/next/` — NOT committed; cloned during CI from `next-theme/hexo-theme-next`, pinned in `.github/workflows/deploy.yml`.
- `.github/workflows/deploy.yml` — single CI workflow that builds and deploys to the `youngforest.github.io` repo on every push to `master`.

## Filename and front-matter conventions

- New post filenames use kebab-case derived from the title, e.g. `Why-Nations-fail.md`. For Chinese titles, romanize or use the English title (see `source/_posts/Shi-Nan-Zhi-Tu.md` for pinyin pattern).
- Required front-matter for every post: `title`, `date`, `tags`, `categories`.
- `date` follows `YYYY-MM-DD HH:mm:ss` in `Asia/Shanghai` timezone (CI sets this).
- Post URLs are `/:year/:month/:day/:title/` — changing the date or filename of a published post breaks links, **don't do it casually**.
- Tag and category values are written as YAML list items (one per line with `-`), not inline arrays.

## Categories taxonomy (use existing ones — don't invent new ones lightly)

Verified in use:

- `读后感` — book reviews (companion tag: `Reading`).
- `dairy` *(sic — kept for URL stability, do not "fix" to `diary`)* — life updates, year-end summaries, milestone retrospectives.
- Technology categories (e.g. distributed systems, programming languages) — pick from existing posts when adding similar content.

If a new category is genuinely needed, ask the author first.

## Writing style

- **Voice**: first-person 中文，口语化、坦率，常带自嘲。English is sprinkled in for technical terms or quotes. Don't sanitize or formalize this.
- **Length**: book reviews are typically 300–1500 字; technical posts can be longer. Concise > padded.
- **Structure**: short paragraphs, frequent block-quotes (`>`) for source excerpts, occasional `##` headings only when content warrants them. Many posts have no headings at all — that's fine.
- **Links**: external links are auto-opened in new tabs (configured in `_config.yml`). Always prefer permanent URLs (Douban subject pages, Wikipedia, original sources) over short-lived links.
- **Cross-linking**: when relevant, link to the author's other posts via `/YYYY/MM/DD/slug/` paths so they survive site rebuilds.
- **No fabrication**: never invent quotes, page numbers, or facts about a book. If you don't have a quote, leave the `> ` block empty for the author to fill in.

## Book reviews specifically

- Use `hexo new book "Book Title"` (uses `scaffolds/book.md`) so the structured `book:` front-matter is included. The `book:` block is not currently rendered by the theme but is preserved for future use (bookshelf page, structured data, etc.).
- Always include a 豆瓣 link near the top of the body: `[豆瓣链接](https://book.douban.com/subject/<id>/)`.
- Tag pattern: `Reading` + the book title (Chinese or English) + optional author/topic tags. Category: `读后感`.
- If a Douban MCP server is configured (see `astron-douban-mcp`, `moria97/douban-mcp`, etc.), AI assistants should fetch real metadata from the provided Douban URL/ISBN to fill `book.author`, `book.publisher`, `book.pages`, `book.cover`, etc. — never guess.

## Build, test, deploy

- `npm install` then `npm run server` for local preview at <http://localhost:4000>.
- `npm run clean && npm run build` to regenerate `public/`. **Do not commit `public/` or `db.json`** — both are gitignored.
- The NeXT theme is not vendored; locally clone it once: `git clone https://github.com/next-theme/hexo-theme-next.git themes/next` (use the same tag as `THEME_REF` in `deploy.yml` for consistency).
- Pushing to `master` triggers the deploy workflow, which builds and pushes the rendered site to the `youngforest.github.io` repository's `master` branch.

## Things to avoid

- Don't change permalinks, post filenames, or post dates of already-published posts (breaks URLs, RSS, and inbound links).
- Don't add new dependencies to `package.json` unless they replace something or are strictly required — Hexo plugin churn is a known headache.
- Don't enable `render_drafts` or `future: true`-dependent behavior without flagging it.
- Don't commit secrets, the `.deploy_git/` working tree, or the rendered `public/` output.
- Don't translate or rewrite existing posts to "improve" them — the author's voice is intentional.

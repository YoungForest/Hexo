# Hexo source for [youngforest.github.io](https://youngforest.github.io)

Personal blog source built with [Hexo 8](https://hexo.io/) + the [NeXT](https://github.com/next-theme/hexo-theme-next) theme. The rendered site lives in a separate repo, [`youngforest.github.io`](https://github.com/YoungForest/youngforest.github.io), and is deployed automatically by GitHub Actions on every push to `master`.

## Quick start (local preview)

```shell
npm install -g hexo-cli
git clone https://github.com/YoungForest/Hexo.git
cd Hexo
npm install
# Theme is not vendored. Pin the tag in lockstep with .github/workflows/deploy.yml
git clone --depth 1 --branch v8.27.0 https://github.com/next-theme/hexo-theme-next.git themes/next
npm run server   # http://localhost:4000
```

## Common tasks

| Task | Command |
| --- | --- |
| Start dev server with live reload | `npm run server` |
| Clean generated output | `npm run clean` |
| Build static site into `public/` | `npm run build` |
| Manually deploy (CI does this for you) | `npm run deploy` |
| Create a new normal post | `npx hexo new post "Post Title"` |
| Create a new book review | `npx hexo new book "Book Title"` |
| Create a draft (won't publish) | `npx hexo new draft "Idea"` |
| Promote a draft to a post | `npx hexo publish "Idea"` |

Scaffolds live in `scaffolds/` — `post.md` for general posts, `book.md` for structured book reviews (used together with the `读后感` category).

## How a post becomes a deployment

1. You push a commit to `master` on this repo.
2. `.github/workflows/deploy.yml` runs on `ubuntu-latest` with Node 20:
   - Checks out this repo, the pinned NeXT theme (`THEME_REF` env), and the deploy target repo.
   - Installs npm deps, then runs `npm run deploy` which calls `hexo generate` + `hexo-deployer-git`.
   - The generated `public/` is force-pushed to the `master` branch of `youngforest.github.io`, served by GitHub Pages.

The deploy SSH key is stored as the `HEXO_DEPLOY_PRI` repo secret.

## Layout cheat sheet

```
source/
  _posts/        published posts (kebab-case filenames)
  _drafts/       drafts (not rendered until published)
  _data/         theme data (e.g. custom <head>)
  about/         about page
  uploads/       images and assets used in posts
  ads.txt        Google AdSense verification
scaffolds/       templates used by `hexo new`
themes/next/     NeXT theme (not committed; cloned at build time)
_config.yml      Hexo core config
_config.next.yml NeXT theme config overrides
.github/
  workflows/     CI (single deploy.yml)
  copilot-instructions.md  conventions for AI assistants
```

## Conventions

The full set of conventions for writing posts, naming files, choosing tags/categories, and using AI assistants to draft book reviews lives in [`.github/copilot-instructions.md`](.github/copilot-instructions.md). Keep it in sync if conventions evolve.

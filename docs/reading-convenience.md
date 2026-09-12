# Reading convenience components

These components extend NeXT Mist v8.27.0 through existing controlled templates. Do not edit the vendor theme, article bodies, heading IDs, media, dates, comments or feed configuration to maintain them.

## Mobile table of contents

`lib/mobile-toc.cjs` counts existing H2/H3 headings with Hexo's `tocObj`; `scripts/discovery.js` renders them using Hexo's existing `toc` helper. The panel is outside `.post-body`, only on post pages, hidden from 768px upward, and appears only with at least four valid headings. `toc: false` or `toc: { enable: false }` opts out. Author opt-outs are captured before NeXT merges page locals. An empty/invalid heading never gets an invented anchor.

Native `details`, links and CSS remain usable without JavaScript. `source/js/reading-tools.js` only closes the panel before native fragment navigation; it must not replace history, rewrite hashes or intercept other links. The panel remains below the original sidebar/dimmer in the stacking order. CSS reserves target space for both the collapsed and no-JS expanded panel.

## Related reading

Add optional ordered references in `source/_data/discovery.yml`, keeping `version: 1`:

```yaml
related_reading:
  - post: my-3-years-master
    next:
      - my-4-years-college
      - Find-a-Europe-SDE-job-from-China
```

Use one or two existing published slugs. Titles, descriptions, dates and links come from this repository's article models; do not duplicate them or add explanations to the manifest. Missing sources/targets, drafts, self-links, duplicate sources/targets and blank target descriptions fail validation. No reverse relation is inferred. Annual-series navigation has precedence. Unconfigured articles retain chronological navigation. The initial selection contains eight source articles per site.

`templates/related-reading.njk` replaces only the original post navigation position, not comments, copyright or reward blocks. Recommendations remain outside author prose.

## Subscription page

`source/subscribe/index.md` is an ordinary page, not a post. It provides both existing Atom addresses, with the local language first. Menu and `follow_me` point to this page; `social.RSS` still points directly to the feed. Do not change the feed's 20 entries, ordering, IDs or content settings.

Copy buttons are hidden until enhanced by `reading-tools.js`. Both successful copy and denied/unavailable Clipboard API have localized live feedback; the full visible address is selectable. `<wbr>` adds a wrapping opportunity without changing the address text. No email collection, external widget, analytics event or publishing schedule is introduced.

Compatibility note: hexo-generator-feed 4.x checks the entire rendered HTML for an Atom `type` attribute. Adding `type="application/atom+xml"` to a body link would incorrectly suppress its head autodiscovery tag. Keep the card links as ordinary anchors; validation checks that the head link remains present.

## Checks before sharing

Run from this repository (Node 24):

```text
npm run check
npm run validate:reading
npm run validate:discovery
```

The discovery checks include optional-data fixtures, TOC boundaries/Unicode/duplicate titles/opt-out, annual precedence, all generated article anchors, local recommendation metadata, subscription paths, language links and feed discovery. Validate Chinese `/` and English `/en/` independently; no sibling checkout is needed.

For UI changes also check 320/390/768/1280px, keyboard, 200% reflow, reduced motion, disabled JavaScript, clipboard denial and hash history. Compare original source/assets/comments and Atom entries, keep new CSS/JS within 5KB gzip, and compare equivalent mobile performance runs. The task's screenshots and verification reports are held outside the repository in its local review directory.

Commit, push and deployment each require the author's approval. This feature does not authorize changing personal writing or implementing the deferred backlog.

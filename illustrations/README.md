# Editorial illustrations

`editorial-comic-v1` is the shared visual system for the Chinese and English
blogs. Art is proposed, reviewed, and compressed before a manifest can move to
`approved`.

## Visual language

- Confident ink lines, restrained flat colour, warm-grey paper texture.
- Charcoal outlines with amber highlights and muted teal accents.
- A lightly humorous editorial metaphor that remains readable on a phone.
- No readable in-image text, logos, trademarks, real book covers, celebrity
  likenesses, or invented technical interfaces.
- The fictional Forest character (short dark hair, round glasses, charcoal
  overshirt, muted teal T-shirt) is reserved for first-person work and life
  stories. It is an illustration character, not a portrait of the author.

Chinese and English images share the visual system but are generated separately
so their settings and cultural cues can differ.

## File contract

- Final format: sRGB WebP, exactly `1536x864`.
- Target size: `<= 200000` bytes; hard limit: `250000` bytes.
- Files live under `source/images/ai/<slug>/`.
- A manifest named `illustrations/<slug>.yml` records context, placement, alt
  text, prompt notes, and review status.
- `illustrations/catalog.yml` is the generated cross-post index used to count
  completed work and prevent duplicate selection; per-post manifests remain
  the source of truth.
- Only assets with `review_status: approved` may be referenced by a post.

Use this markup for a hero:

```html
<figure class="editorial-illustration editorial-illustration--hero">
  <img src="/images/ai/post-slug/zh-hero.webp" alt="有意义的中文替代文本" width="1536" height="864" decoding="async">
</figure>
```

Use this markup for an inline transition illustration:

```html
<figure class="editorial-illustration">
  <img src="/images/ai/post-slug/zh-section.webp" alt="有意义的中文替代文本" width="1536" height="864" loading="lazy" decoding="async">
</figure>
```

## Workflow

1. Summarize the exact surrounding passage without rewriting it.
2. Write one composition concept and one localized alt text per asset.
3. Generate one candidate; create a contact sheet grouped by article.
4. Keep candidates under `review/` and `review_status: candidate` until the
   author accepts the image. Candidate files are not part of the published
   `source/` tree.
5. Convert the accepted image to the file contract above and set its status to
   `approved` before inserting the figure into Markdown.
6. Rejected images are regenerated with one targeted prompt change.

## Backlog audit

Before proposing another legacy-post batch, consult
`../../../review/editorial-comic-backlog.yml`. It records intentionally skipped
posts and paused redraws so they are not selected repeatedly. Per-post manifests
and `catalog.yml` remain the source of truth for completed artwork.

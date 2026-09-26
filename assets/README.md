# Assets: artwork, images and social cards

Everything in `public/images`, `public/favicon.ico`, `public/apple-touch-icon.png` and
`public/icons/` is generated from the specs in this folder. Nothing is hand-edited in `public/`.

---

## Generate everything

```bash
npm run images:build          # uses existing masters
FORCE_MASTERS=1 npm run images:build   # regenerate the masters too
```

Requires ImageMagick (`convert` + `identify`) and the DejaVu fonts. **Run this locally** — the
deploy workflow does not regenerate artwork: ImageMagick is not installed on the current
`ubuntu-latest` runner image, and the committed files are the ones reviewed in the pull request.
Commit the regenerated assets along with the change that prompted them. If a required image is
missing from the build, `npm run seo:check` and the deploy workflow both fail.

Output:

| Path | What it is |
| --- | --- |
| `public/images/profile/george-s-thomas-{320,480,960}.{avif,webp,jpg}` | Profile / identity image, responsive |
| `public/images/brand/nkt-group-logo-{128,256,512}.png` | Organization logo (also schema `logo`) |
| `public/images/brand/site-icon-{96,192,512}.png` | Monogram app icons |
| `public/images/brand/{logo-lockup,monogram}.svg` | Vector brand marks |
| `public/images/generated/*.svg` | Technical diagrams used in articles |
| `public/images/og/*.jpg` | 19 Open Graph / Twitter cards at 1200×630 |
| `public/favicon.ico`, `apple-touch-icon.png`, `icons/maskable-512.png` | Favicons and PWA icons |

---

## Replacing the placeholder portrait (do this first)

`assets/masters/profile-identity.png` is a **generated placeholder** that says so on its face. It
is not a photograph of anyone. To replace it:

1. Crop a real portrait to a square, at least 960×960, well lit, plain background.
2. Save it as `assets/masters/profile-identity.png` (or `.jpg` — then update `master` in
   `images.json`).
3. Run `npm run images:build`.
4. Update the alt text if the subject matter changed:
   - `src/lib/images.ts` → `IMAGE_MANIFEST.profilePortrait.alt`
   - `src/lib/site.ts` → `PERSON.imageAlt`
5. Rebuild and run `npm run seo:check`.

The portrait appears on the homepage (LCP image → it gets `fetchPriority="high"`), on `/about/`,
in the author card, and in the Person/ProfilePage structured data.

## Replacing the organization logo

Same flow with `assets/masters/nkt-group-logo.png` (square, ≥512×512, transparent or dark
background). Keep `public/images/brand/nkt-group-logo-512.png` on a dark background — it is used
as the Organization `logo` in structured data and Google renders logos on white.

---

## Social cards

`og-cards.json` holds one entry per page: `out` (path under `public/`), `eyebrow`, `title`,
`subtitle` (one line, truncated at the first line break) and `footer`. Cards are rendered on a
dark technical grid with the `THOMU // OPERATOR` wordmark so they are recognisable in a timeline.

When you add a page, add its card here **and** reference it in that page's `buildMetadata({ ogImage })`
call. `npm run seo:check` fails if a referenced image does not exist.

---

## Notes and limits

- **ImageMagick 6 vs 7:** the scripts call `convert`. On IM7 systems, `magick` is preferred — if
  `convert` is absent, symlink it or adjust `magick()` in `scripts/lib/im.mjs`.
- **SVG rasterisation is not used.** Some minimal installs (including this sandbox) lack
  `rsvg-convert`, so all raster assets are composed from drawing primitives instead — this is why
  the generator never delegates an SVG to ImageMagick. Hand-written SVGs are shipped as-is.
- **Fonts:** only DejaVu is guaranteed to be present, so text baked into raster assets uses it.
  This affects generated artwork only — the website itself uses a system font stack.
- **Determinism:** the generator is deterministic. Re-running it on a clean checkout produces
  byte-identical output, which keeps diffs and reviews honest.

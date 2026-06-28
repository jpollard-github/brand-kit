# Social Generator

First web/social output generator set for the brand kit.

## Command

```bash
npm run brand:og
npm run brand:linkedin
npm run brand:github-social
npm run brand:verify:social
```

These outputs derive from the same shared hero-composition helper and currently default to the `ArcadeGhosts Hero` scene.

## Current Output

- `generators/outputs/social/arcadeghosts-og-image.svg`
- `generators/outputs/social/arcadeghosts-og-image.png`
- `generators/outputs/social/arcadeghosts-og-image.manifest.json`
- `generators/outputs/social/arcadeghosts-linkedin-banner.svg`
- `generators/outputs/social/arcadeghosts-linkedin-banner.png`
- `generators/outputs/social/arcadeghosts-linkedin-banner.manifest.json`
- `generators/outputs/social/arcadeghosts-github-social.svg`
- `generators/outputs/social/arcadeghosts-github-social.png`
- `generators/outputs/social/arcadeghosts-github-social.manifest.json`

This first pass is intentionally simple:

- OG-sized canvas (`1200 x 630`)
- logo-led composition
- atmospheric dark background
- title, kicker, subtitle, and canonical site URL
- editable SVG source plus ready-to-use PNG export
- per-output manifest files with brand, theme, scene, dimensions, output paths, and readiness metadata
- preflight checks for dimensions, rendered display URL, asset existence, output completeness, and LinkedIn safe-area notes
- shared hero-composition scene data for OG, LinkedIn, and GitHub exports

## GitHub Social

The GitHub social generator targets `1280 x 640` so repositories, pinned projects, and profile-facing shares can use the same branded hero system without re-composing a separate image by hand.

The goal is to prove the web/social path and keep it visually tied to the same brand tokens as print outputs.

## LinkedIn Banner

The LinkedIn banner generator targets `1584 x 396` and reserves the lower-left area visually so the profile-photo overlap does not cover the main message.

## Verification

Use:

```bash
npm run brand:verify:social
```

This checks that the current OG, LinkedIn, and GitHub social manifests exist and that their PNGs, dimensions, display URLs, contact metadata, completeness flags, and safe-area metadata still match expectations.

# Social Generator

First web/social output generator set for the brand kit.

## Command

```bash
npm run brand:og
npm run brand:linkedin
npm run brand:github-social
```

Both generators now derive from the same shared `ArcadeGhosts Hero` scene and hero-composition helper.

## Current Output

- `generators/outputs/social/arcadeghosts-og-image.svg`
- `generators/outputs/social/arcadeghosts-og-image.png`
- `generators/outputs/social/arcadeghosts-linkedin-banner.svg`
- `generators/outputs/social/arcadeghosts-linkedin-banner.png`
- `generators/outputs/social/arcadeghosts-github-social.svg`
- `generators/outputs/social/arcadeghosts-github-social.png`

This first pass is intentionally simple:

- OG-sized canvas (`1200 x 630`)
- logo-led composition
- atmospheric dark background
- title, kicker, subtitle, and canonical site URL
- editable SVG source plus ready-to-use PNG export
- shared hero-composition scene data for both OG and LinkedIn exports
- shared hero-composition scene data for OG, LinkedIn, and GitHub exports

## GitHub Social

The GitHub social generator targets `1280 x 640` so repositories, pinned projects, and profile-facing shares can use the same branded hero system without re-composing a separate image by hand.

The goal is to prove the web/social path and keep it visually tied to the same brand tokens as print outputs.

## LinkedIn Banner

The LinkedIn banner generator targets `1584 x 396` and reserves the lower-left area visually so the profile-photo overlap does not cover the main message.

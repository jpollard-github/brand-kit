# ArcadeGhosts Site Reference

Reference: 2026-06-28 EDT

This file pulls the most useful ArcadeGhosts brand context into `merch/` before this folder is moved and renamed into a separate brand-focused repo.

The goal is simple:

- keep the merch and future brand-generator work grounded in the real website
- preserve the current visual and editorial DNA
- make the future folder move less lossy

## Core Identity

Current site identity from [README.md](/Users/jasonp/repos/personal/README.md):

- `ArcadeGhosts`
- Jason Pollard's personal site and living portfolio
- software projects
- writing
- music
- cats
- arcade nostalgia
- strange little experiments

Useful repeated public phrasing from the site:

- `ArcadeGhosts`
- `strange little experiments`
- `living portfolio`
- `neon forest`
- `signal`
- `signal booth`
- `arcade nostalgia`

These phrases matter because they are not just copy. They are part of the brand system.

## Canonical Site Config

From [app/seo.ts](/Users/jasonp/repos/personal/app/seo.ts):

- site name: `ArcadeGhosts`
- title: `ArcadeGhosts | Jason Pollard`
- description:
  `Jason Pollard's personal site for projects, writing, music, cats, arcade nostalgia, and strange little experiments.`
- url: `https://arcadeghosts.org`
- default OG image path: `/opengraph-image`

Use these as the baseline metadata and summary language for future brand outputs.

## Logo Sources

Primary logo references:

- [public/images/logo.webp](/Users/jasonp/repos/personal/public/images/logo.webp)
- [public/images/logo.png](/Users/jasonp/repos/personal/public/images/logo.png)
- [app/SiteLogo.tsx](/Users/jasonp/repos/personal/app/SiteLogo.tsx)

Current usage notes:

- the website uses `/images/logo.webp` in the fixed site logo
- the logo is visually neon, playful, retro, and character-driven
- it combines mascot energy with synthwave framing

Use the PNG version when print/editor compatibility matters.

## Website Palette

Current global palette from [app/globals.css](/Users/jasonp/repos/personal/app/globals.css):

- `--ink: #f8efe3`
- `--muted: #cbbdae`
- `--dim: #82766d`
- `--black: #08090c`
- `--night: #10131b`
- `--pine: #0d2a25`
- `--red: #ff365f`
- `--teal: #29f0d4`
- `--amber: #ffc66d`
- `--violet: #936cff`
- `--line: rgba(248, 239, 227, 0.18)`
- `--panel: rgba(12, 14, 19, 0.72)`

Interpretation:

- base mood is near-black / dark night gradients
- accents are neon red, teal, amber, and violet
- text is warm off-white, not stark white
- the site favors atmospheric contrast over flat color blocking

This should strongly influence the future `brand/` design tokens.

## Website Atmosphere

Visual direction from [app/globals.css](/Users/jasonp/repos/personal/app/globals.css), [app/page.tsx](/Users/jasonp/repos/personal/app/page.tsx), and hero/OG references:

- dark layered backgrounds
- neon glow accents
- grid texture overlays
- diner / forest / night imagery
- retro-futurist but warm
- mysterious, but not cold
- playful, but not childish

The current site does not feel like:

- generic SaaS
- minimal Swiss corporate branding
- loud meme chaos
- flat monochrome retro kitsch

The future brand-generator should preserve that balance.

## Important Imagery

Strong current image anchors:

- [public/images/neon-forest-diner.webp](/Users/jasonp/repos/personal/public/images/neon-forest-diner.webp)
- [app/home/HomeHero.tsx](/Users/jasonp/repos/personal/app/home/HomeHero.tsx)
- [app/opengraph-image.tsx](/Users/jasonp/repos/personal/app/opengraph-image.tsx)
- [app/og.tsx](/Users/jasonp/repos/personal/app/og.tsx)

These are useful because they define the wider visual world around the logo:

- neon diner
- misty evergreen forest
- signal / broadcast / strange-room feeling
- retro media glow

That mood should inform mugs, stickers, banners, social graphics, and slide themes, not just business cards.

## Typography Direction

The live site currently uses:

- `Inter`
- system UI fallbacks

From the website and business card generator together, the practical typography rules are:

- bold, large display headings
- warm readable body text
- uppercase eyebrow labels
- avoid overly novelty retro fonts unless they are intentionally secondary

For future brand outputs:

- default to readable modern type
- treat overtly retro typography as an accent, not the baseline

## Current Public Brand Surfaces Worth Mirroring

These website surfaces are especially relevant to a future brand generator:

- [app/SiteLogo.tsx](/Users/jasonp/repos/personal/app/SiteLogo.tsx)
- [app/opengraph-image.tsx](/Users/jasonp/repos/personal/app/opengraph-image.tsx)
- [app/work-with-me/page.tsx](/Users/jasonp/repos/personal/app/work-with-me/page.tsx)
- [app/about/page.tsx](/Users/jasonp/repos/personal/app/about/page.tsx)
- [app/home/HomeHero.tsx](/Users/jasonp/repos/personal/app/home/HomeHero.tsx)

Why they matter:

- `SiteLogo` defines the small persistent mark
- `opengraph-image` defines how the brand summarizes itself in shareable media
- `work-with-me` defines the more professional / client-facing tone
- `about` defines the human tone
- the homepage hero defines the environmental mood

## Current ArcadeGhosts Brand Tension

One of the most useful things to preserve is the tension the site already holds well:

- professional enough to be trusted
- personal enough to feel real
- playful enough to be memorable
- atmospheric enough to feel distinctive

That tension is part of the actual product direction for a future `brand-generator`.

## Recommended Migration Inputs

When `merch/` is moved into a sibling `brand/` or `brand-generator/` repo, carry these inputs with it:

- logo assets from `public/images/logo.*`
- color tokens derived from `app/globals.css`
- site config and summary language from `app/seo.ts`
- visual mood notes from the homepage hero and global background system
- current business card generator tokens and outputs
- editorial brand phrases from the homepage / about / work-with-me pages

## Suggested First Brand-System Extractions

Good first extractions for the renamed repo:

1. `design-system/colors.ts`
   Source: `app/globals.css`
2. `design-system/copy.ts`
   Source: `app/seo.ts`, homepage, about, work-with-me
3. `design-system/logo.ts`
   Source: `public/images/logo.*`, `app/SiteLogo.tsx`
4. `design-system/atmosphere.md`
   Source: hero imagery, OG image direction, neon forest notes
5. `design-system/metadata.ts`
   Source: canonical site name, author, URL, descriptions

## Keep In Mind

The future brand generator should not just be "ArcadeGhosts merch."

It should be able to express:

- public creative identity
- practical professional identity
- social sharing identity
- print identity
- event / seasonal identity

That is already how the website behaves. The future repo just needs to make it explicit.

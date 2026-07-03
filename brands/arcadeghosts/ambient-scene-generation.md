# ArcadeGhosts Ambient Scene Generation

Reference: 2026-07-03 EDT

This document is the canonical workflow and master prompt wrapper for generating ArcadeGhosts Ambient Scenes.

Use [visual-language.md](visual-language.md) as the shared source of truth for visual identity.
This file stays focused on Ambient-specific purpose, workflow, category planning, and prompt structure.

It is intentionally independent of any particular AI image model.
The goal is to build one cohesive Ambient Scene Library over months or years, not many unrelated image batches.

Future generation sessions should read `visual-language.md` first, then reuse this document rather than inventing new prompts from scratch.

## Ownership Boundary

- `consulting-business` owns cross-repo workflow strategy, work-order generation, and engineering standards.
- `brand-kit` owns reusable visual language, reusable image-generation guidance, and reusable design guidance.
- ArcadeGhosts owns Ambient implementation, the Ambient Scene Library, manifests, rendering, and review packets.
- ChatGPT acts as art director and image generator.
- Codex acts as importer, WebP converter, manifest updater, validator, and review-packet generator.

Brand Kit is now the canonical home for Ambient Scene generation guidance, while `visual-language.md` is the broader creative source of truth.

## Canonical Prompt

Generate 4 original atmospheric images for the ArcadeGhosts Ambient Scene Library.

### Purpose

These images are permanent Ambient Scenes.

They quietly support:

- Tiny Thoughts
- Now
- Writings
- Projects
- Guestbook
- future Ambient signals

They should never compete with the text.

### Composition

- Landscape
- 16:9
- approximately 1920x1080 or larger
- comfortable negative space
- avoid dominant centered subjects
- optimized for tablet landscape

### ArcadeGhosts Visual Language

- Use the canonical ArcadeGhosts guidance in [visual-language.md](visual-language.md).
- Inherit its mood, lighting, palette, textures, composition philosophy, and avoid list.

### Image Quality

- cinematic
- realistic
- subtle
- high detail
- natural lighting
- not fantasy
- not concept art
- not a stock photo

### Consistency

Every image should feel like part of one long-lived collection.

Imagine Ambient running continuously on a Samsung tablet sitting beside Jason while he codes.

### Category

`<replace>`

### Scene Ideas

`<replace>`

## Generation Workflow

The intended workflow is:

1. ChatGPT loads this master prompt.
2. ChatGPT appends the current category and scene ideas.
3. ChatGPT generates one batch, normally four images.
4. Jason reviews the batch.
5. Jason downloads the images.
6. Codex imports the images into ArcadeGhosts.
7. Codex converts to WebP if needed.
8. Codex updates the manifest.
9. Codex validates.
10. Codex generates an Ambient review packet.
11. Only then move to the next category.

The goal is small reviewed batches rather than generating dozens of images at once.

## Production Options

There are three supported ways to create Ambient Scenes:

### 1. Dedicated image-generation UI

- Use the `brand-kit` master prompt.
- Generate one category at a time.
- Select the best separate `16:9` images manually.
- Best for fast visual exploration.

### 2. API or batch generation

- Future option only.
- Useful for repeatable generation, file naming, prompt metadata, and larger libraries.
- Do not implement yet.

### 3. Photography / curated sources

- Jason may use his own photos, properly licensed images, or hybrid AI/photo sources.
- Treat Ambient Scenes as curated visual material, not disposable placeholders.
- Real photos can include desks, cats, rain windows, lamps, books, street textures, and arcade-like light.

### Practical Guidance

- Do not rely on collage output for production scenes.
- Prefer four separate image files.
- If using ChatGPT image generation, generate one image at a time.
- If using a dedicated image tool, generate batches but import only selected images.
- `brand-kit` owns prompt and art direction, not the actual image files.

## Current Planned Categories

- Cozy Desks
- Warm Lamps & Shadows
- Rain On Windows
- Night Skies
- Moonlit Lakes
- Misty Forests
- Arcade Glow
- CRT Reflections
- Vinyl & Headphones
- Books & Notebooks
- Cat Silhouettes
- Atmospheric City Streets

## Future Evolution

Keep one evolving master prompt structure here, but do not duplicate shared style guidance that belongs in `visual-language.md`.

Likely future refinements include:

- composition guidance
- stronger negative-space rules
- tablet-specific refinements
- seasonal collections
- weather collections
- holiday collections

Maintain one Ambient prompt structure here and one shared visual canon in `visual-language.md`.

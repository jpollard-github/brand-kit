# Repo Map

This is the quickest orientation guide for the `brand-kit` repository.

## Top-Level Folders

### `brands/`

Brand-specific source material.

Use this for:

- brand reference notes
- copy
- workflows
- assets that belong to one brand

Current active brand:

- `brands/arcadeghosts/`

### `design-system/`

Shared reusable code-level brand system.

Use this for:

- palettes
- typography
- metadata
- scenes
- guardrails
- theme variants
- brand registration/config

If something should eventually work across multiple brands or generators, it probably belongs here.

### `generators/`

Output-family generator implementations.

Each subfolder is usually one family such as:

- `social/`
- `stickers/`
- `mugs/`
- `documents/`
- `preview/`

Generated artifacts land in:

- `generators/outputs/`

Treat `generators/outputs/` as local build output, not canonical source.

### `docs/`

Cross-cutting documentation that is not specific to one generator family.

Good candidates:

- repo orientation
- add-a-brand docs
- add-a-generator docs
- vendor handoff guidance

### `integrations/`

Tracked examples plus ignored local machine integration config.

Use this for:

- local repo paths
- website handoff mappings
- machine-specific overrides

### `archive/`

Historical material that is worth keeping but is not active source of truth.

This is for reference and recovery, not for current implementation decisions unless something is intentionally being revived.

### `tests/`

Automated tests.

Current focus:

- `tests/unit/` for design-system and helper logic

### `vschats/`

Historical conversation/context artifacts from earlier work.

Useful for archaeology, not for current source of truth.

## Best Starting Points

If you are new to the repo, start in this order:

1. [README.md](../README.md)
2. [TODO.md](../TODO.md)
3. [brands/arcadeghosts/README.md](../brands/arcadeghosts/README.md)
4. [brands/arcadeghosts/what-makes-arcadeghosts.md](../brands/arcadeghosts/what-makes-arcadeghosts.md)
5. [design-system/brand-config.ts](../design-system/brand-config.ts)
6. [generators/social/hero-composition.ts](../generators/social/hero-composition.ts)

## Mental Model

The repo works best when you think in this order:

1. Brand context lives in `brands/`
2. Shared reusable rules live in `design-system/`
3. Output-specific rendering logic lives in `generators/`
4. Generated review artifacts live under `generators/outputs/`

# Add A New Brand

Use this when `brand-kit` starts supporting another real brand beyond ArcadeGhosts.

## Goal

A new brand should slot into the existing system without replacing ArcadeGhosts or breaking shared generators.

## Recommended Steps

1. Create a new folder under `brands/<brand-id>/`.
2. Add brand assets, reference notes, copy, and workflow notes there.
3. Add a new brand config file under `design-system/brands/<brand-id>.ts`.
4. Register that brand in [design-system/brand-config.ts](../design-system/brand-config.ts).
5. Define:
   - palette
   - typography
   - metadata
   - scenes
   - logo config
   - guardrails
   - themes
6. Test at least one scene-driven generator and one non-scene generator.
7. Add brand-specific docs only when they add real value.

## Suggested Brand Folder Shape

Typical structure:

- `brands/<brand-id>/README.md`
- `brands/<brand-id>/site-reference.md`
- `brands/<brand-id>/what-makes-<brand-id>.md`
- `brands/<brand-id>/theme-variants.md`
- `brands/<brand-id>/assets/`
- `brands/<brand-id>/copy/`
- `brands/<brand-id>/workflows/`

## New Brand Checklist

- canonical domain is correct
- contact data is correct
- logo assets resolve correctly
- scenes are meaningful, not copied blindly from ArcadeGhosts
- guardrails describe the new brand clearly
- theme variants still feel like the same brand
- preview generation works

## Best Starting References

Model the first pass on:

- [brands/arcadeghosts/README.md](../brands/arcadeghosts/README.md)
- [design-system/brands/arcadeghosts.ts](../design-system/brands/arcadeghosts.ts)
- [brands/arcadeghosts/what-makes-arcadeghosts.md](../brands/arcadeghosts/what-makes-arcadeghosts.md)

## Warning

Do not over-generalize too early.

If supporting a second brand reveals awkward assumptions, prefer small design-system improvements over large speculative abstraction passes.

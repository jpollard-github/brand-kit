# Add A New Output

Use this when adding a new generator family or a new output inside an existing family.

## Goal

A good new output should:

- derive from existing brand config where possible
- reuse shared scenes/tokens instead of hard-coding brand decisions
- write to `generators/outputs/`
- be documented and discoverable
- show up in preview/review workflows if it matters for day-to-day use

## Recommended Steps

1. Decide whether the output belongs to an existing family or needs a new `generators/<family>/` folder.
2. Decide whether it should derive from:
   - `ArcadeGhosts Hero`
   - `Work With Me Hero`
   - direct brand palette/metadata only
3. Create the generator entry file.
4. Write outputs into `generators/outputs/<family>/`.
5. Add or update the family README under `generators/<family>/README.md`.
6. Add an npm script in [package.json](../package.json).
7. Add it to preview workflows if it is part of the regular review surface.
8. Update [docs/vendor-handoffs.md](vendor-handoffs.md) if there is a real handoff story.
9. Update [README.md](../README.md) and [TODO.md](../TODO.md) if the new output changes repo capabilities or priorities.
10. Add tests if the output adds reusable logic or new design-system helpers.

## Use Existing Patterns

If the output is scene-driven, start from:

- [generators/social/hero-composition.ts](../generators/social/hero-composition.ts)

If the output is more merch-like and palette-driven, review:

- [generators/stickers/generate-stickers.ts](../generators/stickers/generate-stickers.ts)
- [generators/mugs/generate-mugs.ts](../generators/mugs/generate-mugs.ts)
- [generators/shirts/generate-shirts.ts](../generators/shirts/generate-shirts.ts)

## Output Checklist

- output name is predictable
- output files land in the right `generators/outputs/<family>/` folder
- the generator respects brand config
- theme support is added if it should participate in theme previews
- preview integration is added if the output matters in regular review
- docs are updated

## When Not To Add A Generator Yet

Do not add a generator just because an output sounds possible.

Wait if:

- the visual contract is still unclear
- the output is still exploratory enough to belong in `archive/`
- the output would mostly duplicate another scene export with no real workflow value

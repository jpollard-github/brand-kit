# Brand Kit

This repository is a generator-based brand toolkit for ArcadeGhosts and related merchandise work.

## Current approach

- Keep source copy, assets, and generator logic in version control.
- Generate print and export artifacts locally from the included generators.
- Treat generated outputs as local build artifacts rather than source files.
- Preserve the current ArcadeGhosts business-card workflow as the first working brand implementation.

## Brand-agnostic direction

The repo is now structured to support a shared design-system layer that can be reused across multiple brands and output types.

- Brand configuration lives under the design-system folder.
- The current ArcadeGhosts brand is preserved as the default brand.
- Brand-specific reference material lives under the brands folder, with a dedicated ArcadeGhosts folder for the current implementation.
- Future brands can be introduced by adding brand config and copy data without replacing the current workflow.

## Output-agnostic direction

The generator entry points are now set up to be more general than business cards alone.

- Current command: npm run brand:business-cards
- Mug command: npm run brand:mugs
- Shirt command: npm run brand:shirts
- Preview command: npm run brand:preview
- Generator implementations live under the generators folder, with business cards as the first generator family.
- Additional output-oriented commands can be introduced as new generators are added.

## Generated outputs

Generated files such as export images, PDFs, and manifest files are intentionally ignored by Git so the repo stays focused on source assets and instructions.

More documentation will be added here as the system evolves.

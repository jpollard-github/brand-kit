# Website Generator

Website-facing exports that derive from the shared brand scenes.

## Command

```bash
npm run brand:website-hero
npm run brand:website-handoff
```

## Current Output

- `generators/outputs/website/arcadeghosts-website-hero.svg`
- `generators/outputs/website/arcadeghosts-website-hero.png`
- `generators/outputs/website/website-handoff/`

This first pass is a wide website hero export derived from the same `ArcadeGhosts Hero` composition used by the OG and LinkedIn generators.

## Manual Handoff

The website handoff command stages the current website-facing assets into a single folder with a manifest and checklist.

That keeps the current approach explicit:

- generate assets here
- copy them into the website repo intentionally
- avoid direct repo-to-repo coupling until the asset contract feels stable

## Local Config

Use:

- tracked example: `integrations/website-handoff.example.json`
- ignored local config: `integrations/website-handoff.local.json`

The local config is where machine-specific repo paths and destination mappings belong. If it is missing, the handoff command still stages the assets here and tells you what still needs to be configured before copying anything into another repo.

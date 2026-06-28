# Icon Generator

Use this generator for favicon and app-icon style assets.

## Command

```bash
npm run brand:icons
npm run brand:verify:icons
```

## Outputs

- `generators/outputs/icons/arcadeghosts-icon.svg`
- `generators/outputs/icons/arcadeghosts-icon-512.png`
- `generators/outputs/icons/arcadeghosts-icon-192.png`
- `generators/outputs/icons/arcadeghosts-apple-touch-icon.png`
- `generators/outputs/icons/arcadeghosts-favicon-32.png`
- `generators/outputs/icons/arcadeghosts-icons.manifest.json`

## What To Upload

- Primary scalable source:
  `arcadeghosts-icon.svg`
- PWA / manifest:
  `arcadeghosts-icon-192.png`, `arcadeghosts-icon-512.png`
- Apple touch icon:
  `arcadeghosts-apple-touch-icon.png`
- Small favicon fallback:
  `arcadeghosts-favicon-32.png`

## Verification

Use:

```bash
npm run brand:verify:icons
```

This checks that the icon manifest exists and that all expected icon outputs are present with the correct dimensions.

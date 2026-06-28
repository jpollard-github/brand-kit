# Client Collateral Generator

Use this generator for first-client acquisition materials built from the `Work With Me` brand direction.

## Commands

```bash
npm run brand:client-collateral
npm run brand:proposal-cover
npm run brand:capability-sheet
npm run brand:discovery-call
npm run brand:case-study-template
```

## Outputs

Files are written to `generators/outputs/client-collateral/` as `.html`, `.png`, and `.pdf`.

The capability sheet also writes a manifest:

- `generators/outputs/client-collateral/arcadeghosts-capability-sheet.manifest.json`

Current assets:

- proposal cover
- capability sheet
- discovery call guide
- case study template

The capability sheet is the next-best warm-lead/referral asset after the email signature.

## What To Use First

- `capability-sheet.pdf`
  send this after someone says, "Tell me more."
- `capability-sheet.png`
  use this for quick review or lightweight inline sharing.
- `capability-sheet.html`
  treat this as source/proof output, not the main sendable artifact.
- `capability-sheet.manifest.json`
  use this for preflight/reference.

## Notes

- The first implementation uses ArcadeGhosts `Work With Me` source content.
- Shared generator logic should stay brand-configurable rather than hardcoding ArcadeGhosts-only copy.
- CTA intent should stay logical and reusable:
  primary CTA first, more qualified CTAs later.
- Expect iteration on wording, proof points, and layout once real outreach and client conversations begin.
- Keep the capability sheet to one page and favor clarity over polish perfection.

## Verification

```bash
npm run brand:verify:capability-sheet
```

This checks that the capability-sheet manifest exists and that its HTML/PNG/PDF outputs, rendered PNG dimensions, required positioning/contact fields, and `Work With Me` CTA details still match expectations.

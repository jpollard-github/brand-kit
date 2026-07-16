# Outputs And Review Packets

Reference: 2026-06-28 EDT

Brand Kit is now `Operational v1`.

This doc explains where generated outputs live, how review packets should be organized, and which files control each output.

## Source Vs Generated

Canonical source lives in:

- `design-system/`
- `brands/`
- generator source files under `generators/*/*.ts`
- supporting docs under `docs/`

Generated outputs live in:

- `generators/outputs/<family>/`
- business-card export folders under `generators/business-cards/*/exports/`
- review packet folders and zip artifacts under `review-packets/`

Generated files are review artifacts, not canonical source.

## Canonical Output Folders

Preferred convention for generated outputs:

```text
generators/outputs/<family>/<asset>
```

Current examples:

- `generators/outputs/email/`
- `generators/outputs/client-collateral/`
- `generators/outputs/documents/`
- `generators/outputs/social/`

Business-card exception:

- `generators/business-cards/work-with-me/exports/`
- `generators/business-cards/arcadeghosts/exports/`

Keep using the existing business-card export folders until a migration has a practical reason.

## Review Packet Convention

Review packets are currently written as both an unzipped folder and a matching zip artifact.

Timestamped packet folders live under:

```text
review-packets/YYYY-MM-DD/client-collateral-HHMM/
```

Timestamped zip artifacts live under:

```text
review-packets/
```

Example:

```text
review-packets/2026-06-28/client-collateral-1730/
review-packets/brand-kit-client-collateral-2026-06-28-1730.zip
```

Networking review packets follow the same pattern:

```text
review-packets/2026-06-29/networking-assets-2125/
review-packets/brand-kit-networking-assets-2026-06-29-2125.zip
```

Optional convenience copy:

```text
review-packets/latest-client-collateral/
review-packets/latest-networking-assets/
```

The timestamped folder and timestamped zip should be preserved.
Only the optional `latest-*` convenience copies may be overwritten.

Every review packet should include:

- `REVIEW.md`
- a top-level `outputs/` convenience layer for review
- a top-level `source/` convenience layer for docs, config, and generators
- a top-level `diagnostics/` layer for command logs, git diff context, and review-specific screenshots or overlays
- the generated files being reviewed
- the source files that control those outputs
- relevant manifests
- the docs needed to interpret maturity and proofing status

## Naming Convention

Preferred output naming direction:

```text
<brand>-<asset>-<theme>.<ext>
```

Examples:

- `arcadeghosts-email-signature-default.html`
- `arcadeghosts-email-signature-synthwave.html`
- `arcadeghosts-capability-sheet-default.pdf`

Current reality:

- many non-default themed outputs already include the theme suffix
- several default outputs omit `-default`

Changing existing default names right now would be disruptive to verification, docs, and review habits, so the naming normalization should be treated as a documented future cleanup rather than an immediate migration.

## What Belongs In Review Packets

Include when available:

- email signature HTML, PNG, and manifest
- capability sheet HTML, PDF, PNG, and manifest
- proposal cover outputs
- discovery guide outputs
- invoice outputs
- business-card outputs and manifests
- networking conference card, lock screen, raw QR, Wallet pass package, preview PNG, and verification report
- `README.md`
- `TODO.md`
- `docs/CLIENT-COLLATERAL.md`
- `docs/PRODUCTION-CHECKLIST.md`
- `docs/BUSINESS-LINKS-CONTRACT.md`
- `REVIEW.md`
- `outputs/`
- `source/`
- relevant config
- relevant generators

## Review vs Upload

Review packets should make this distinction obvious:

- visual review files:
  previews, PDFs, manifests, and guide-marked proofs
- upload or production candidates:
  the clean deliverables that should actually be used in email, PDF sharing, or print ordering
- source/config/reference:
  the included docs, config files, and generators under `source/`

For business cards specifically:

- `front-final.png` and `back-final.png` are the safest current upload candidates
- `*-guides.png` and `*-guides.pdf` are review-only proof files
- clean no-guide PDFs should be generated intentionally if Jason wants PDF uploads without guides

Future business-card review packets should also include when practical:

- front and back full-resolution exports
- actual-size preview
- enlarged preview
- grayscale preview
- phone-photo simulation
- readability notes
- hierarchy notes
- QR verification
- proof-checklist completion
- version history

## Files That Control Outputs

Business cards:

- `generators/business-cards/generator/export-cards.ts`
- `generators/business-cards/generator/verification.ts`
- `brands/arcadeghosts/copy/`

Email signature:

- `generators/email/generate-signature.ts`
- `generators/email/manifest.ts`
- `generators/email/verify-email-signature.ts`
- `brands/arcadeghosts/client-collateral.ts`

Capability sheet and related first-client collateral:

- `generators/client-collateral/generate-client-collateral.ts`
- `generators/client-collateral/manifest.ts`
- `generators/client-collateral/verify-capability-sheet.ts`
- `brands/arcadeghosts/client-collateral.ts`

Shared CTA/config behavior:

- `design-system/client-collateral.ts`
- `docs/BUSINESS-LINKS-CONTRACT.md`

Networking assets and Wallet pass:

- `generators/networking/generate-networking-assets.ts`
- `generators/networking/generate-wallet-pass.ts`
- `scripts/verify-qr.ts`
- `scripts/sign-wallet-pass.ts`
- `design-system/networking.ts`
- `brands/arcadeghosts/networking.ts`
- `docs/networking-assets.md`

## Review Order

Suggested first-pass review order:

1. Business card PDF proof
2. Email signature
3. Capability sheet
4. Proposal cover
5. Discovery guide
6. Invoice
# Portfolio proof packet

Run `npm run portfolio:brandkit-proof` to build the ignored, public-safe job-search proof under a UTC timestamped folder in `review-packets/brandkit-proof/`, plus a matching `brandkit-proof-<timestamp>.zip`. The generator updates `latest.json`, and `npm run portfolio:brandkit-proof:verify` always verifies that referenced folder and zip. The packet separates architecture evidence, human visual approval candidates, and review-only overlays. Generated and verified visuals default to `human-review-required`; they are not approved for publication by generation alone.

The public-candidate set is limited to the BrandKit system preview, plain-language process diagram, Jason Pollard Open Graph image, Jason Pollard LinkedIn banner, and BrandKit project cover. Business-card proofs are excluded from this job-search packet and remain separate future collateral work.

The architecture source is `docs/brandkit-architecture.mmd`. Render its SVG with Mermaid CLI when the diagram changes:

```bash
npx -p @mermaid-js/mermaid-cli mmdc -i docs/brandkit-architecture.mmd -o docs/brandkit-architecture.svg
```

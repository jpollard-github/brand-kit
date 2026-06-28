# Brand Agnostic Hardening Summary

Date: 2026-06-28

## Architectural Changes

- Added `DEFAULT_BRAND_ID` and made unknown brand IDs throw instead of silently falling back to ArcadeGhosts.
- Added small shared CLI helpers for default brand parsing and themed output-name generation.
- Added shared asset MIME detection and data-URL generation helpers.
- Replaced several obvious generator hard-codes with values from brand config and brand metadata.
- Removed tracked absolute local filesystem paths from Markdown docs.
- Added a lightweight reusable-code source audit for ArcadeGhosts-specific strings.
- Expanded unit coverage around brand lookup behavior and MIME detection.
- Classified generator maturity in `README.md`.

## Why These Changes Were Made

- Silent fallback to ArcadeGhosts would hide multi-brand mistakes and produce the wrong assets.
- Shared helpers reduce repeat parsing logic and keep defaults consistent across generators.
- MIME-aware asset loading prevents future SVG/JPEG/WebP embedding bugs.
- Pulling URLs, names, and contact data from brand config reduces drift and makes second-brand support more realistic.
- Relative docs are portable across machines and make repo review easier.
- The audit script creates a lightweight signal for remaining ArcadeGhosts leakage in reusable code without blocking work yet.

## TODO Items Completed

- Removed absolute local repo paths from tracked Markdown docs.
- Made unknown brand IDs fail loudly.
- Added `brand:audit-source`.
- Replaced obvious hard-coded brand values where practical.
- Centralized small CLI defaults.
- Improved MIME handling.
- Added unit tests for the new brand/default behavior and MIME logic.
- Added generator maturity classification.
- Updated `TODO.md` with a near-term hardening roadmap and future architecture direction.

## Verification Commands Executed

- `npm run test:unit`
- `npm run brand:audit-source`
- `npm run brand:verify`
- `npm run brand:og`
- `npm run brand:preview-sheet`
- `npm run brand:stickers`
- `npm run brand:totes`
- `npm run brand:documents`
- `npm run brand:conference-badge`
- `npm run brand:email-signature`

## Verification Results

- `test:unit`: passed, 4 files / 14 tests
- `brand:verify`: passed
- `brand:audit-source`: completed with warnings
- `brand:og`: passed after running Playwright outside the sandbox
- `brand:preview-sheet`: passed
- generator smoke tests for stickers, totes, documents, conference badge, and email signature: passed

## Known Limitations

- The new source audit is intentionally warning-only and still noisy.
- The abstraction still has only one real brand proving it in practice.
- Business cards remain the strongest fully verified production workflow.
- Website handoff remains staged/documented rather than integrated into the live website repo.

## Intentionally Deferred Work

- Second-brand validation
- stricter audit/build failures
- broader `brand:verify` coverage across all generators
- scene registry expansion beyond the current hero families
- automatic output manifests and preflight checks across every export family

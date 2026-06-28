# ArcadeGhosts Work With Me Handoff

Reference: 2026-06-28 EDT

This document defines how `brand-kit` supports ArcadeGhosts lead generation without turning generated outputs into source of truth.

See also:

- [docs/BUSINESS-LINKS-CONTRACT.md](docs/BUSINESS-LINKS-CONTRACT.md)

## Purpose

- ArcadeGhosts owns the business purpose, offer framing, and copy needs for `Work With Me`.
- Brand Kit owns the reusable generator logic and the generated collateral surfaces that support outreach.
- Generated outputs stay local/generated unless they are intentionally copied into another repo or handoff folder.
- Handoffs should be reproducible from source and verified before they are treated as real working collateral.

## Repo Roles

### ArcadeGhosts / personal site repo

Owns:

- business purpose
- lead-generation direction
- outreach positioning
- `Work With Me` copy needs
- examples of real problems Jason wants to solve
- any website pages where generated collateral might eventually be referenced or embedded

Reference direction:

- the ArcadeGhosts `LEAD-GENERATION-TODO.md` and `Work With Me` copy in the consumer repo

### Brand Kit repo

Owns:

- brand-config-driven collateral generation
- reusable output logic
- theme-aware rendering
- local collateral proofs
- manifests, preflight checks, and verification helpers where available
- reproducible regeneration steps for client-facing materials

## Source Of Truth Rules

- Canonical source remains under `design-system/`, `brands/`, and generator source files.
- ArcadeGhosts-specific business copy should live in brand-source collateral/config files, not inline inside reusable generator logic.
- Generated HTML, PNG, PDF, SVG, and manifest files are outputs, not canonical source.
- If an output needs to move into the ArcadeGhosts site repo, that move should be explicit and reviewable.
- Actual business links should come from brand-owned or consumer-owned data.
- Brand Kit should consume logical CTA meaning rather than inventing deployment-specific funnel URLs inside reusable generator logic.

## Current Handoff Model

1. Define or refine the need in ArcadeGhosts terms:
   email outreach, warm-intro leave-behind, proposal shell, discovery call support, or future proof.
2. Store reusable source inputs in Brand Kit:
   brand metadata, client-collateral config, generator code, and workflow docs.
3. Generate local outputs from Brand Kit.
4. Verify them with the strongest available checks:
   `npm run brand:verify`, generator-specific manifest checks, and review of the rendered asset.
5. Copy outputs to another repo only when there is a clear reason:
   website embedding, outreach packet assembly, print handoff, or client delivery.

## Shared Collateral Contract

For the cross-repo business-link and CTA contract, see [docs/BUSINESS-LINKS-CONTRACT.md](docs/BUSINESS-LINKS-CONTRACT.md).

This handoff doc stays focused on ArcadeGhosts-specific ownership and reproducible workflow expectations.

## Practical Expectations

- `Work With Me` is the canonical public entry point.
- `Project Inquiry` is secondary.
- `Discovery Session` is post-qualification only.
- Email signature is the first collateral surface to prioritize for real outbound use.
- Capability sheet is the next best leave-behind for warm leads and referrals.
- Proposal cover and discovery call PDF should support early conversations without becoming bloated sales material.
- Case study template stays proof-of-concept until real client work exists.
- Mini flyer can support local outreach or in-person leave-behind workflows, but should not outrank the email signature or capability sheet.

## Verification Expectations

Before using an asset operationally, prefer:

```bash
npm run test:unit
npm run brand:verify
npm run brand:audit-source
```

Also review the specific output visually, especially for:

- contact accuracy
- URL accuracy
- legibility
- whether the asset feels like consulting collateral instead of merch

## Copy And Iteration

- Expect ongoing iteration on wording.
- Let the ArcadeGhosts lead-generation direction keep shaping the collateral.
- Do not let a generated asset freeze the business message too early.
- If real outreach reveals better language, update the brand-source collateral config first, then regenerate.

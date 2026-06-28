# Brand Kit TODO

Reference: 2026-06-28 EDT

This is the active working roadmap for `brand-kit`.

## Guiding Principles

- ArcadeGhosts is the first real brand, not a permanent special case.
- Generated outputs are not canonical source.
- Hero Composition / Scene architecture is the core abstraction.
- Verification matters because these outputs can cost real money.
- Add new output families only after existing families are validated.

## Priority 0: Safety / Source-of-Truth

Highest priority. Protect the repo from silent drift, accidental machine-specific coupling, and expensive output mistakes.

- [x] Keep unknown brand IDs failing loudly instead of silently falling back.
- [x] Keep absolute local paths out of tracked docs.
- [x] Keep generated outputs out of canonical source.
- [x] Keep `brand:audit-source` available as a reusable-code warning pass.
- [x] Keep business-card verification strong because a wrong URL already caused a real ordering mistake.
- [ ] Preserve the rule that canonical source lives in `design-system/`, `brands/`, and generator source files, not generated exports.
- [ ] Keep review and vendor workflows centered on reproducible local generation, not manually edited output artifacts.

## Priority 1: First Client Collateral

This is the highest-leverage work for winning a first consulting client.

- [ ] Create a proposal cover generator or reusable proposal-cover workflow driven by the `Work With Me` brand direction, without hardcoding ArcadeGhosts-specific copy into shared generator logic.
- [ ] Create a capability sheet generator or reusable one-page capability-sheet workflow for services, proof, and contact details.
- [ ] Create a discovery call PDF generator or workflow for a polished pre-call leave-behind.
- [ ] Create a case study template generator or workflow that can be reused once real client work exists.
- [ ] Refine the email signature so it works as a real outbound consulting touchpoint, not just a rendered preview.
- [ ] Strengthen the conference badge as an in-person lead-generation asset.
- [ ] Strengthen the letterhead shell so it can front proposals or lightweight client documents.
- [ ] Strengthen the invoice shell so it feels credible for real billing once client work starts.
- [ ] Keep client-facing collateral ahead of additional merch work unless a merch task directly supports client acquisition.

## Priority 2: Immediate Next Work

This is the work Jason can realistically do tomorrow after the client-collateral priorities above are clear.

- [x] Review `brand:audit-source` warnings and classify them as:
  acceptable brand-specific references, docs-only references, reusable-code leaks, or false positives.
  Current snapshot: high-severity reusable-code leaks are now `0`; acceptable brand-specific references are mostly generator entrypoint defaults and preview copy; docs-only references are `0`; and false positives are `0`.
- [x] Improve `brand:audit-source` output so it groups findings by severity.
- [ ] Decide which audit findings should remain warning-only for now.
- [ ] Add allowlist comments or config where repeated warnings are intentional and acceptable.
- [ ] Verify all current production and production-candidate commands still run after the recent hardening pass.
- [ ] Review generator maturity labels and make sure they match reality.
- [x] Identify the smallest generator family that should receive manifest/preflight support next.
  Chosen next target: OG / social hero outputs first, before merch families.
- [ ] Keep tomorrow's pass focused on confidence in existing outputs rather than adding new generator families.

## Priority 3: Verification And Manifests

- [x] Expand `brand:verify` beyond business cards.
  Current coverage now includes business cards plus OG / LinkedIn / GitHub social, website hero, and icons manifest/preflight checks.
- [ ] Add per-output manifests for production-ready and production-candidate generators.
- [x] Start manifest/preflight work with OG / social hero outputs, since they are closest to Hero Composition and most likely to feed website integration next.
- [x] Extend the same manifest/preflight pattern to website hero and icons.
- [ ] Standardize manifest fields across mature generators:
  brand id, theme id, scene id, output path, dimensions, generated timestamp, source metadata, and vendor readiness.
- [ ] Add preflight checks for:
  dimensions, expected URLs, contact email, asset existence, safe areas where relevant, and output completeness.
- [ ] Treat business cards as the strongest production workflow and use that bar when extending verification elsewhere.
- [ ] Keep proof-of-concept merch generators useful, but do not treat them as vendor-ready until manifests and verification exist.
- [ ] Keep lower-priority merch work below client-acquisition collateral unless it becomes part of a real sales or conference workflow.

## Priority 4: Website Integration

- [ ] Decide whether the ArcadeGhosts website should use generated:
  OG image, LinkedIn/GitHub social images, website hero, and icons.
- [ ] Keep the first website integration local, previewable, and reversible.
- [ ] Document the handoff path in both repos if generated website assets are adopted.
- [ ] Add validation before copying generated assets into the live website repo.
- [ ] Keep website handoff staging as a workflow aid until the validation story is stronger.

## Priority 5: Scene / Hero Architecture

- [ ] Keep Hero Composition as the canonical visual abstraction.
- [ ] Move more outputs toward `Scene -> Hero Composition -> Export Target`.
- [ ] Avoid one-off layout hacks unless the output truly requires them.
- [ ] Treat Hero Composition as the best reusable architecture found so far and protect it from surface-specific drift.
- [ ] Consider a scene registry if `defaultHero` and `workWithMeHero` become too limiting.

## Priority 6: Multi-Brand Validation

- [ ] Add a second real or realistic test brand before claiming the repo is brand-agnostic.
- [ ] Use the second brand to test:
  brand config shape, scenes, metadata, generator assumptions, source audit noise, and default helper behavior.
- [ ] Treat second-brand validation as the real test of brand agnosticism.
- [ ] Do not overfit abstractions before second-brand validation.

## Priority 7: Generator Maturity

Use these labels as workflow expectations, not visual judgments.

### Production Ready

- Definition:
  repeatable output, clear handoff, verification coverage, and reviewed sample output.
- Current expectation:
  business cards are the strongest example today.
- To move a generator into this category:
  manifest, verification, handoff docs, smoke test, and reviewed sample output.

### Production Candidate

- Definition:
  useful outputs that look close to ready, but still need stronger proof before being trusted operationally.
- Likely current members:
  hero-composition-driven social surfaces, website hero, icons, documents, email signature, conference badge, wallpapers, project/newsletter/presentation covers, and preview outputs.
- Production Candidate -> Production Ready requires:
  manifest, verification, handoff docs, smoke test, and reviewed sample output.

### Proof of Concept

- Definition:
  useful exploration value, but not yet vendor-ready or fully validated.
- Current expectation:
  merch outputs like stickers, mugs, shirts, totes, and similar exports stay here until preflight and handoff confidence improve.
- To move upward:
  clearer constraints, sample review, output completeness checks, and a believable vendor workflow.

### Scaffold

- Definition:
  shared abstractions that exist to support future reuse but still need validation in practice.
- Current expectation:
  multi-brand helpers and generalized scene/config plumbing belong here until a second brand proves them.
- To move upward:
  successful second-brand validation plus reduced audit noise and fewer ArcadeGhosts assumptions.

### Archived

- Definition:
  historical material worth keeping but not active source of truth.
- Current expectation:
  `archive/` and older context folders stay here unless intentionally revived.

## Future / Later

- [ ] Add a ChatGPT review packet command, probably `npm run chatgpt:packet`.
- [ ] Promote stronger source audit failures once a second brand exists.
- [ ] Add preview-sheet warnings for proof-of-concept outputs.
- [ ] Add richer theme sweeps where they improve review quality instead of just generating more files.
- [ ] Add vendor-specific handoffs where a generator family becomes operationally real.
- [ ] Build a reusable client-brand onboarding path once second-brand validation exposes the real requirements.
- [ ] Add more merch families only if they support a real client-acquisition, conference, or delivery workflow.

## Completed Recently

Recent completed work from `CHANGES.md`:

- [x] Added `DEFAULT_BRAND_ID` and made unknown brand IDs fail loudly.
- [x] Added shared CLI helpers for default brand parsing and theme-aware output names.
- [x] Added shared asset MIME detection and data-URL helpers.
- [x] Replaced several obvious generator hard-codes with brand-config or metadata values.
- [x] Removed tracked absolute local filesystem paths from Markdown docs.
- [x] Added `npm run brand:audit-source` as a lightweight reusable-code audit.
- [x] Grouped `brand:audit-source` findings by severity and classification, with the remaining high-severity leaks concentrated in legacy business-card internals.
- [x] Expanded unit coverage around brand lookup behavior and asset MIME handling.
- [x] Classified generator maturity in `README.md`.
- [x] Introduced `Scene` / `Hero Composition` as a first-class generator input.
- [x] Added `ArcadeGhosts Hero` and `Work With Me Hero`.
- [x] Added a safer theme-override system with named theme variants.
- [x] Added tote, stream-thumbnail, invoice, letterhead, and preview/theme-sweep workflows.
- [x] Generalized OG / LinkedIn / GitHub social and icon generator defaults to remove avoidable ArcadeGhosts-specific entrypoint leakage.

## Notes To Keep In Mind

- Do not add more output types yet.
- Only add new generator families when they directly support client acquisition or are justified by real client delivery work.
- Improve confidence in existing outputs first.
- Treat business cards as the strongest production workflow.
- Treat proof-of-concept merch generators as useful but not vendor-ready.
- Treat Hero Composition as the best reusable architecture so far.
- Treat `brand:audit-source` as useful but currently noisy.
- Treat second-brand validation as the real test of brand agnosticism.

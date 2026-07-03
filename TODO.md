# Brand Kit TODO

Reference: 2026-06-28 EDT

This is the active working roadmap for `brand-kit`.

## Guiding Principles

- ArcadeGhosts is the first real brand, not a permanent special case.
- Generated outputs are not canonical source.
- Hero Composition / Scene architecture is the core abstraction.
- Verification matters because these outputs can cost real money.
- Add new output families only after existing families are validated.

## Work-With-Me / First Client Collateral

Imported consulting-business work bundle:
`consulting-business/repo-todos/brand-kit/2026-07-02-211756/`

Earlier recommendation phrasing from `2026-07-02-151713` informed this section.
This latest bundle already separates implementation acceptance, code validation, manual proofing, physical proofing, and field validation.

The current accepted structured work orders are:

- `BK-WO-001` Accepted
- `BK-WO-002` Accepted
- `BK-WO-003` Accepted with narrow scope limited to discovery-guide positioning and CTA role alignment

Deferred unless a P0 dependency changes:

- `BK-WO-004`
- `BK-WO-005`
- `BK-WO-006`

These items are the current highest-priority business work in `brand-kit`.

Work-order lifecycle used in this repo:

- `Accepted`: the generated Work Order is approved for downstream use.
- `Implementation Complete`: implementation acceptance criteria are satisfied.
- `Production Candidate`: implementation is complete and code-enforceable validation passes, but manual or physical proofing may still be open.
- `Production Ready`: required manual proofing and physical proofing are complete.
- `Field Validated`: real-world usage confirms the asset works as intended.
- `Deferred`: intentionally not being implemented in this pass.

Important distinction:

- implementation tasks change code, copy, config, or generators
- code validation confirms deterministic checks and generated-output expectations
- manual proofing confirms human review in the real viewer or delivery context
- physical proofing confirms print or tangible-format behavior where applicable
- field validation confirms the asset works in actual outreach or in-person use
- code validation alone never implies `Production Ready`

### Immediate

- [x] Make the capability sheet the primary warm-lead leave-behind by aligning its copy, CTA, and code-enforceable readiness checks to the current consulting offer and first-client funnel.
  Suggested priority: P0
  Current status: `Implementation Complete` on 2026-07-02. The capability sheet now uses the current service-catalog framing, points to `arcadeghosts.org/work-with-me`, exports as a one-page PDF, and stays client-facing in generated output.
  Production status: `Production Candidate`
  Rationale: The consulting-business source of truth now makes the capability sheet the main warm-lead asset, so brand-kit should treat it as the most important sendable follow-up surface after initial interest exists.
  Consulting-business source docs: `docs/SERVICE-CATALOG.md`, `docs/WORK-WITH-ME-PLAYBOOK.md`, `docs/CLIENT-JOURNEY.md`
  Code-enforceable evidence:
  - `npm run brand:verify:capability-sheet` passes
  - `generators/outputs/client-collateral/arcadeghosts-capability-sheet.manifest.json` confirms `pdfPageCount: 1`
  - rendered output points to `arcadeghosts.org/work-with-me`
  - rendered output does not include internal review metadata such as `Primary CTA` or usage-note language
  Affected downstream file/route: `TODO.md`, `docs/CLIENT-COLLATERAL.md`, `docs/PRODUCTION-CHECKLIST.md`, `capability-sheet generator outputs`
  Manual proofing remains open below before any move to `Production Ready`.

- [x] Keep the email signature and Work-With-Me business card firmly in the first-touch support role so they reinforce outreach credibility without trying to replace the capability sheet.
  Suggested priority: P0
  Current status: `Implementation Complete` on 2026-07-02. The signature stays slim and Work-With-Me-oriented, and the business card keeps a concise first-touch message with the same CTA path.
  Production status:
  - email signature: `Production Candidate`
  - Work-With-Me business card: production-ready generator workflow, asset still `Production Candidate` pending print/scan proofing
  Rationale: The business now has a clearer funnel: email signature and business card support first touch, but they should not drift into acting like miniature capability sheets or proposal substitutes.
  Consulting-business source docs: `docs/WORK-WITH-ME-PLAYBOOK.md`, `docs/CLIENT-JOURNEY.md`, `docs/LEADS-PLAYBOOK.md`
  Code-enforceable evidence:
  - `npm run brand:verify:email` passes
  - `generators/outputs/email/arcadeghosts-email-signature.manifest.json` confirms a `360px`-wide output and the `Work With Me` CTA
  - `npm run brand:verify:business-cards` passes
  - Work-With-Me card exports confirm the expected URL, email, QR target, and guide/no-guide proof set
  Affected downstream file/route: `TODO.md`, `docs/CLIENT-COLLATERAL.md`, `email-signature outputs`, `business-card outputs`
  Manual proofing remains open below before any move to `Production Ready`.

- [ ] Capability sheet manual proofing for `Production Ready`.
  Asset status today: `Production Candidate`
  Human proofing still required:
  - confirm the PDF opens cleanly in the real viewer(s) Jason will actually use
  - confirm headline, body copy, and footer stay comfortably readable on Mac and phone
  - confirm the sheet still feels client-facing and warm-lead appropriate in a draft email or real send context
  - answer the practical question: “would I send this to a warm lead right now?”

- [ ] Email signature manual proofing for `Production Ready`.
  Asset status today: `Production Candidate`
  Human proofing still required:
  - Outlook mobile
  - at least one non-Outlook client
  - reply behavior
  - forward behavior
  - real sent-email rendering

- [ ] Work-With-Me business card manual proofing for `Production Ready`.
  Asset status today: `Production Candidate`
  Human proofing still required:
  - QR scan speed on iPhone
  - QR scan speed on Android, if available
  - margins / bleed / trim / safe area review against the MOO template
  - paper / finish confirmation
  - received-print sanity check after delivery

### Near-term

- [x] Keep the discovery-call guide secondary and post-interest by refining it as a qualification aid used only after someone expresses real interest.
  Suggested priority: P1
  Current status: `Implementation Complete` on 2026-07-02. The generated guide now frames itself as warm-lead follow-up, uses `Qualification first`, and points to a post-interest next step rather than cold outreach.
  Production status: `Production Candidate`
  Rationale: The source-of-truth funnel now makes the discovery-call guide a secondary asset, so brand-kit should keep it helpful and polished without letting it drift into cold outreach or capability-sheet territory.
  Consulting-business source docs: `docs/WORK-WITH-ME-PLAYBOOK.md`, `docs/CLIENT-JOURNEY.md`, `docs/SERVICE-CATALOG.md`
  Code-enforceable evidence:
  - generated discovery-call output describes itself as a short post-interest conversation for warm leads
  - rendered output includes `Warm-lead follow-up` and `Qualification first`
  - footer CTA remains `arcadeghosts.org/work-with-me`
  Affected downstream file/route: `TODO.md`, `docs/CLIENT-COLLATERAL.md`, `discovery-call generator outputs`
  Manual proofing can stay bundled into broader packet review work rather than blocking the immediate P0 assets.

- [ ] Define a reproducible Work-With-Me handoff export pack so Brand Kit can generate the exact collateral set ArcadeGhosts outreach needs without turning generated files into source of truth.
  Suggested priority: P1
  Rationale: The cross-repo handoff model is documented, but the current brand-kit output still needs a concrete export bundle definition for outreach-ready assets and explicit reviewable copy steps.
  Consulting-business source docs: `docs/WORK-WITH-ME-PLAYBOOK.md`, `docs/CLIENT-JOURNEY.md`, `docs/LEADS-PLAYBOOK.md`
  Inspected downstream evidence:
  - `docs/ARCADEGHOSTS-WORK-WITH-ME-HANDOFF.md`: Generated outputs stay local/generated unless they are intentionally copied into another repo or handoff folder.
  - `TODO.md`: [x] Keep generated output organization and review-packet conventions quiet and consistent through [docs/OUTPUTS-AND-REVIEW-PACKETS.md](docs/OUTPUTS-AND-REVIEW-PACKETS.md).
  Affected downstream file/route: `TODO.md`, `docs/ARCADEGHOSTS-WORK-WITH-ME-HANDOFF.md`, `docs/BUSINESS-LINKS-CONTRACT.md`, `generated collateral handoff/export workflow`
  Acceptance criteria:
  - The handoff pack explicitly names which generated assets support first-touch outreach and warm-lead follow-up.
  - Each export references logical CTA intent instead of deployment-specific hardcoding.
  - The export flow is reproducible and reviewable before anything is copied into another repo or sent to a prospect.

- [ ] Run a client-facing PDF quality pass across the first-client collateral family so sendable exports clear the real viewer and print checks, not just local generation.
  Suggested priority: P1
  Rationale: The client-facing documents look close, but the current production checklist shows the gap between successful generation and operational confidence in PDF viewers, print, and real-world review contexts.
  Consulting-business source docs: `docs/CLIENT-JOURNEY.md`, `docs/WORK-WITH-ME-PLAYBOOK.md`, `docs/BUSINESS-METRICS.md`
  Inspected downstream evidence:
  - `docs/PRODUCTION-CHECKLIST.md`: PDF opens cleanly
  - `docs/MANUAL-INSTRUCTIONS.md`: 2. Capability sheet proofing
  - `TODO.md`: [ ] Promote assets from `Production Candidate` to `Production Ready` only after checklist-driven proofing and real-world usage.
  Affected downstream file/route: `TODO.md`, `docs/PRODUCTION-CHECKLIST.md`, `docs/MANUAL-INSTRUCTIONS.md`, `client-facing PDF outputs`
  Acceptance criteria:
  - Each first-client PDF opens cleanly in the real viewer(s) Jason will actually use.
  - Layout, footer contact info, CTA clarity, and page length are verified in a human proofing pass.
  - Any PDF that fails proofing stays explicitly below `Production Ready`.

### Later

- [ ] Keep presentation, business-card, and email-signature work strictly subordinate to the consulting funnel by using them only when they reinforce Work With Me outreach and the capability-sheet leave-behind.
  Suggested priority: P2
  Rationale: These surfaces are useful, but the brand-kit business goal is not more collateral variety. It is a tighter first-client funnel where outreach-support assets reinforce the same offer and next step.
  Consulting-business source docs: `docs/LEADS-PLAYBOOK.md`, `docs/WORK-WITH-ME-PLAYBOOK.md`, `docs/SERVICE-CATALOG.md`
  Inspected downstream evidence:
  - `docs/ARCADEGHOSTS-WORK-WITH-ME-HANDOFF.md`: Email signature is the first collateral surface to prioritize for real outbound use.
  - `docs/CLIENT-COLLATERAL.md`: That is useful progress, but it slightly conflicts with the stricter first-client priority order below, where the email signature should be treated as the first operational collateral surface.
  - `TODO.md`: [ ] Keep client-facing collateral ahead of additional merch work unless a merch task directly supports client acquisition.
  Affected downstream file/route: `TODO.md`, `docs/CLIENT-COLLATERAL.md`, `docs/ARCADEGHOSTS-WORK-WITH-ME-HANDOFF.md`, `email-signature and networking-support outputs`
  Acceptance criteria:
  - Email signature, business-card, and presentation support all point into the same Work With Me funnel.
  - No outreach-support asset outranks the capability sheet or distracts from the primary consulting offer.
  - Secondary collateral is advanced only when it directly improves first-touch outreach or warm-lead follow-up.

## Priority 0: Safety / Source-of-Truth

Highest priority. Protect the repo from silent drift, accidental machine-specific coupling, and expensive output mistakes.

- [x] Keep unknown brand IDs failing loudly instead of silently falling back.
- [x] Keep absolute local paths out of tracked docs.
- [x] Keep generated outputs out of canonical source.
- [x] Keep `brand:audit-source` available as a reusable-code warning pass.
- [x] Keep business-card verification strong because a wrong URL already caused a real ordering mistake.
- [x] Preserve the rule that canonical source lives in `design-system/`, `brands/`, and generator source files, not generated exports.
- [x] Keep review and vendor workflows centered on reproducible local generation, not manually edited output artifacts.

## Priority 1: First Client Collateral

This is the highest-leverage work for winning a first consulting client.

Manual step-by-step help for the highest-value items now lives in:

- [docs/MANUAL-INSTRUCTIONS.md](docs/MANUAL-INSTRUCTIONS.md)

- [x] Proof the email signature in the real outreach client before treating it as operationally useful.
  Current status: installed and working in the actual email setup; keep `docs/EMAIL-SIGNATURE-PROOFING.md` for any broader cross-client pass before promoting beyond `Production Candidate`.
- [ ] Keep the email signature `Production Candidate` until manual proofing is complete in:
  Outlook mobile, at least one non-Outlook client, reply/forward behavior, and real sent-email rendering.
  Current status: the slimmer production-oriented signature was regenerated and `npm run brand:verify:email` passed on 2026-07-02.
  Missing to complete: Outlook mobile, one non-Outlook client, reply behavior, forward behavior, and real sent-email rendering checks.
- [ ] Proof the capability sheet in a real outreach context and against [docs/PRODUCTION-CHECKLIST.md](docs/PRODUCTION-CHECKLIST.md).
  Current status: the capability sheet was regenerated with updated warm-lead copy and `npm run brand:verify:capability-sheet` passed on 2026-07-02.
  Missing to complete: human PDF review in real viewing contexts plus an actual “would I send this to a warm lead right now?” check.
- [ ] Keep the capability sheet `Production Candidate` until PDF readability, CTA clarity, footer legibility, and one-page fit are confirmed in a real review pass.
  Current status: generator output now reflects the new warm-lead positioning, but manual proofing is still pending.
- [x] Keep the capability sheet focused on 3-4 concrete client pain patterns instead of trying to summarize every service Jason can offer.
  Current status: the capability sheet copy was narrowed to four concrete problem patterns on 2026-07-02.
- [x] Keep the capability-sheet CTA pointed at `arcadeghosts.org/work-with-me` and/or the inquiry flow, not a paid discovery path.
  Current status: the capability-sheet CTA now points to `arcadeghosts.org/work-with-me`, and verification passed on 2026-07-02.
- [x] Keep internal or meta language out of client-facing collateral renders:
  current sendable capability-sheet and related client-collateral outputs now avoid `Primary CTA`, usage-note footers, and internal review instructions in the rendered asset itself.
- [x] Keep service vocabulary aligned across business cards, email signature, capability sheet, proposal cover, and discovery guide:
  current shared language now consistently supports websites, web apps, automation, AI-assisted systems, internal tools, technical cleanup, and existing codebases where appropriate.
- [x] Keep complex-codebase and repo capability present but secondary:
  current capability-sheet direction includes this as supporting proof of range without turning the asset into a giant skills resume.
- [x] Place the corrected Work With Me business-card order.
  Current status: MOO order placed on 2026-06-28.
- [ ] Complete business-card production verification with the manual checks in [docs/BUSINESS-CARD-PRODUCTION-CHECKLIST.md](docs/BUSINESS-CARD-PRODUCTION-CHECKLIST.md):
  QR scan speed on iPhone and Android, margins, bleed, safe area, and final paper choice, plus a received-print sanity check after delivery.
  Current status: regenerated Work-With-Me exports and guide proofs passed `npm run brand:verify:business-cards` on 2026-07-02.
  Missing to complete: actual phone scanning, MOO-safe-area/bleed review, paper choice confirmation, and received-print sanity check.
- [x] Keep the email signature on the slimmer production path so it fits real mail-client constraints better than the review-oriented preview version.
  Current status: the default generator now produces a slimmer 360px production-oriented signature, and `npm run brand:verify:email` passed on 2026-07-02.
- [ ] Keep the Work With Me business card on the checklist-driven proofing path:
  QR, safe area, bleed, legibility, and print-readiness must all be confirmed before treating the card itself as `Production Ready`.
  Current status: regenerated proof exports and guide PDFs are current as of 2026-07-02.
  Missing to complete: the checklist-driven human proofing itself.
- [x] Add a lightweight review-packet command for first-client collateral.
- [x] Keep generated output organization and review-packet conventions quiet and consistent through [docs/OUTPUTS-AND-REVIEW-PACKETS.md](docs/OUTPUTS-AND-REVIEW-PACKETS.md).
  Current status: generated outputs stay canonical under `generators/outputs/`, and timestamped review packets now live under `review-packets/` with both folder and zip review paths.
- [ ] Promote assets from `Production Candidate` to `Production Ready` only after checklist-driven proofing and real-world usage.
- [ ] Let future collateral changes be driven by real consulting validation, not speculative expansion.
- [x] Create and document `docs/BUSINESS-LINKS-CONTRACT.md` so Brand Kit consumes logical CTA intent instead of owning deployment-specific funnel URLs.
- [x] Refine the email signature so it works as a real outbound consulting touchpoint, not just a rendered preview.
- [x] Add a lightweight reusable CTA model to client-collateral config without turning it into a full schema system.
- [x] Ensure the email signature keeps using logical CTA intent cleanly as the contract evolves.
  Current email-signature links now resolve website, contact email, and primary CTA through the shared client-collateral link contract instead of hardcoded field choices.
- [x] Create a capability sheet generator or reusable one-page capability-sheet workflow for services, proof, and contact details.
  First pass now exists under `npm run brand:capability-sheet`, but it should keep getting refined around `what I help with`, `problems I solve`, and `how to start`.
- [x] Ensure the capability sheet keeps using logical CTA intent cleanly as the contract evolves.
  Current capability-sheet copy now resolves the primary CTA through the logical CTA contract instead of reaching directly into `workWithMeUrl`.
- [x] Add manifest/preflight coverage for the capability sheet next if it proves to be a repeated outreach asset.
- [x] Create a proposal cover generator or reusable proposal-cover workflow driven by the `Work With Me` brand direction, without hardcoding ArcadeGhosts-specific copy into shared generator logic.
  First pass now exists under `npm run brand:proposal-cover`.
- [x] Create a discovery call PDF generator or workflow for a polished pre-call leave-behind.
  First pass now exists under `npm run brand:discovery-call`.
- [x] Keep the discovery-call guide positioned as a post-interest qualification asset rather than a cold-outreach leave-behind.
  Current status: the generated guide now frames itself as warm-lead follow-up and a qualification conversation on 2026-07-02.
- [x] Create a case study template generator or workflow that can be reused once real client work exists.
  First pass now exists under `npm run brand:case-study-template`, but it should stay `Proof of Concept` until real client work informs it.
- [x] Decide whether the mini flyer belongs in the first consulting-collateral stack as a real local leave-behind, then refine it for that use if yes.
  Current decision: not yet. Keep it as a `Prototype` until a real local use case appears.
- [x] Strengthen the letterhead shell so it can front proposals or lightweight client documents.
- [x] Strengthen the invoice shell so it feels credible for real billing once client work starts.
- [x] Strengthen the conference badge as an in-person lead-generation asset.
- [x] Keep business cards important as a proven contact surface, while treating client-collateral refinement as the next growth-focused work.
- [ ] Keep client-facing collateral ahead of additional merch work unless a merch task directly supports client acquisition.
- [ ] Keep the first-client stack focused and pause new collateral families unless real outreach or client work creates the need.
- [ ] Keep the one-page collateral family visually consistent:
  same hero structure, typography, spacing rhythm, footer pattern, CTA placement, card radius, and color language across capability sheet, proposal overview, case study, discovery summary, and similar one-page collateral.
- [ ] Manually proof the networking assets on iPhone:
  transfer the conference card and lock screen to Photos, scan the QR at normal and dim brightness, and confirm the lock-screen crop stays clear of iOS UI.
- [ ] If Apple Wallet signing credentials are available, sign the networking pass and test it in Apple Wallet on iPhone:
  confirm pass install, QR scan behavior, field readability, and whether Wallet is actually more convenient than the conference card at a real meetup.
- [ ] Decide whether the meetup networking assets should stay as a reusable family after real use:
  keep them if they prove useful, or tighten them further based on what actually works at events.
- [ ] Keep the PNG conference card as the primary low-friction networking fallback even if Wallet pass support improves:
  the Wallet path should stay optional rather than becoming a hidden requirement.
- [ ] Keep the networking flow documentation operational:
  `docs/networking-assets.md` should explain the human meetup flow, and `docs/APPLE-WALLET-PASS-SETUP.md` should stay current for signing and installation steps.

### Networking Flow Workstream

This current workstream is tracked here in `Priority 1`, not in a separate TODO file.

- [x] Generate meetup-ready conference card and lock-screen assets with a verified QR target.
- [x] Add a review-packet workflow for networking assets.
- [x] Add a sign-ready Apple Wallet pass package and local signing command.
- [ ] Proof the conference card on the actual iPhone in Photos at meetup-friendly brightness.
- [ ] Proof the lock screen after wallpaper install and crop.
- [ ] Sign the Wallet pass with real Apple credentials and install it on iPhone.
- [ ] Compare whether the Wallet pass is actually better than the conference card in live use.
- [ ] Decide which networking asset should be the default for future meetups:
  conference card, lock screen, or Wallet pass.
- [ ] Keep the networking family if real use validates it; tighten or freeze it if not.

## Priority 2: Immediate Next Work

This is the work Jason can realistically do tomorrow after the client-collateral priorities above are clear.

- [x] Review `brand:audit-source` warnings and classify them as:
  acceptable brand-specific references, docs-only references, reusable-code leaks, or false positives.
  Current snapshot: high-severity reusable-code leaks are now `0`; acceptable brand-specific references are mostly generator entrypoint defaults and preview copy; docs-only references are `0`; and false positives are `0`.
- [x] Improve `brand:audit-source` output so it groups findings by severity.
- [x] Decide which audit findings should remain warning-only for now.
  Current warning-only set: generator entrypoint defaults, preview surfaces, and default-brand wiring that intentionally references ArcadeGhosts.
- [x] Add allowlist comments or config where repeated warnings are intentional and acceptable.
  `brand:audit-source` now has an explicit warning-only allowlist section for intentional references.
- [x] Verify all current production and production-candidate commands still run after the recent hardening pass.
  Current status: `npm run test:unit`, `npm run brand:audit-source`, `npm run brand:verify`, `npm run brand:preview`, and `npm run brand:client-collateral` all completed successfully on 2026-06-28.
- [x] Review generator maturity labels and make sure they match reality.
  Current status: root README and collateral docs now reflect the present split between `Production Ready`, `Production Candidate`, `Proof of Concept`, and `Prototype` more explicitly.
- [x] Identify the smallest generator family that should receive manifest/preflight support next.
  Chosen next target: OG / social hero outputs first, before merch families.
- [x] Keep recent passes focused on confidence in existing outputs rather than adding new generator families.
  Current status: the latest work has centered on business-card ordering readiness, email-signature proofing, capability-sheet polish, packet review flow, and documentation clarity.

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

## Priority 7: Collateral Maturity

Use these labels as workflow expectations, not visual judgments.

### Generator Family Maturity

These labels are separate from the Work-Order lifecycle above.
They describe generator-family maturity, not whether a specific accepted Work Order is merely implemented, proofed, or field validated.

### Prototype

- Definition:
  early surfaces or review aids that help shape the system but still need clearer operational usage.
- Current expectation:
  mini flyer remains here until a real lead-generation or local leave-behind use case is confirmed; review-oriented preview surfaces also fit here.
- To move upward:
  confirm the real use case, tighten the CTA, and prove the handoff path.

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
  case study template stays here until real client work exists; merch outputs like stickers, mugs, shirts, totes, and similar exports also stay here until preflight and handoff confidence improve.
- To move upward:
  clearer constraints, sample review, output completeness checks, and a believable vendor workflow.

### Deprecated

- Definition:
  historical or intentionally inactive material that is worth keeping, but not as active collateral source.
- Current expectation:
  `archive/` and older context folders stay here unless intentionally revived.

## Future QA

This is documentation-only for now.

- [ ] Consider a future visual QA workflow for collateral review.
- [ ] Possible ingredients:
  review packet, thumbnail sheet, PDF visual verification, and a lightweight export gallery.
- [ ] Keep any future QA workflow focused on practical review and signoff rather than adding a heavy internal tool.

## Future / Later

- [ ] Consider whether review packets eventually need a broader `chatgpt:packet` wrapper beyond the current first-client collateral packet command.
- [ ] Normalize default output names toward `<brand>-<asset>-<theme>.<ext>` if a future cleanup can do it without disrupting verification, docs, or review habits.
- [ ] Define email-signature theme usage guidance:
  default daily outreach, conference/event, seasonal, minimal fallback, and special campaign use.
- [ ] Explore future signature theme ideas:
  Halloween, Twin Peaks-inspired mood palette without copyrighted imagery, local-business plain version, and high-contrast accessibility version.
- [ ] Add email-signature accessibility and fallback proofing notes:
  image alt text, readable text if images are blocked, link labels that do not rely on color, and acceptable plain-text fallback behavior.
- [ ] Keep signature install guidance clear:
  which HTML file to use, how to install in Outlook, what to verify after install, and what not to edit manually.
- [ ] Add a lightweight process-diagram option for one-page collateral if real outreach use proves it helpful.
  Keep it small and memorable, such as `Spreadsheet -> Simple Web Tool -> Reports`.
- [ ] Promote stronger source audit failures once a second brand exists.
- [ ] Add preview-sheet warnings for proof-of-concept outputs.
- [ ] Add richer theme sweeps where they improve review quality instead of just generating more files.
- [ ] Add vendor-specific handoffs where a generator family becomes operationally real.
- [ ] Build a reusable client-brand onboarding path once second-brand validation exposes the real requirements.
- [ ] Add more merch families only if they support a real client-acquisition, conference, or delivery workflow.
- [ ] Prefer adding new collateral only when real consulting work demonstrates a need.
- [ ] Keep stickers, mugs, banners, shirts, social graphics, postcards, brochures, posters, and trade-show materials deferred until real outreach proves a need.

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
- [x] Added a brand-source-driven client collateral generator for proposal cover, capability sheet, discovery call, and case study template outputs, plus a clearer consulting-oriented pass on email signature, conference badge, letterhead, and invoice surfaces.

## Notes To Keep In Mind

- Do not add more output types yet.
- Only add new generator families when they directly support client acquisition or are justified by real client delivery work.
- Improve confidence in existing outputs first.
- Treat business cards as the strongest production workflow.
- Treat proof-of-concept merch generators as useful but not vendor-ready.
- Treat Hero Composition as the best reusable architecture so far.
- Treat `brand:audit-source` as useful but currently noisy.
- Treat second-brand validation as the real test of brand agnosticism.

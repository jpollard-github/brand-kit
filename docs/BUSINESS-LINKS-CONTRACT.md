# Business Links Contract

Reference: 2026-06-28 EDT

This document defines the contract between Brand Kit and any consumer repository that uses Brand Kit collateral.

## Purpose

Brand Kit should consume business intent, not own deployment-specific funnel logic.

Brand Kit expects logical business-link values such as:

- `website`
- `workWithMe`
- `projectInquiry`
- `discoverySession`
- `contactEmail`
- `github`
- `linkedin`
- `qrTarget`

Those values may come from brand metadata, brand-owned config, or consumer-supplied integration data, but reusable generator logic should not hardcode deployment-specific business URLs.

## Ownership Boundary

### ArcadeGhosts or another consumer repo owns

- business purpose
- offer framing
- copy needs
- actual URLs
- funnel stage meaning
- CTA meaning
- decisions about when a CTA should appear

### Brand Kit owns

- layouts
- rendering
- manifests
- exports
- preflight
- verification
- reusable collateral source structure

## Runtime Independence

- Brand Kit does not need a runtime dependency on the ArcadeGhosts website repo.
- Cross-repo integration should stay lightweight and reproducible.
- If a consumer repo needs different URLs, it should provide different brand/config values rather than requiring Brand Kit to import the website repo directly.

## Consumer Integration Example

Conceptually, a consumer repo can own real business URLs like this:

```ts
const businessLinks = {
  website: "https://example.com",
  workWithMe: "https://example.com/work-with-me",
  projectInquiry: "https://forms.example.com/project-inquiry",
  discoverySession: "https://payments.example.com/discovery-session",
  contactEmail: "hello@example.com",
  github: "https://github.com/example",
  linkedin: "https://linkedin.com/in/example",
  qrTarget: "https://example.com/work-with-me",
};
```

Brand Kit then consumes the logical meaning of those links through brand/config inputs and uses them for rendering, manifests, exports, and preflight, without importing the consumer repository at runtime.

## CTA Hierarchy

Recommended default hierarchy for first-client collateral:

### Primary CTA

- `Work With Me`

Use for:

- business cards
- email signature
- capability sheet
- mini flyer, if it earns a real use case
- general first-touch or warm-intro collateral

### Secondary CTA

- `Project Inquiry`

Use for:

- interested or qualified prospects
- follow-up material after someone asks how to proceed
- proposal-adjacent or qualification-adjacent assets where a more explicit intake step is appropriate

### Tertiary CTA

- `Discovery Session`

Use for:

- post-conversation payment or scheduling
- qualified opportunities where both sides agree that a paid discovery step is the right next move

Rules:

- Never put the Stripe discovery link on first-touch marketing assets.
- Stripe belongs after conversation, qualification, and agreement.
- `Project Inquiry` is for interested or qualified prospects, not a first-touch destination.
- `Work With Me` is the canonical public entry point for general outreach-facing collateral.

## Lightweight CTA Model

Brand Kit can express CTA intent with logical identifiers rather than URL ownership.

Current lightweight model lives in `design-system/client-collateral.ts`:

- `primaryCTA`
- `secondaryCTA`
- `contactCTA`
- `proposalCTA`
- `discoveryCTA`

Each CTA should describe:

- label
- description
- logical link key

It should not require Brand Kit reusable logic to know live Google Forms, Stripe, or deployment-specific routing details.

## Current Brand Kit Guidance

- Business cards, email signature, and capability sheet should usually point to `Work With Me`.
- `Project Inquiry` should stay available as a qualified-interest path.
- `Discovery Session` should remain post-qualification.
- QR targets should usually follow the primary CTA unless an asset has a specific reason to use a different funnel step.

## Integration Notes

- Consumer repos should provide real business-link values in their own brand/business context.
- Brand Kit should keep consuming logical CTA meaning and brand data.
- If a real integration handoff is needed, use reproducible docs and explicit copied outputs rather than hidden coupling.

# BrandKit: proving a multi-brand generation system

## Problem

BrandKit began as a practical collection of TypeScript and Node.js generators for social images, print collateral, project covers, icons, documents, and review packets. It had broad output coverage, but nearly every design decision had been exercised through one identity: ArcadeGhosts. The repository contained a typed registry and reusable-looking generator APIs, yet reuse was still an architectural claim. A second real identity had to pass through the same system before the design could be called multi-brand.

Jason Pollard’s professional identity provided that proof case. It also exposed a harder problem than swapping colors and copy. The existing shared social composition encoded ArcadeGhosts visually: dark gradients, colored radial glows, sweeping arcs, translucent panels, decorative rings, and a generic split hero. None of those patterns needed to contain the literal word “ArcadeGhosts” to leak its design language into another brand.

## Constraints

The work had to preserve ArcadeGhosts as the default and leave its atmospheric composition available unchanged. Jason Pollard content had to come from the current public professional site, with no access to or copying from private material and no invented claims. The output needed to remain generated from source, use the established `--brand` interface, create reviewable proof assets, and avoid a broad cleanup of unrelated legacy generators. Generated proof packets also needed path-safety checks so workstation-specific locations could not enter portable artifacts.

## Architecture

BrandKit now treats identity and composition as related but separate configuration. Typed brand sources enter a registry and supply palette, typography, metadata, logo rules, scenes, guardrails, themes, and a composition family. Shared generators resolve the selected brand and theme, construct common composition data, then render either the existing atmospheric family or a reusable editorial family.

The editorial family is not a Jason-only template. It is a calm professional option built from flat fields, an understated grid, dividers, generous clear space, restrained accents, and source-driven typography. That division matters: a third professional brand can select the same family without inheriting Jason’s name, colors, monogram, or copy. ArcadeGhosts continues to select `atmospheric`, including its glow, arc, and panel effects.

## Second-brand proof

The Jason Pollard configuration uses the professional site’s exact public tokens: warm paper, deep ink, muted copy, teal, dark teal, copper, line, and cream. It uses the site’s Arial/Helvetica sans-serif stack rather than the earlier Georgia approximation. Its JP asset is derived from the public icon treatment—bold cream monospace letters centered in a rounded ink square—instead of a newly drawn pair of letterforms.

Public positioning also comes from the site content source. The generated scenes use the established statement about building, repairing, modernizing, and explaining difficult software systems, along with staff/principal engineering and solutions-architecture positioning. This keeps generated collateral within already approved claims.

The curated proof command exercises both brands across Open Graph, LinkedIn, project-cover, and business-card proof outputs. A composite review page makes differences visible side by side. This is narrower than claiming every historical generator is fully multi-brand, but it demonstrates reuse across multiple aspect ratios and output families.

## Design leakage found and corrected

The first Jason configuration matched the intended mood only approximately. Its default palette was dark and used near-match teal and copper values. Its typography was serif. Its JP monogram introduced a teal letter and copper underline that did not exist on the site. Most importantly, shared generators surrounded those choices with ArcadeGhosts-shaped effects.

The correction was structural. Brand configuration now declares a composition family and explicitly enables or disables radial glows, sweeping arcs, and glass panels. Jason selects the editorial family with all three effects disabled. Its generated fields use the 80-pixel grid and divider-led structure found on the site. The LinkedIn layout moves essential content away from the lower-left profile-photo overlap and removes the literal avatar placeholder. Tests check semantic configuration and targeted SVG characteristics rather than freezing full image snapshots.

## Verification model

Verification works at several levels. Unit tests prove registry behavior, default-brand stability, exact Jason palette values, the site-aligned font stack, the monogram source treatment, metadata isolation, theme behavior, composition selection, and absence of disallowed atmospheric patterns in Jason’s editorial SVG. Generator-specific verification checks output structure and manifests. The proof verifier confirms brand coverage, expected families and themes, asset presence, safe relative paths, generation success, the comparison note, and LinkedIn constraints.

The existing source audit remains useful for literal string leakage. It identifies hard-coded names, IDs, domains, and email addresses in reusable code and classifies known legacy exceptions. It is intentionally not treated as visual verification. Composition configuration and rendered-output checks cover the different failure mode where the wrong brand aesthetic survives without any literal brand string.

## What AI accelerated

AI accelerated repository mapping, source-to-config comparison, identification of repeated generator motifs, implementation across related templates, focused test creation, proof-packet assembly, and documentation drafting. It was especially useful for tracing how one shared helper affected several fixed-size outputs and for keeping repeated validation requirements synchronized.

## What required human judgment

Human judgment determined which public source was authoritative, whether collateral could vary from the responsive site, and which visual features were identity versus incidental implementation. It also constrained claims: generated copy had to remain resume-backed and public-safe even when more promotional wording might fit a banner. The decision to introduce an editorial family instead of a one-off Jason branch was architectural judgment, as was preserving ArcadeGhosts’ existing family rather than flattening both brands into a lowest-common-denominator template.

Rendered images still require human review. Automated checks can prove token equality, forbidden SVG constructs, output dimensions, and safe areas; they cannot decide whether a line break feels balanced, whether the monogram scale is right, or whether a crop communicates the intended level of restraint. Jason owns final approval.

## Limitations

The proof set does not establish production readiness for every generator. The legacy business-card exporter retains brand-specific structure, so the packet uses a configuration-driven proof card rather than claiming a production Jason card workflow. Font rendering can vary slightly across operating systems because the site uses a system sans-serif stack. Fixed SVG assets also approximate responsive behavior: desktop and mobile crops can be inspected, but a single banner cannot reproduce every LinkedIn client’s positioning.

The literal source audit and visual-pattern tests are complementary, not exhaustive. Future effects could leak identity without matching today’s forbidden patterns. Review remains necessary when a new composition or brand is added.

## Next steps

The next useful step is Jason’s approval of the proof packet at desktop and mobile-oriented crop sizes. After approval, the editorial family can be applied selectively to other calm professional outputs. The production business-card workflow can later be moved onto the registry, and additional generators can declare their supported composition capabilities. A small crop-test matrix and documented font-rendering baseline would improve repeatability without turning the suite into brittle full-SVG snapshot testing.

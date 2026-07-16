# BrandKit: public case-study excerpt

BrandKit started as a collection of TypeScript and Node.js tools for generating social images, project covers, documents, and other brand assets. The tools worked, but nearly every design decision had been tested against one identity: ArcadeGhosts. Supporting a second real brand was necessary to prove that the system was reusable rather than merely organized to look reusable.

The architecture separates brand ingredients—colors, typography, logos, copy, themes, and basic rules—from format blueprints that define dimensions, layout, safe areas, and required content. Shared generators combine those sources, render the requested asset, and produce metadata that automated checks can inspect. Human visual approval remains a separate final step.

Jason Pollard’s professional identity became the second-brand proof. Its public site supplied exact colors, typography, monogram treatment, and approved positioning. That exercise exposed a problem deeper than incorrect tokens: the supposedly shared layouts still carried ArcadeGhosts’ visual language through dark gradients, radial glows, sweeping arcs, translucent panels, and generic hero assumptions. Literal brand names were absent, but the design still leaked.

The correction introduced intentional layouts for each fixed format while preserving shared source and rendering primitives. Tests now check required copy, canvas bounds, safe zones, output dimensions, path safety, and proof status without freezing entire SVG files as snapshots. The proof packet also separates architecture evidence from visuals that still require human judgment.

AI accelerated repository inspection, repeated implementation work, test coverage, and documentation. It did not decide which public source was authoritative, whether a crop felt balanced, which wording was defensible, or whether a generated visual was ready to publish. Those decisions required human review, and publication approval remains explicitly human-owned.

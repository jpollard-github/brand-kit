export type ToneRule = {
  id: string;
  label: string;
  principle: string;
  doThis: string[];
  avoidThis: string[];
};

export type BrandGuardrails = {
  coreTension: string[];
  visualDna: string[];
  toneRules: ToneRule[];
  preserveAcrossOutputs: string[];
  avoid: string[];
};

export function createToneRule(overrides: Partial<ToneRule> = {}): ToneRule {
  return {
    id: "clear-and-human",
    label: "Clear And Human",
    principle: "Keep the work understandable, distinctive, and human.",
    doThis: ["prioritize hierarchy", "keep copy readable", "leave breathing room"],
    avoidThis: ["style-first clutter", "cold generic polish", "effects that bury content"],
    ...overrides,
  };
}

export function createBrandGuardrails(
  overrides: Partial<BrandGuardrails> = {},
): BrandGuardrails {
  return {
    coreTension: [
      "professional enough to trust",
      "personal enough to feel real",
      "playful enough to remember",
      "atmospheric enough to feel like a place",
    ],
    visualDna: [
      "dark layered backgrounds instead of flat black",
      "warm off-white text instead of stark white",
      "neon accents used with restraint",
      "cinematic mood with intimate scale",
    ],
    toneRules: [
      createToneRule({
        id: "professional-but-personal",
        label: "Professional But Personal",
        principle:
          "Be competent and trustworthy without sanding off the human voice.",
        doThis: [
          "use direct language",
          "keep warmth in the copy",
          "let the work feel like it came from a person",
        ],
        avoidThis: [
          "empty corporate polish",
          "self-important voice",
          "too-casual copy that weakens trust",
        ],
      }),
      createToneRule({
        id: "neon-but-readable",
        label: "Neon But Readable",
        principle:
          "Use glow and accent color to create signal, not to compete with the message.",
        doThis: [
          "keep text contrast strong",
          "use accent color sparingly",
          "let neutrals carry most of the reading load",
        ],
        avoidThis: [
          "all-neon-everywhere",
          "low-contrast body copy",
          "effects that blur the hierarchy",
        ],
      }),
      createToneRule({
        id: "atmospheric-but-not-cluttered",
        label: "Atmospheric But Not Cluttered",
        principle:
          "Create a sense of world and mood without turning every surface into a poster.",
        doThis: [
          "use one dominant mood move per composition",
          "leave negative space",
          "simplify before adding extra decoration",
        ],
        avoidThis: [
          "dense collage energy",
          "too many competing motifs",
          "filling every empty area just because it exists",
        ],
      }),
    ],
    preserveAcrossOutputs: [
      "clear hierarchy before decoration",
      "a sense of invitation rather than noise",
      "enough warmth that the work still feels human",
      "enough discipline that the output could be used in real life",
    ],
    avoid: [
      "generic SaaS minimalism",
      "overly loud synthwave parody",
      "dense poster-like clutter",
      "cold tech-brand sterility",
      "cute-for-cute's-sake whimsy without atmosphere",
    ],
    ...overrides,
  };
}

export function toToneRuleLabels(guardrails: BrandGuardrails): string[] {
  return guardrails.toneRules.map((rule) => rule.label.toLowerCase());
}

import { describe, expect, it } from "vitest";

import {
  createBrandGuardrails,
  createToneRule,
  toToneRuleLabels,
} from "../../design-system/guardrails";

describe("guardrails", () => {
  it("derives lowercase tone-rule labels for metadata", () => {
    const guardrails = createBrandGuardrails({
      toneRules: [
        createToneRule({
          id: "conference-readable",
          label: "Conference Readable",
        }),
      ],
    });

    expect(toToneRuleLabels(guardrails)).toEqual(["conference readable"]);
  });

  it("preserves explicit custom do/avoid guidance", () => {
    const rule = createToneRule({
      id: "warm",
      label: "Warm",
      doThis: ["be direct"],
      avoidThis: ["sound robotic"],
    });

    expect(rule.doThis).toEqual(["be direct"]);
    expect(rule.avoidThis).toEqual(["sound robotic"]);
  });
});

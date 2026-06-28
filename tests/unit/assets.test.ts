import { describe, expect, it } from "vitest";

import { getMimeTypeForAsset } from "../../generators/shared/assets";

describe("asset MIME detection", () => {
  it("detects common raster and vector asset types", () => {
    expect(getMimeTypeForAsset("logo.png")).toBe("image/png");
    expect(getMimeTypeForAsset("logo.jpg")).toBe("image/jpeg");
    expect(getMimeTypeForAsset("logo.jpeg")).toBe("image/jpeg");
    expect(getMimeTypeForAsset("logo.webp")).toBe("image/webp");
    expect(getMimeTypeForAsset("logo.svg")).toBe("image/svg+xml");
  });

  it("falls back to octet-stream for unknown file types", () => {
    expect(getMimeTypeForAsset("logo.bin")).toBe("application/octet-stream");
  });
});

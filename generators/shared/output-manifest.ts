import { promises as fs } from "node:fs";

export async function readPngDimensions(filePath: string) {
  const buffer = await fs.readFile(filePath);
  const isPng = buffer.toString("ascii", 1, 4) === "PNG";

  if (!isPng) {
    throw new Error(`${filePath} is not a PNG file`);
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

export function toDisplayUrl(urlValue: string) {
  return urlValue.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

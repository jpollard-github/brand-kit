import { promises as fs } from "node:fs";
import path from "node:path";

const mimeTypeByExtension: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

export function getMimeTypeForAsset(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();
  return mimeTypeByExtension[extension] ?? "application/octet-stream";
}

export async function readAssetAsDataUrl(filePath: string) {
  const data = await fs.readFile(filePath);
  const mimeType = getMimeTypeForAsset(filePath);
  return `data:${mimeType};base64,${data.toString("base64")}`;
}

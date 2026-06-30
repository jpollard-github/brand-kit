import { execFile } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const swiftToolPath = path.join(currentDir, "qr-tool.swift");

export type QrVerificationResult = {
  imagePath: string;
  decodedUrl: string;
  matchesExpected: boolean;
};

async function runSwiftTool(args: string[]) {
  const { stdout } = await execFileAsync("swift", [swiftToolPath, ...args]);
  return stdout.trim();
}

export async function generateQrPng(
  url: string,
  outputPath: string,
  options: {
    size?: number;
    margin?: number;
    correctionLevel?: "L" | "M" | "Q" | "H";
  } = {},
) {
  await runSwiftTool([
    "generate",
    "--url",
    url,
    "--output",
    outputPath,
    "--size",
    String(options.size ?? 1024),
    "--margin",
    String(options.margin ?? 96),
    "--correction",
    options.correctionLevel ?? "H",
  ]);
  return outputPath;
}

export async function decodeQrFromImage(imagePath: string) {
  return runSwiftTool(["decode", "--image", imagePath]);
}

export async function verifyQrImage(
  imagePath: string,
  expectedUrl: string,
): Promise<QrVerificationResult> {
  const decodedUrl = await decodeQrFromImage(imagePath);
  return {
    imagePath,
    decodedUrl,
    matchesExpected: decodedUrl === expectedUrl,
  };
}

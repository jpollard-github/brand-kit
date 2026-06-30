import { promises as fs } from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { createBrandOutputName, parseCliFlag, resolveBrandId } from "../generators/shared/cli";
import { repoRootDir } from "../generators/social/hero-composition";

const execFileAsync = promisify(execFile);

async function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable ${name}`);
  }
  return value;
}

async function pathExists(targetPath: string) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const brandId = resolveBrandId(argv);
  const outputDir = path.join(repoRootDir, "generators", "outputs", "networking");
  const packageDir = path.join(
    outputDir,
    createBrandOutputName(brandId, "wallet-pass", process.env.BRAND_THEME),
  );
  const manifestPath = path.join(packageDir, "manifest.json");

  if (!(await pathExists(manifestPath))) {
    throw new Error(
      "Wallet pass package not found. Run `npm run asset:wallet-pass` first.",
    );
  }

  const passTypeIdentifier = await requireEnv("APPLE_PASS_TYPE_IDENTIFIER");
  const teamIdentifier = await requireEnv("APPLE_TEAM_IDENTIFIER");
  const p12Path = await requireEnv("APPLE_WALLET_CERT_P12_PATH");
  const password = await requireEnv("APPLE_WALLET_CERT_PASSWORD");
  const wwdrPath = await requireEnv("APPLE_WWDR_CERT_PATH");

  const tempDir = path.join(outputDir, ".wallet-pass-signing-temp");
  await fs.rm(tempDir, { recursive: true, force: true });
  await fs.mkdir(tempDir, { recursive: true });

  const signerPem = path.join(tempDir, "signer.pem");
  const signerKey = path.join(tempDir, "signer-key.pem");
  const signaturePath = path.join(packageDir, "signature");
  const pkpassPath = path.join(
    outputDir,
    `${createBrandOutputName(brandId, "wallet-pass", process.env.BRAND_THEME)}.pkpass`,
  );

  await execFileAsync("openssl", [
    "pkcs12",
    "-in",
    p12Path,
    "-clcerts",
    "-nokeys",
    "-out",
    signerPem,
    "-passin",
    `pass:${password}`,
  ]);

  await execFileAsync("openssl", [
    "pkcs12",
    "-in",
    p12Path,
    "-nocerts",
    "-out",
    signerKey,
    "-nodes",
    "-passin",
    `pass:${password}`,
  ]);

  await execFileAsync("openssl", [
    "smime",
    "-binary",
    "-sign",
    "-certfile",
    wwdrPath,
    "-signer",
    signerPem,
    "-inkey",
    signerKey,
    "-in",
    manifestPath,
    "-out",
    signaturePath,
    "-outform",
    "DER",
  ]);

  await fs.rm(pkpassPath, { force: true });
  await execFileAsync("zip", ["-qr", pkpassPath, "."], { cwd: packageDir });
  await fs.rm(tempDir, { recursive: true, force: true });

  const notePath = path.join(
    outputDir,
    `${createBrandOutputName(brandId, "wallet-pass-signing", process.env.BRAND_THEME)}.txt`,
  );
  await fs.writeFile(
    notePath,
    [
      `Signed at: ${new Date().toISOString()}`,
      `Pass type identifier: ${passTypeIdentifier}`,
      `Team identifier: ${teamIdentifier}`,
      `Signed pkpass: ${path.relative(process.cwd(), pkpassPath)}`,
    ].join("\n"),
    "utf8",
  );

  console.log(`Signed wallet pass written to ${path.relative(process.cwd(), pkpassPath)}`);
  console.log(`Wallet signing note written to ${path.relative(process.cwd(), notePath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

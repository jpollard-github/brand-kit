import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const outputDir = path.join(repoRoot, "repo-reviews");
const outputFile = path.join(outputDir, "brand-kit-source.zip");

const imageExtensions = new Set([
  ".ai",
  ".avif",
  ".bmp",
  ".gif",
  ".heic",
  ".heif",
  ".ico",
  ".jpeg",
  ".jpg",
  ".png",
  ".psd",
  ".raw",
  ".svg",
  ".tif",
  ".tiff",
  ".webp",
]);

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: repoRoot,
      stdio: ["pipe", "pipe", "pipe"],
      ...options,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      reject(
        new Error(
          `${command} ${args.join(" ")} failed with code ${code}\n${stderr || stdout}`.trim(),
        ),
      );
    });

    if (options.input) {
      child.stdin.end(options.input);
    } else {
      child.stdin.end();
    }
  });
}

const { stdout } = await run("git", ["ls-files", "-co", "--exclude-standard", "-z"]);

const files = stdout
  .split("\0")
  .filter(Boolean)
  .filter((file) => !imageExtensions.has(path.extname(file).toLowerCase()))
  .filter((file) => file !== path.relative(repoRoot, outputFile))
  .sort((left, right) => left.localeCompare(right));

if (files.length === 0) {
  throw new Error("No files matched the archive criteria.");
}

await mkdir(outputDir, { recursive: true });
await run("rm", ["-f", outputFile]);
await run("zip", ["-q", outputFile, "-@"], {
  input: `${files.join("\n")}\n`,
});

console.log(`Created ${path.relative(repoRoot, outputFile)} with ${files.length} files.`);

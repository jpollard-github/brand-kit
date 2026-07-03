import { spawn } from "node:child_process";

function formatTimestamp(date) {
  return date.toISOString();
}

function formatElapsed(elapsedMs) {
  if (elapsedMs < 1000) {
    return `${elapsedMs}ms`;
  }

  return `${(elapsedMs / 1000).toFixed(2)}s`;
}

function normalizeCommand(command) {
  if (process.platform === "win32" && (command === "npm" || command === "npx")) {
    return `${command}.cmd`;
  }

  return command;
}

const args = process.argv.slice(2);
let label = "";
const separatorIndex = args.indexOf("--");

if (separatorIndex === -1) {
  console.error("Usage: node scripts/run-with-timing.mjs --label <label> -- <command> [args...]");
  process.exit(1);
}

for (let index = 0; index < separatorIndex; index += 1) {
  const arg = args[index];
  if (arg === "--label") {
    label = args[index + 1] ?? "";
    index += 1;
  }
}

const command = args.slice(separatorIndex + 1);

if (command.length === 0) {
  console.error("No command provided.");
  process.exit(1);
}

const startedAt = new Date();
const startedMs = Date.now();
const displayLabel = label || command.join(" ");

console.error(`[timed] ${displayLabel} started at ${formatTimestamp(startedAt)}`);

const child = spawn(normalizeCommand(command[0]), command.slice(1), {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit",
});

child.on("error", (error) => {
  const completedAt = new Date();
  const elapsedMs = Date.now() - startedMs;
  console.error(`[timed] ${displayLabel} failed to start at ${formatTimestamp(completedAt)}`);
  console.error(`[timed] elapsed=${formatElapsed(elapsedMs)} exit=1`);
  console.error(error);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  const completedAt = new Date();
  const elapsedMs = Date.now() - startedMs;
  if (signal) {
    console.error(`[timed] ${displayLabel} interrupted at ${formatTimestamp(completedAt)}`);
    console.error(`[timed] elapsed=${formatElapsed(elapsedMs)} signal=${signal}`);
    process.exit(1);
  }

  const exitCode = code ?? 1;
  console.error(`[timed] ${displayLabel} completed at ${formatTimestamp(completedAt)}`);
  console.error(`[timed] elapsed=${formatElapsed(elapsedMs)} exit=${exitCode}`);
  process.exit(exitCode);
});

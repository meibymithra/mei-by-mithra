import fs from "fs";
import { spawn } from "child_process";

function parseEnvFile(path) {
  if (!fs.existsSync(path)) return;

  const content = fs.readFileSync(path, "utf8");
  for (const line of content.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;

    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key]) continue;

    let value = rawValue.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function main() {
  const args = process.argv.slice(2);
  const preferDirectUrl = args[0] === "--prefer-direct-url";
  const command = (preferDirectUrl ? args.slice(1) : args).join(" ").trim();
  if (!command) {
    console.error("Usage: node scripts/run-with-env.mjs <command>");
    process.exit(1);
  }

  parseEnvFile(".env");
  parseEnvFile(".env.local");

  if (preferDirectUrl && process.env.DIRECT_URL) {
    process.env.DATABASE_URL = process.env.DIRECT_URL;
  }

  const child = spawn(command, {
    stdio: "inherit",
    shell: true,
    env: process.env
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 1);
  });
}

main();

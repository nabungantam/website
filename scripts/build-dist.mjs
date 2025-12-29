import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const rootDir = process.cwd();
const outDir = path.join(rootDir, "out");
const distDir = path.join(rootDir, "dist");
const outputDir = './dist'
async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensure404(baseDir) {
  const target = path.join(baseDir, "404.html");
  if (await exists(target)) {
    return;
  }

  const candidates = [
    path.join(baseDir, "404", "index.html"),
    path.join(baseDir, "_not-found", "index.html"),
    path.join(baseDir, "_not-found.html"),
  ];

  for (const source of candidates) {
    if (await exists(source)) {
      await fs.copyFile(source, target);
      return;
    }
  }
}

async function main() {
  await fs.rm(distDir, { recursive: true, force: true });
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.rm(outputDir, { recursive: true, force: true });

  execSync("next build", { stdio: "inherit" });

  if (!(await exists(outDir))) {
    throw new Error("Next export output not found in /out.");
  }

  await ensure404(outDir);
  await fs.mkdir(outputDir, { recursive: true });
  await fs.cp(outDir, outputDir, { recursive: true });
  await fs.rm(outDir, { recursive: true, force: true });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

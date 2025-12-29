import fs from "node:fs/promises";
import path from "node:path";

const outDir = path.join(process.cwd(), "out");
const target = path.join(outDir, "404.html");

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (await exists(target)) {
    console.log("404.html already exists.");
    return;
  }

  const candidates = [
    path.join(outDir, "404", "index.html"),
    path.join(outDir, "_not-found", "index.html"),
    path.join(outDir, "_not-found.html"),
  ];

  for (const source of candidates) {
    if (await exists(source)) {
      await fs.copyFile(source, target);
      console.log("Generated 404.html from", source);
      return;
    }
  }

  console.warn("404 source not found. No 404.html generated.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

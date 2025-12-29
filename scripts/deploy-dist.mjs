import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const rootDir = process.cwd();
const distDir =
  process.env.STATIC_OUT_DIR ??
  path.join(os.homedir(), "Desktop", "nabungantam-website");

function run(command, options = {}) {
  execSync(command, { stdio: "inherit", ...options });
}

async function main() {
  run("npm run static:build", { cwd: rootDir });

  const remote = execSync("git config --get remote.origin.url", {
    cwd: rootDir,
    encoding: "utf8",
  }).trim();

  if (!remote) {
    throw new Error("Remote origin belum diset.");
  }

  try {
    await fs.access(distDir);
  } catch {
    throw new Error("Folder dist tidak ditemukan. Jalankan build dulu.");
  }

  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "nabungantam-dist-"));
  const repoDir = path.join(tempRoot, "repo");
  await fs.mkdir(repoDir);

  await fs.cp(distDir, repoDir, { recursive: true });

  run("git init", { cwd: repoDir });
  run("git add .", { cwd: repoDir });
  run('git commit -m "Deploy dist"', { cwd: repoDir });
  run(`git remote add origin ${remote}`, { cwd: repoDir });
  run("git push origin HEAD:main --force", { cwd: repoDir });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import esbuild from "esbuild";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(scriptDir, "..");
const outDir = path.join(repoRoot, "public", "page-analyzer");
const outFile = path.join(outDir, "viewer-bootstrap.js");

async function buildViewerBootstrap() {
  fs.mkdirSync(outDir, { recursive: true });

  await esbuild.build({
    entryPoints: [path.join(repoRoot, "lib/a11y/proxy/viewer-bootstrap.ts")],
    outfile: outFile,
    bundle: true,
    platform: "browser",
    target: "chrome120",
    format: "iife",
    absWorkingDir: repoRoot,
    sourcemap: true,
  });

  console.log(`Viewer bootstrap built to ${outFile}`);
}

buildViewerBootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});

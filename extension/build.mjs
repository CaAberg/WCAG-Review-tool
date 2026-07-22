import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import esbuild from "esbuild";

const extensionDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(extensionDir, "..");
const distDir = path.join(extensionDir, "dist");
const iconsDir = path.join(distDir, "icons");
const srcDir = path.join(extensionDir, "src");

/** Minimal 1x1 PNG used for extension icons in development builds. */
const MINIMAL_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

async function buildExtension() {
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(iconsDir, { recursive: true });

  for (const size of ["16", "48", "128"]) {
    fs.writeFileSync(path.join(iconsDir, `icon-${size}.png`), MINIMAL_PNG);
  }

  fs.copyFileSync(
    path.join(extensionDir, "manifest.json"),
    path.join(distDir, "manifest.json"),
  );
  fs.copyFileSync(path.join(srcDir, "popup.html"), path.join(distDir, "popup.html"));
  fs.copyFileSync(path.join(srcDir, "popup.css"), path.join(distDir, "popup.css"));

  const sharedOptions = {
    bundle: true,
    platform: "browser",
    target: "chrome120",
    sourcemap: true,
    absWorkingDir: repoRoot,
  };

  await esbuild.build({
    ...sharedOptions,
    entryPoints: [path.join(srcDir, "background.ts")],
    outfile: path.join(distDir, "background.js"),
    format: "iife",
  });

  await esbuild.build({
    ...sharedOptions,
    entryPoints: [path.join(srcDir, "content-scan.ts")],
    outfile: path.join(distDir, "content-scan.js"),
    format: "iife",
  });

  await esbuild.build({
    ...sharedOptions,
    entryPoints: [path.join(srcDir, "popup.ts")],
    outfile: path.join(distDir, "popup.js"),
    format: "esm",
  });

  console.log("Extension built to extension/dist");
}

buildExtension().catch((error) => {
  console.error(error);
  process.exit(1);
});

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import archiver from "archiver";

const workingDir = process.cwd();
const distDir = path.join(workingDir, "dist");
const artifactDir = path.join(workingDir, "artifacts");

// Ensure dist folder exists and is clean
if (fs.existsSync(distDir)) fs.rmSync(distDir, { recursive: true });
fs.mkdirSync(distDir);

// Step 1: Copy folders (icons, img)
for (const folder of ["icons", "img"]) {
  const src = path.join(workingDir, folder);
  const dest = path.join(distDir, folder);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    console.log(`✅ Packed ${folder}/`);
  } else {
    console.warn(`⚠️  ${folder}/ folder not found`);
  }
}

// Step 2: Run SASS build script in sass/package.json
console.log("🎨 Building dark-mode.css...");
execSync("npm run build", { cwd: path.join(workingDir, "sass"), stdio: "inherit" });

const cssPath = path.join(workingDir, "dark-mode.css");
if (!fs.existsSync(cssPath)) {
  console.error("❌ dark-mode.css not generated! Check your sass build script.");
  process.exit(1);
}

// Step 3: Copy main files to dist
for (const file of ["dark-mode.css", "app.js", "manifest.json", "README.md"]) {
  const src = path.join(workingDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distDir, file));
    console.log(`✅ Packed ${file}`);
  } else {
    console.warn(`⚠️  Missing ${file}`);
  }
}

if (fs.existsSync(artifactDir)) fs.rmSync(artifactDir, { recursive: true });
fs.mkdirSync(artifactDir);

// Step 4: Create zip archive of dist folder
console.log("📦 Creating extension.zip...");
const output = fs.createWriteStream(path.join(artifactDir, "extension.zip"));
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () =>
  console.log(`✅ extension.zip created (${archive.pointer()} total bytes)`)
);
archive.on("error", (err) => {
  throw err;
});

archive.pipe(output);
archive.directory(distDir, false);
await archive.finalize();

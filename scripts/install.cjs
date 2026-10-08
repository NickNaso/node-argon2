// Install hook: Use the bundled prebuild if there is one for this system,
// Otherwise compile from source with marmotta into build/.
const { spawnSync } = require("node:child_process");
const { join } = require("node:path");
const { currentTag, prebuildPath, existsSync } = require("./targets.cjs");

const root = join(__dirname, "..");

if (existsSync(prebuildPath(root))) {
  process.exit(0);
}

console.log(`No prebuild for ${currentTag()}, building from source`);
const marmotta = require.resolve("marmotta/dist/cli.js");
const { status } = spawnSync(process.execPath, [marmotta, "build", "-C", root], {
  stdio: "inherit",
});
process.exit(status ?? 1);

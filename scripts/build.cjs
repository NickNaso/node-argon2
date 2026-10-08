// Cross-compiles prebuilt binaries with marmotta (Zig), one per target in targets.cjs.
// Usage: node scripts/build.cjs [tag...]   (default: all targets)
const { spawnSync } = require("node:child_process");
const { join } = require("node:path");
const { targets } = require("./targets.cjs");

const root = join(__dirname, "..");
const marmotta = require.resolve("marmotta/dist/cli.js");
const requested = process.argv.slice(2);
const tags = requested.length > 0 ? requested : Object.keys(targets);

for (const tag of tags) {
  const target = targets[tag];
  if (!target) {
    console.error(`Unknown target "${tag}", expected one of: ${Object.keys(targets).join(", ")}`);
    process.exit(1);
  }

  console.log(`Building ${tag} (${target})`);
  const { status } = spawnSync(
    process.execPath,
    [marmotta, "build", "-C", root, "--target", target, "-o", join("prebuilds", tag)],
    { stdio: "inherit" },
  );
  if (status !== 0) {
    process.exit(status ?? 1);
  }
}

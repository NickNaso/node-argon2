const { existsSync } = require("node:fs");
const { join } = require("node:path");

/** Zig target triple for every published prebuild, keyed by its `prebuilds/` directory */
const targets = {
  "darwin-arm64": "aarch64-macos",
  "darwin-x64": "x86_64-macos",
  "freebsd-arm64": "aarch64-freebsd",
  "freebsd-x64": "x86_64-freebsd",
  "linux-arm": "arm-linux-gnueabihf.2.17",
  "linux-arm-musl": "arm-linux-musleabihf",
  "linux-arm64": "aarch64-linux-gnu.2.17",
  "linux-arm64-musl": "aarch64-linux-musl",
  "linux-x64": "x86_64-linux-gnu.2.17",
  "linux-x64-musl": "x86_64-linux-musl",
  "win32-arm64": "aarch64-windows",
  "win32-x64": "x86_64-windows",
};

/** Name of the `prebuilds/` directory matching the running system */
function currentTag() {
  let tag = `${process.platform}-${process.arch}`;
  if (process.platform === "linux") {
    const { header } = process.report.getReport();
    if (!header.glibcVersionRuntime) {
      tag += "-musl";
    }
  }
  return tag;
}

function prebuildPath(root, tag = currentTag()) {
  return join(root, "prebuilds", tag, "argon2.node");
}

module.exports = { currentTag, existsSync, prebuildPath, targets };

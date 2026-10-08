const { include_dir: addonApiIncludeDir } = require("node-addon-api");

/** @param {{ target?: string, platform: string, arch: string }} context */
module.exports = ({ target, platform, arch }) => {
  const triple = target ?? "";
  const isWindows = target ? triple.includes("windows") : platform === "win32";
  const isMac = target
    ? triple.includes("macos") || triple.includes("darwin")
    : platform === "darwin";
  const isX86 = target ? /^(x86_64|i[3-6]86)-/.test(triple) : arch === "x64" || arch === "ia32";

  const defines = [
    "-DNAPI_VERSION=8",
    "-DNODE_ADDON_API_DISABLE_DEPRECATED",
    "-DNODE_API_NO_EXTERNAL_BUFFERS_ALLOWED",
    "-DNDEBUG",
  ];

  // Optimized implementation only exists for x86, others use the reference one
  const cFlags = [...defines, ...(isX86 ? ["-msse", "-msse2"] : []), "-Wno-type-limits"];
  const cxxFlags = [
    ...defines,
    "-std=c++17",
    "-Wall",
    "-Wextra",
    "-Wformat",
    "-Wnon-virtual-dtor",
    "-pedantic",
    "-fexceptions",
  ];

  const linkerFlags = [];
  if (!isWindows && !isMac) {
    cFlags.push("-fdata-sections", "-ffunction-sections", "-fvisibility=hidden");
    cxxFlags.push("-fdata-sections", "-ffunction-sections", "-fvisibility=hidden");
    linkerFlags.push("-Wl,--gc-sections", "-s");
  }

  const archSource = "argon2/src/" + (isX86 ? "opt.c" : "ref.c");

  return {
    name: "argon2",
    sources: [
      "argon2.cpp",
      "argon2/src/argon2.c",
      "argon2/src/blake2/blake2b.c",
      "argon2/src/core.c",
      "argon2/src/encoding.c",
      "argon2/src/thread.c",
      archSource,
    ],
    includeDirs: ["argon2/include", addonApiIncludeDir],
    cFlags,
    cxxFlags,
    linkerFlags,
    outputDir: "build",
  };
};

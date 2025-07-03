import fs from "fs-extra";
import path from "path";

import deps from "../dependencies.json" with { type: "json" };
import type { Options, Dirs, PackageJson } from "../types.js";

type OptionKey = {
  key: keyof typeof deps.optionalDeps;
  selected: (options: Options) => boolean | undefined;
};

const optionKeys: OptionKey[] = [
  { key: "darkMode", selected: (options) => options.darkMode },
  { key: "rhf", selected: (options) => options.rhf },
  { key: "tanstackQuery", selected: (options) => options.tanstackQuery },
  { key: "zustand", selected: (options) => options.state === "zustand" },
  { key: "jotai", selected: (options) => options.state === "jotai" },
  { key: "prisma", selected: (options) => options.orm === "prisma" },
  { key: "drizzle", selected: (options) => options.orm === "drizzle" },
  { key: "authjs", selected: (options) => options.auth === "authjs" },
  { key: "clerk", selected: (options) => options.auth === "clerk" },
];

export const addDependencies = (options: Options, pkg: PackageJson) => {
  let dependencies = { ...deps.dependencies };
  let devDependencies = { ...deps.devDependencies };

  for (const { key, selected } of optionKeys) {
    if (selected(options) && deps.optionalDeps[key]) {
      // Special handling for prisma and drizzle (has deps/devDeps)
      if (key === "prisma" || key === "drizzle") {
        Object.assign(dependencies, deps.optionalDeps[key].deps);
        Object.assign(devDependencies, deps.optionalDeps[key].devDeps);
      } else {
        Object.assign(dependencies, deps.optionalDeps[key]);
      }
    }
  }

  pkg.dependencies = sortObject(dependencies);
  pkg.devDependencies = sortObject(devDependencies);
  if (options.orm) {
    Object.assign(pkg.scripts, deps.optionalDeps[options.orm].scripts);
  }
};

// For skip install flag - only add deps needed for running commands
export const addRunDependencies = async (options: Options, dirs: Dirs) => {
  const _pkg = (await fs.readJson(
    path.join(dirs.mainDir, "_package.json")
  )) as PackageJson;

  if (options.orm) {
    Object.assign(_pkg.dependencies, deps.optionalDeps[options.orm].deps);
    Object.assign(_pkg.devDependencies, deps.optionalDeps[options.orm].devDeps);
    Object.assign(_pkg.scripts, deps.optionalDeps[options.orm].scripts);
  }

  await fs.writeJson(path.join(dirs.tempDir, "_package.json"), _pkg, {
    spaces: 2,
  });
};

function sortObject(obj: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(obj).sort(([a], [b]) => a.localeCompare(b))
  );
}

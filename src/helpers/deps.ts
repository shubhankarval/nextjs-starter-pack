import deps from "../dependencies.json" with { type: "json" };
import type { ScaffoldContext } from "../types.js";

type OptionKey = {
  key: keyof typeof deps.optionalDeps;
  selected: (options: ScaffoldContext) => boolean | undefined;
};

const optionKeys: OptionKey[] = [
  { key: "darkMode", selected: (options) => options.darkMode },
  { key: "rhf", selected: (options) => options.rhf },
  { key: "tanstackQuery", selected: (options) => options.tanstackQuery },
  { key: "zustand", selected: (options) => options.state === "zustand" },
  { key: "jotai", selected: (options) => options.state === "jotai" },
  { key: "prisma", selected: (options) => options.prisma },
  { key: "authjs", selected: (options) => options.auth === "authjs" },
  { key: "clerk", selected: (options) => options.auth === "clerk" },
];

export const addDependencies = (options: ScaffoldContext) => {
  let dependencies = { ...deps.dependencies };
  let devDependencies = { ...deps.devDependencies };

  for (const { key, selected } of optionKeys) {
    if (selected(options) && deps.optionalDeps[key]) {
      // Special handling for prisma (has deps/devDeps/config)
      if (key === "prisma") {
        Object.assign(dependencies, deps.optionalDeps.prisma.deps);
        Object.assign(devDependencies, deps.optionalDeps.prisma.devDeps);
      } else {
        Object.assign(dependencies, deps.optionalDeps[key]);
      }
    }
  }

  return {
    dependencies: sortObject(dependencies),
    devDependencies: sortObject(devDependencies),
  };
};

function sortObject(obj: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(obj).sort(([a], [b]) => a.localeCompare(b))
  );
}

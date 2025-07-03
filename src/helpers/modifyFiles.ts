import handlebars from "handlebars";
import path from "path";
import fs from "fs-extra";

import type { Options, Dirs, FileMapping } from "../types.js";

export const modifyFiles = async (options: Options, dirs: Dirs) => {
  const useProviders =
    !options.state || options.darkMode || options.tanstackQuery;

  const fileMap = [
    {
      src: ".gitignore.hbs",
      dest: ".gitignore",
    },
    {
      src: ".env.hbs",
      dest: ".env",
    },
    {
      src: ".env.example.hbs",
      dest: ".env.example",
    },
    {
      src: "layout.tsx.hbs",
      dest: "src/app/layout.tsx",
    },
    useProviders && {
      src: "providers.tsx.hbs",
      dest: "src/app/providers.tsx",
    },
    {
      src: "tasks.tsx.hbs",
      dest: "src/components/tasks.tsx",
    },
    {
      src: "todo-list.tsx.hbs",
      dest: "src/components/todo-list.tsx",
    },
    {
      src:
        options.state === "zustand"
          ? "task-store.ts.hbs"
          : options.state === "jotai"
          ? "task-atoms.ts.hbs"
          : "task-context.tsx.hbs",
      dest:
        options.state === "zustand"
          ? "src/store/task-store.ts"
          : options.state === "jotai"
          ? "src/store/task-atoms.ts"
          : "src/context/task-context.tsx",
    },
    {
      src: !options.tanstackQuery ? "greeting.tsx.hbs" : "greeting-tq.tsx.hbs",
      dest: "src/components/greeting.tsx",
    },
  ].filter(Boolean) as FileMapping[];

  handlebars.registerHelper({
    or: (...args) => args.slice(0, -1).some(Boolean),
    and: (...args) => args.slice(0, -1).every(Boolean),
    not: (val) => !val,
    eq: (a, b) => a === b,
  });

  fileMap.forEach(async ({ src, dest }) => {
    const srcPath = path.join(dirs.hbsDir, src);
    const destPath = path.join(dirs.tempDir, dest);

    let content = await fs.readFile(srcPath, "utf8");
    content = handlebars.compile(content)({
      ...options,
      useProviders,
    });

    await fs.writeFile(destPath, content);
  });
};

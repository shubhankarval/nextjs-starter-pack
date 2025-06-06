import path from "path";
import fs from "fs-extra";
import type { FileProps, FileMapping } from "../types.js";

export async function addFiles({
  darkMode,
  rhf,
  tanstackQuery,
  state,
  prisma,
  optionalDir,
  tempDir,
}: FileProps) {
  const fileMap: FileMapping[] = [];
  const commonDir = path.join(optionalDir, "common");

  if (darkMode) {
    const darkModeDir = path.join(optionalDir, "dark-mode");

    fileMap.push(
      {
        src: path.join(darkModeDir, "globals.css"),
        dest: path.join(tempDir, "src/app/globals.css"),
      },
      {
        src: path.join(darkModeDir, "theme-switch.tsx"),
        dest: path.join(tempDir, "src/components/theme-switch.tsx"),
      }
    );
  }

  if (rhf) {
    const rhfDir = path.join(optionalDir, "react-hook-form");

    fileMap.push(
      {
        src: path.join(rhfDir, "form.tsx"),
        dest: path.join(tempDir, "src/components/ui/form.tsx"),
      },
      {
        src: path.join(rhfDir, "label.tsx"),
        dest: path.join(tempDir, "src/components/ui/label.tsx"),
      }
    );
  }

  if (tanstackQuery) {
    const tanstackQueryDir = path.join(optionalDir, "tanstack-query");

    fileMap.push(
      {
        src: path.join(tanstackQueryDir, "get-query-client.ts"),
        dest: path.join(tempDir, "src/lib/get-query-client.ts"),
      },
      {
        src: path.join(tanstackQueryDir, "greeting.tsx"),
        dest: path.join(tempDir, "src/components/greeting.tsx"),
      }
    );
  }

  if (state === "zustand") {
    const zustandDir = path.join(optionalDir, "zustand");

    fileMap.push({
      src: path.join(zustandDir, "task-store.ts"),
      dest: path.join(tempDir, "src/store/task-store.ts"),
    });
  } else if (state === "jotai") {
    const jotaiDir = path.join(optionalDir, "jotai");

    fileMap.push({
      src: path.join(jotaiDir, "task-atoms.ts"),
      dest: path.join(tempDir, "src/store/task-atoms.ts"),
    });
  }

  if (state === "zustand" || state === "jotai") {
    fileMap.push({
      src: path.join(commonDir, "tsconfig.json"),
      dest: path.join(tempDir, "tsconfig.json"),
    });
    await fs.ensureDir(path.join(tempDir, "src/store"));
    await fs.remove(path.join(tempDir, "src/context"));
  }

  if (prisma) {
    const prismaDir = path.join(optionalDir, "prisma");

    fileMap.push(
      {
        src: path.join(prismaDir, ".env.example"),
        dest: path.join(tempDir, ".env.example"),
      },
      {
        src: path.join(prismaDir, ".gitignore"),
        dest: path.join(tempDir, ".gitignore"),
      },
      {
        src: path.join(prismaDir, "schema.prisma"),
        dest: path.join(tempDir, "prisma/schema.prisma"),
      },
      {
        src: path.join(prismaDir, "seed.ts"),
        dest: path.join(tempDir, "prisma/seed.ts"),
      },
      {
        src: path.join(prismaDir, "prisma.ts"),
        dest: path.join(tempDir, "src/lib/prisma.ts"),
      },
      {
        src: path.join(prismaDir, "tasks.ts"),
        dest: path.join(tempDir, "src/actions/tasks.ts"),
      }
    );

    await fs.ensureDir(path.join(tempDir, "prisma"));
    await fs.remove(path.join(tempDir, "src/types.ts"));
  }

  // copy files in parallel
  await Promise.all(
    fileMap.map(({ src, dest }) => fs.copy(src, dest, { overwrite: true }))
  );
}

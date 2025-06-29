import path from "path";
import fs from "fs-extra";
import type { ScaffoldContext, FileMapping } from "../types.js";

export async function addFiles({
  darkMode,
  rhf,
  tanstackQuery,
  state,
  prisma,
  auth,
  optionalDir,
  tempDir,
}: ScaffoldContext) {
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

    if (!state) {
      fileMap.push({
        src: path.join(rhfDir, "task-context-rhf.tsx"),
        dest: path.join(tempDir, "src/context/task-context.tsx"),
      });
    }
  }

  if (tanstackQuery) {
    const tanstackQueryDir = path.join(optionalDir, "tanstack-query");

    fileMap.push({
      src: path.join(tanstackQueryDir, "get-query-client.ts"),
      dest: path.join(tempDir, "src/lib/get-query-client.ts"),
    });
  }

  if (state) {
    fileMap.push({
      src: path.join(commonDir, "tsconfig.json"),
      dest: path.join(tempDir, "tsconfig.json"),
    });
    await fs.ensureDir(path.join(tempDir, "src/store"));
    await fs.remove(path.join(tempDir, "src/context"));

    if (state === "zustand") {
      const zustandDir = path.join(optionalDir, "zustand");
      const zustandFile = rhf ? "task-store-rhf.ts" : "task-store.ts";

      fileMap.push({
        src: path.join(zustandDir, zustandFile),
        dest: path.join(tempDir, "src/store/task-store.ts"),
      });
    } else if (state === "jotai") {
      const jotaiDir = path.join(optionalDir, "jotai");
      const jotaiFile = rhf ? "task-atoms-rhf.ts" : "task-atoms.ts";

      fileMap.push({
        src: path.join(jotaiDir, jotaiFile),
        dest: path.join(tempDir, "src/store/task-atoms.ts"),
      });
    }
  }

  if (prisma) {
    const prismaDir = path.join(optionalDir, "prisma");

    fileMap.push(
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

  if (auth) {
    fileMap.push({
      src: path.join(commonDir, "page.tsx"),
      dest: path.join(tempDir, "src/app/page.tsx"),
    });

    if (auth === "authjs") {
      const authJSDir = path.join(optionalDir, "authjs");

      fileMap.push(
        {
          src: path.join(authJSDir, "auth.ts"),
          dest: path.join(tempDir, "src/lib/auth.ts"),
        },
        {
          src: path.join(authJSDir, "route.ts"),
          dest: path.join(tempDir, "src/app/api/auth/[...nextauth]/route.ts"),
        },
        {
          src: path.join(authJSDir, "auth.tsx"),
          dest: path.join(tempDir, "src/components/auth.tsx"),
        }
      );
    } else if (auth === "clerk") {
      const clerkDir = path.join(optionalDir, "clerk");

      fileMap.push(
        {
          src: path.join(clerkDir, "auth.tsx"),
          dest: path.join(tempDir, "src/components/auth.tsx"),
        },
        {
          src: path.join(clerkDir, "middleware.ts"),
          dest: path.join(tempDir, "src/middleware.ts"),
        }
      );
    }
  }

  if (tanstackQuery || auth) {
    const tanstackQueryDir = path.join(optionalDir, "tanstack-query");
    const authJSDir = path.join(optionalDir, "authjs");
    const clerkDir = path.join(optionalDir, "clerk");

    const greetingDir =
      auth === "authjs"
        ? authJSDir
        : auth === "clerk"
        ? clerkDir
        : tanstackQueryDir;
    const greetingFile =
      auth && tanstackQuery ? "greeting-tanstack.tsx" : "greeting.tsx";

    fileMap.push({
      src: path.join(greetingDir, greetingFile),
      dest: path.join(tempDir, "src/components/greeting.tsx"),
    });
  }

  // copy files in parallel
  await Promise.all(
    fileMap.map(({ src, dest }) => fs.copy(src, dest, { overwrite: true }))
  );
}

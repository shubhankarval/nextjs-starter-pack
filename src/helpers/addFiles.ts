import path from "path";
import fs from "fs-extra";
import type { Options, Dirs, FileMapping } from "../types.js";

export async function addFiles(options: Options, dirs: Dirs) {
  const fileMap: FileMapping[] = [];
  const { optionalDir, tempDir } = dirs;
  const commonDir = path.join(optionalDir, "common");

  if (options.darkMode) {
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

  if (options.rhf) {
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

  if (options.tanstackQuery) {
    const tanstackQueryDir = path.join(optionalDir, "tanstack-query");

    fileMap.push({
      src: path.join(tanstackQueryDir, "get-query-client.ts"),
      dest: path.join(tempDir, "src/lib/get-query-client.ts"),
    });
  }

  if (options.state) {
    fileMap.push({
      src: path.join(commonDir, "tsconfig.json"),
      dest: path.join(tempDir, "tsconfig.json"),
    });
    await fs.ensureDir(path.join(tempDir, "src/store"));
    await fs.remove(path.join(tempDir, "src/context"));
  } else {
    await fs.ensureDir(path.join(tempDir, "src/context"));
  }

  if (options.orm) {
    await fs.remove(path.join(tempDir, "src/types.ts"));

    if (options.orm === "prisma") {
      const prismaDir = path.join(optionalDir, "prisma");

      fileMap.push(
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
    } else if (options.orm === "drizzle") {
      const drizzleDir = path.join(optionalDir, "drizzle");

      fileMap.push(
        {
          src: path.join(drizzleDir, "drizzle.config.ts"),
          dest: path.join(tempDir, "drizzle.config.ts"),
        },
        {
          src: path.join(drizzleDir, "schema.ts"),
          dest: path.join(tempDir, "src/db/schema.ts"),
        },
        {
          src: path.join(drizzleDir, "migrate.ts"),
          dest: path.join(tempDir, "src/db/migrate.ts"),
        },
        {
          src: path.join(drizzleDir, "seed.ts"),
          dest: path.join(tempDir, "src/db/seed.ts"),
        },
        {
          src: path.join(drizzleDir, "index.ts"),
          dest: path.join(tempDir, "src/db/index.ts"),
        },
        {
          src: path.join(drizzleDir, "tasks.ts"),
          dest: path.join(tempDir, "src/actions/tasks.ts"),
        }
      );

      await fs.ensureDir(path.join(tempDir, "src/db"));
    }
  }

  if (options.auth) {
    fileMap.push({
      src: path.join(commonDir, "page.tsx"),
      dest: path.join(tempDir, "src/app/page.tsx"),
    });

    if (options.auth === "authjs") {
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
    } else if (options.auth === "clerk") {
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

  // copy files in parallel
  await Promise.all(
    fileMap.map(({ src, dest }) => fs.copy(src, dest, { overwrite: true }))
  );
}

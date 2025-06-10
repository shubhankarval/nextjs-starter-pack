import path from "path";
import fs from "fs-extra";

import type { FileProps } from "../../types.js";
import { replacePlaceholdersInFile } from "../utils.js";

type PrismaProps = Pick<FileProps, "state" | "prisma" | "tempDir">;

export const modifyPrisma = async ({
  state,
  prisma,
  tempDir,
}: PrismaProps) => {
  let statePath = "";
  if (state === "zustand") {
    statePath = path.join(tempDir, "src/store/task-store.ts");
  } else if (state === "jotai") {
    statePath = path.join(tempDir, "src/store/task-atoms.ts");
  } else {
    statePath = path.join(tempDir, "src/context/task-context.tsx");
  }

  let importStmt = !prisma
    ? "import { Task } from '@/types';"
    : "import { Task } from '@prisma/client';";

  const replacements = {
    IMPORT: importStmt,
  };

  await replacePlaceholdersInFile(statePath, replacements);
};

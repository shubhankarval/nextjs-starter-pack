import type { FileProps } from "../../types.js";
import { modifyProviders } from "./providers.js";
import { modifyTasksComponent } from "./tasks-component.js";
import { modifyPage } from "./page.js";
import { modifyPrisma } from "./prisma.js";

export async function modifyFiles({
  darkMode,
  rhf,
  tanstackQuery,
  state,
  prisma,
  optionalDir,
  tempDir,
}: FileProps) {
  // Modify files based on options

  await modifyProviders({
    darkMode,
    tanstackQuery,
    state,
    optionalDir,
    tempDir,
  });
  await modifyTasksComponent({ state, tempDir });
  await modifyPage({ darkMode, rhf, state, tempDir });
  await modifyPrisma({ state, prisma, tempDir });
}

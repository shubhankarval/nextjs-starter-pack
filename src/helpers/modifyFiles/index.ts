import type { FileProps } from "../../types.js";
import { modifyProviders } from "./providers.js";
import { modifyLayout } from "./layout.js";
import { modifyTasksComponent } from "./tasks-component.js";
import { modifyTodoList } from "./todo-list.js";
import { modifyPrisma } from "./prisma.js";
import { modifyEnv } from "./env.js";

export async function modifyFiles({
  darkMode,
  rhf,
  tanstackQuery,
  state,
  prisma,
  auth,
  tempDir,
}: FileProps) {
  // Modify files based on options

  await modifyProviders({
    darkMode,
    tanstackQuery,
    state,
    tempDir,
  });
  await modifyLayout({ darkMode, tanstackQuery, state, auth, tempDir });
  await modifyTasksComponent({ state, tempDir });
  await modifyTodoList({ darkMode, rhf, state, tempDir });
  await modifyPrisma({ state, prisma, tempDir });
  await modifyEnv({ prisma, auth, tempDir });
}

import path from "path";

import type { FileProps } from "../../types.js";
import { replacePlaceholdersInFile } from "../utils.js";

type TasksComponentProps = Pick<FileProps, "state" | "tempDir">;

export const modifyTasksComponent = async ({
  state,
  tempDir,
}: TasksComponentProps) => {
  //components/tasks.tsx

  const tasksPath = path.join(tempDir, "src/components/tasks.tsx");
  let importStmt = "";
  let jotaiImport = "";
  const taskState: string[] = [];

  if (state === "zustand") {
    importStmt = "import useTaskStore from '@store/task-store';";
    taskState.push(
      "const { filter, loading, filterTasks, toggleComplete, deleteTask } = useTaskStore();",
      "const filteredTasks = filterTasks();"
    );
  } else if (state === "jotai") {
    importStmt =
      "import { filteredTasksAtom, filterAtom, loadingAtom, deleteTaskAtom, toggleCompleteAtom } from '@store/task-atoms';";
    jotaiImport = "import { useAtomValue, useSetAtom } from 'jotai';";
    taskState.push(
      "const filteredTasks = useAtomValue(filteredTasksAtom);",
      "const filter = useAtomValue(filterAtom);",
      "const loading = useAtomValue(loadingAtom);",
      "const deleteTask = useSetAtom(deleteTaskAtom);",
      "const toggleComplete = useSetAtom(toggleCompleteAtom);"
    );
  } else {
    importStmt = "import { useTaskContext } from '@context/task-context';";
    taskState.push(
      "const { filteredTasks, filter, loading, toggleComplete, deleteTask } = useTaskStore();"
    );
  }

  const replacements = {
    IMPORT: importStmt,
    JOTAI_IMPORT: jotaiImport,
    TASK_STATE: taskState.join("\n"),
  };

  await replacePlaceholdersInFile(tasksPath, replacements);
};

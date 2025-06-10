import path from "path";

import type { FileProps } from "../../types.js";
import { replacePlaceholdersInFile } from "../utils.js";

type PageProps = Pick<FileProps, "darkMode" | "rhf" | "state" | "tempDir">;

export const modifyPage = async ({
  darkMode,
  rhf,
  state,
  tempDir,
}: PageProps) => {
  //app/page.tsx
  const pagePath = path.join(tempDir, "src/app/page.tsx");

  const topImports: string[] = [];
  const bottomImports: string[] = [];
  let themeSwitch = "";
  let formSchema = "";
  let form = `<div className="mb-6 flex space-x-2"><Input type="text" placeholder="Add a new task..." value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addTask(); }} className="flex-1" /><Button size="icon" aria-label="Add task" onClick={addTask}><Plus className="h-4 w-4" /></Button></div>`;
  const stateLogic: string[] = [];
  const formLogic: string[] = [];

  if (state === "zustand") {
    topImports.push("import { useEffect } from 'react';");
    bottomImports.push("import useTaskStore from '@store/task-store';");
    stateLogic.push(
      `const { fetchTasks, addTask, filter, setFilter${
        rhf ? "" : ", newTask, setNewTask"
      } } = useTaskStore();\n`,
      "useEffect(() => { fetchTasks(); }, [fetchTasks]);"
    );
  } else if (state === "jotai") {
    topImports.push(
      "import { useEffect } from 'react';",
      "import { useAtom, useSetAtom } from 'jotai';"
    );
    bottomImports.push(
      `import { fetchTasksAtom, filterAtom, addTaskAtom${
        rhf ? "" : ", newTaskAtom"
      } } from '@store/task-atoms';`
    );
    stateLogic.push(
      "const fetchTasks = useSetAtom(fetchTasksAtom);",
      "useEffect(() => { fetchTasks(); }, [fetchTasks]);\n",
      "const [filter, setFilter] = useAtom(filterAtom);",
      "const addTask = useSetAtom(addTaskAtom);"
    );
    !rhf &&
      stateLogic.push("const [newTask, setNewTask] = useAtom(newTaskAtom);");
  } else {
    bottomImports.push(
      "import { useTaskContext } from '@context/task-context';"
    );
    stateLogic.push(
      `const { addTask, filter, setFilter${
        rhf ? "" : ", newTask, setNewTask"
      } } = useTaskContext();`
    );
  }

  if (darkMode) {
    bottomImports.push(
      "import { ThemeSwitch } from '@components/theme-switch';"
    );
    themeSwitch = "<ThemeSwitch />";
  }

  if (rhf) {
    topImports.push(
      "import { zodResolver } from '@hookform/resolvers/zod';",
      "import { useForm } from 'react-hook-form';",
      "import { z } from 'zod';"
    );
    bottomImports.push(
      "import { Form, FormControl, FormField, FormItem, FormMessage } from '@components/ui/form';"
    );
    formSchema =
      "const formSchema = z.object({taskName: z.string().min(2, {message: 'Task name must be at least 2 characters.'})});";
    form = `<Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="mb-6 flex space-x-2"><FormField control={form.control} name="taskName" render={({ field }) => (<FormItem className="flex-1"><FormControl><Input type="text" placeholder="Add a new task..." {...field} /></FormControl><FormMessage /></FormItem>)} /><Button size="icon" aria-label="Add task" type="submit"><Plus className="h-4 w-4" /></Button></form></Form>`;
    formLogic.push(
      `const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema), defaultValues: { taskName: '', }, });\n`,
      `function onSubmit(values: z.infer<typeof formSchema>) { addTask(values.taskName); form.reset(); }`
    );
  }

  const replacements = {
    TOP_IMPORTS: topImports.join("\n"),
    BOTTOM_IMPORTS: bottomImports.join("\n"),
    FORM_SCHEMA: formSchema,
    STATE_LOGIC: stateLogic.join("\n"),
    FORM_LOGIC: formLogic.join("\n"),
    THEME_SWITCH: themeSwitch,
    FORM: form,
  };

  await replacePlaceholdersInFile(pagePath, replacements);
};

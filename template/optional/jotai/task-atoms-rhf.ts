import { atom } from "jotai";

{{IMPORT}}
import {
  getAllTasks,
  addTaskToDB,
  deleteTaskFromDB,
  toggleTaskCompletionInDB,
} from "@actions/tasks";

export type Filter = "all" | "active" | "done";

// Primitive atoms
export const tasksAtom = atom<Task[]>([]);
export const filterAtom = atom<Filter>("all");
export const loadingAtom = atom<boolean>(true);

// Derived atom to get filtered tasks
export const filteredTasksAtom = atom((get) => {
  const tasks = get(tasksAtom);
  const filter = get(filterAtom);
  if (filter === "active") return tasks.filter((t) => !t.completed);
  if (filter === "done") return tasks.filter((t) => t.completed);
  return tasks;
});

// Initial load
export const fetchTasksAtom = atom(null, async (_, set) => {
  const data = await getAllTasks();
  set(tasksAtom, data);
  set(loadingAtom, false);
});

// Task management atoms
export const addTaskAtom = atom(null, async (get, set, newTaskName: string) => {
  const text = newTaskName.trim();
  if (!text) return;

  const newTask: Task = {
    id: crypto.randomUUID(),
    text,
    completed: false,
  };

  set(tasksAtom, [...get(tasksAtom), newTask]);
  await addTaskToDB(newTask);
});

export const deleteTaskAtom = atom(null, async (get, set, id: string) => {
  set(
    tasksAtom,
    get(tasksAtom).filter((task) => task.id !== id)
  );
  await deleteTaskFromDB(id);
});

export const toggleCompleteAtom = atom(null, async (get, set, id: string) => {
  set(
    tasksAtom,
    get(tasksAtom).map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    )
  );
  await toggleTaskCompletionInDB(id);
});

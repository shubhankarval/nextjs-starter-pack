import { atom } from 'jotai';

import { Task } from '@/types';
import {
  getAllTasks,
  addTaskToDB,
  deleteTaskFromDB,
  toggleTaskCompletionInDB,
} from '@actions/tasks';

export type Filter = 'all' | 'active' | 'done';

// Primitive atoms
export const tasksAtom = atom<Task[]>([]);
export const newTaskAtom = atom<string>('');
export const filterAtom = atom<Filter>('all');
export const loadingAtom = atom<boolean>(true);

// Derived atom to get filtered tasks
export const filteredTasksAtom = atom((get) => {
  const tasks = get(tasksAtom);
  const filter = get(filterAtom);
  if (filter === 'active') return tasks.filter((t) => !t.completed);
  if (filter === 'done') return tasks.filter((t) => t.completed);
  return tasks;
});

// Initial load
export const fetchTasksAtom = atom(null, async (_, set) => {
  const data = await getAllTasks();
  set(tasksAtom, data);
  set(loadingAtom, false);
});

// Task management atoms
export const addTaskAtom = atom(null, async (get, set) => {
  const text = get(newTaskAtom).trim();
  if (!text) return;

  const newTask: Task = {
    id: crypto.randomUUID(),
    text,
    completed: false,
  };

  set(tasksAtom, [...get(tasksAtom), newTask]);
  set(newTaskAtom, '');
  await addTaskToDB(newTask);
});

export const deleteTaskAtom = atom(null, async (get, set, id: string) => {
  set(
    tasksAtom,
    get(tasksAtom).filter((task) => task.id !== id),
  );
  await deleteTaskFromDB(id);
});

export const toggleCompleteAtom = atom(null, async (get, set, id: string) => {
  set(
    tasksAtom,
    get(tasksAtom).map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    ),
  );
  await toggleTaskCompletionInDB(id);
});

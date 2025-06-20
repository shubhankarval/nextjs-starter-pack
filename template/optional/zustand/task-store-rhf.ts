import { create } from "zustand";

{{IMPORT}}
import {
  getAllTasks,
  deleteTaskFromDB,
  addTaskToDB,
  toggleTaskCompletionInDB,
} from "@actions/tasks";

type Filter = "all" | "active" | "done";

interface TaskState {
  tasks: Task[];
  filter: Filter;
  loading: boolean;
}

interface TaskActions {
  setFilter: (val: Filter) => void;
  filterTasks: () => Task[];
  fetchTasks: () => Promise<void>;
  addTask: (newTaskName: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
}

const useTaskStore = create<TaskState & TaskActions>()((set, get) => ({
  // State
  tasks: [],
  filter: "all",
  loading: true,

  // Actions
  filterTasks: () => {
    const { tasks, filter } = get();
    if (filter === "active") return tasks.filter((t) => !t.completed);
    if (filter === "done") return tasks.filter((t) => t.completed);
    return tasks;
  },

  setFilter: (val) => set({ filter: val }),

  fetchTasks: async () => {
    const tasks = await getAllTasks();
    set({ tasks, loading: false });
  },

  addTask: async (newTaskName) => {
    const { tasks } = get();
    if (newTaskName.trim()) {
      const newTaskObj: Task = {
        id: crypto.randomUUID(),
        text: newTaskName,
        completed: false,
      };

      set({ tasks: [...tasks, newTaskObj] });
      await addTaskToDB(newTaskObj);
    }
  },

  deleteTask: async (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
    await deleteTaskFromDB(id);
  },

  toggleComplete: async (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    }));
    await toggleTaskCompletionInDB(id);
  },
}));

export default useTaskStore;

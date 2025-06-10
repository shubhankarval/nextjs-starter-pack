import React, { createContext, useContext, useEffect, useState } from "react";

{{IMPORT}}
import {
  getAllTasks,
  deleteTaskFromDB,
  addTaskToDB,
  toggleTaskCompletionInDB,
} from "@actions/tasks";

type Filter = "all" | "active" | "done";

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  filter: Filter;
  loading: boolean;
  setFilter: (val: Filter) => void;
  addTask: (val: string) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setTasks(await getAllTasks());
      setLoading(false);
    })();
  }, []);

  const addTask = async (val: string) => {
    if (val.trim()) {
      const newTaskObj: Task = {
        id: crypto.randomUUID(),
        text: val,
        completed: false,
      };
      setTasks((prev) => [...prev, newTaskObj]);
      await addTaskToDB(newTaskObj);
    }
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    await deleteTaskFromDB(id);
  };

  const toggleComplete = async (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    await toggleTaskCompletionInDB(id);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "done") return task.completed;
    return true;
  });

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        filter,
        loading,
        setFilter,
        addTask,
        deleteTask,
        toggleComplete,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within TaskProvider");
  }
  return context;
};

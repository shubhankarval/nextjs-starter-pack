'use server';

import { Task } from '@/types';

// Mock in-memory database for tasks
const taskMap: Map<string, Task> = new Map([
  ['1', { id: '1', text: 'Buy groceries', completed: false }],
  ['2', { id: '2', text: 'Walk the dog', completed: false }],
  ['3', { id: '3', text: 'Read a book', completed: true }],
]);

export const getAllTasks = async (): Promise<Task[]> => {
  return Array.from(taskMap.values());
};

export const addTaskToDB = async (task: Task): Promise<void> => {
  taskMap.set(task.id, task);
};

export const deleteTaskFromDB = async (id: string): Promise<void> => {
  taskMap.delete(id);
};

export const toggleTaskCompletionInDB = async (id: string): Promise<void> => {
  const task = taskMap.get(id);
  if (task) {
    taskMap.set(id, { ...task, completed: !task.completed });
  }
};

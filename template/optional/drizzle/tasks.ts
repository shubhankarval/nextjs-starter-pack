"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { tasks, type Task } from "@/db/schema";

export const getAllTasks = async (): Promise<Task[]> => {
  return await db.select().from(tasks);
};

export const addTaskToDB = async (task: Task): Promise<void> => {
  await db.insert(tasks).values(task);
};

export const deleteTaskFromDB = async (id: string): Promise<void> => {
  await db.delete(tasks).where(eq(tasks.id, id));
};

export const toggleTaskCompletionInDB = async (id: string): Promise<void> => {
  const task = await db.select().from(tasks).where(eq(tasks.id, id)).get();
  if (task) {
    await db
      .update(tasks)
      .set({ completed: !task.completed })
      .where(eq(tasks.id, id));
  }
};

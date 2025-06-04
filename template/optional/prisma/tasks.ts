'use server';

import prisma from '@lib/prisma';
import type { Task } from '@prisma/client';

export const getAllTasks = async (): Promise<Task[]> => {
  return prisma.task.findMany();
};

export const addTaskToDB = async (task: Task): Promise<void> => {
  await prisma.task.create({
    data: task,
  });
};

export const deleteTaskFromDB = async (id: string): Promise<void> => {
  await prisma.task.delete({
    where: { id },
  });
};

export const toggleTaskCompletionInDB = async (id: string): Promise<void> => {
  const task = await prisma.task.findUnique({ where: { id } });
  if (task) {
    await prisma.task.update({
      where: { id },
      data: { completed: !task.completed },
    });
  }
};

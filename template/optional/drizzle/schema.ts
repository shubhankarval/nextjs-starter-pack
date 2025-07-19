import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(),
  text: text('text').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
});

export type Task = typeof tasks.$inferSelect;

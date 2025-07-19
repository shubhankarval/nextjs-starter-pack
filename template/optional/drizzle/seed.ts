import { db } from '@/db';
import { tasks } from '@/db/schema';
import type { Task } from '@/db/schema';

const initialTasks: Task[] = [
  { id: '1', text: 'Buy groceries', completed: false },
  { id: '2', text: 'Walk the dog', completed: false },
  { id: '3', text: 'Read a book', completed: true },
];

async function main() {
  console.log('🌱 Seeding database with tasks...');

  for (const task of initialTasks) {
    await db.insert(tasks).values(task);
  }

  console.log('✅ Seed completed!');
}

main().catch((e) => {
  console.error('❌ Error while seeding:', e);
  process.exit(1);
});

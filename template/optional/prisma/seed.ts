import { PrismaClient, type Task } from '@prisma/client';

const prisma = new PrismaClient();

const initialTasks: Task[] = [
  { id: '1', text: 'Buy groceries', completed: false },
  { id: '2', text: 'Walk the dog', completed: false },
  { id: '3', text: 'Read a book', completed: true },
];

async function main() {
  console.log('🌱 Seeding database with tasks...');

  for (const task of initialTasks) {
    await prisma.task.create({
      data: task,
    });
  }

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error while seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

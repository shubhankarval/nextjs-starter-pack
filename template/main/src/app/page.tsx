import Link from 'next/link';
import { Github, Package } from 'lucide-react';

import { TodoList } from '@components/todo-list';

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden font-sans">
      <header className="w-full px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-end space-x-4">
          <Link
            href="https://github.com/shubhankarval/nextjs-starter-pack"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground flex items-center text-sm"
          >
            <Github className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </Link>
          <Link
            href="https://www.npmjs.com/package/nextjs-starter-pack"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground flex items-center text-sm"
          >
            <Package className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">npm</span>
          </Link>
        </div>
      </header>

      <main className="mb-5 flex items-center justify-center transition-colors duration-300 lg:mt-5">
        <TodoList />
      </main>

      <footer className="bg-background border-border fixed bottom-0 flex w-full justify-center border-t px-4 py-3">
        <p className="text-muted-foreground text-xs">
          &copy; {new Date().getFullYear() + ' nextjs-starter-pack. By '}
          <Link
            href="https://github.com/shubhankarval"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            <span>Shubhankar Valimbe.</span>
          </Link>
        </p>
      </footer>
    </div>
  );
}

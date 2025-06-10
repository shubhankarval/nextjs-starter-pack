'use client';
{{TOP_IMPORTS}}
import Link from 'next/link';
import { Github, Package, Plus } from 'lucide-react';

{{BOTTOM_IMPORTS}}
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Greeting } from '@components/greeting';
import { Tasks } from '@components/tasks';

{{FORM_SCHEMA}}

export default function Home() {
  {{STATE_LOGIC}}

  {{FORM_LOGIC}}

  return (
    <div className="min-h-screen overflow-hidden font-sans">
      {/* Header */}
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

      {/* Main content */}
      <main className="mb-5 flex items-center justify-center transition-colors duration-300 lg:mt-5">
        <div className="mx-auto flex w-full max-w-md flex-col p-6">
          <div className="mb-6 flex items-center gap-2">
            {{THEME_SWITCH}}
            <Greeting />
          </div>

          {{FORM}}
          
          <div className="mb-4 flex space-x-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className="flex-1"
            >
              All
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('active')}
              className="flex-1"
            >
              Active
            </Button>
            <Button
              variant={filter === 'done' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('done')}
              className="flex-1"
            >
              Done
            </Button>
          </div>
          {/* Task list */}
          <Tasks />
        </div>
      </main>

      {/* Footer */}
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

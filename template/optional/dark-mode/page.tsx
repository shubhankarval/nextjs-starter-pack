import Link from 'next/link';
import Image from 'next/image';
import {
  Github,
  Package,
  Zap,
  Database,
  Lock,
  Layers,
  RefreshCw,
  FileCode,
} from 'lucide-react';
import { Card } from '@components/Card/Card';
import { ThemeSwitch } from '@components/ThemeSwitch/ThemeSwitch';

export default function Home() {
  return (
    <div className="bg-background text-foreground flex flex-col overflow-hidden font-sans lg:h-screen">
      {/* Header */}
      <header className="border-border w-full border-b px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="https://nextjs.org/docs" target="_blank" rel="noreferrer">
            <Image
              src="/next.svg"
              alt="Next.js logo"
              width={100}
              height={30}
              className="dark:invert"
            />
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeSwitch />
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
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto flex max-w-7xl flex-1 flex-col overflow-hidden px-4 py-4">
        {/* Hero section */}
        <section className="mb-12">
          <div className="flex flex-col items-center text-center">
            <h1 className="mb-2 text-3xl font-bold tracking-tight">
              Welcome to nextjs-starter-pack
            </h1>
            <p className="text-muted-foreground mb-4 max-w-2xl">
              A powerful starter kit for Next.js applications with
              pre-configured integrations to popular packages.
            </p>
            <div className="bg-foreground min-w-60 rounded-lg p-4">
              <pre className="text-background text-sm">
                <code className="font-mono">
                  npx nextjs-starter-pack@latest
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="mb-6">
          <h2 className="mb-4 text-center text-xl font-bold">
            Features & Integrations
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <Card
              icon={<Zap className="h-5 w-5 text-orange-500" />}
              title="Performance"
              description="Optimized for speed with Next.js App Router"
            />
            <Card
              icon={<Database className="h-5 w-5 text-blue-500" />}
              title="Database"
              description="Pre-configured database integrations"
            />
            <Card
              icon={<Lock className="h-5 w-5 text-green-500" />}
              title="Authentication"
              description="Ready-to-use auth solutions"
            />
            <Card
              icon={<Layers className="h-5 w-5 text-purple-500" />}
              title="UI Components"
              description="Responsive UI components with Tailwind"
            />
            <Card
              icon={<RefreshCw className="h-5 w-5 text-red-500" />}
              title="State Management"
              description="Efficient state management setup"
            />
            <Card
              icon={<FileCode className="h-5 w-5 text-teal-500" />}
              title="TypeScript"
              description="Full TypeScript support and types"
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-border w-full border-t px-4 py-3">
        <div className="mx-auto flex max-w-7xl flex-col justify-center sm:flex-row">
          <p className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()}{' '}
            <Link
              href="https://github.com/shubhankarval"
              target="_blank"
              rel="noreferrer"
              className="text-foreground underline"
            >
              <span>Shubhankar Valimbe</span>
            </Link>
            . Licensed under the MIT License.
          </p>
        </div>
      </footer>
    </div>
  );
}

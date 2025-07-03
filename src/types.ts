export interface Options {
  darkMode?: boolean;
  rhf?: boolean;
  tanstackQuery?: boolean;
  state?: "zustand" | "jotai";
  orm?: "prisma" | "drizzle";
  auth?: "authjs" | "clerk";
  skipInstall?: boolean;
}

export interface Prompts extends Options {
  projectName?: string;
}

export interface Dirs {
  mainDir: string;
  optionalDir: string;
  tempDir: string;
  hbsDir: string;
}

export interface FileMapping {
  src: string;
  dest: string;
}

export interface PackageJson {
  name: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  prisma?: Record<string, string>;
}

export type PackageManager = "npm" | "yarn" | "pnpm";

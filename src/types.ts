export interface Options {
  darkMode?: boolean;
  rhf?: boolean;
  tanstackQuery?: boolean;
  state?: "zustand" | "jotai";
  prisma?: boolean;
  auth?: "authjs" | "clerk";
}

export interface ScaffoldContext extends Options {
  optionalDir: string;
  tempDir: string;
}

export interface Prompts extends Options {
  projectName?: string;
}

export interface FileMapping {
  src: string;
  dest: string;
}

export interface PackageJson {
  name: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  prisma?: Record<string, string>;
}

export type PackageManager = "npm" | "yarn" | "pnpm";

export interface Options {
  darkMode?: boolean;
  rhf?: boolean;
  tanstackQuery?: boolean;
  state?: "zustand" | "jotai" | "none";
  prisma?: boolean;
}

export interface FileProps extends Options {
  optionalDir: string;
  tempDir: string;
}

export interface FileMapping {
  src: string;
  dest: string;
}

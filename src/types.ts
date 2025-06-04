export interface Options {
  darkMode?: boolean;
  rhf?: boolean;
  tanstackQuery?: boolean;
  state?: "zustand" | "jotai" | "none";
  prisma?: boolean;
}

export interface FileMapping {
  src: string;
  dest: string;
}

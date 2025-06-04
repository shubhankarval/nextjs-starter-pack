import path from "path";
import fs from "fs-extra";
import type { Options, FileMapping } from "../types.js";

interface ModifyFileProps extends Options {
  optionalDir: string;
  tempDir: string;
}

export async function modifyFiles({
  darkMode,
  rhf,
  tanstackQuery,
  state,
  prisma,
  optionalDir,
  tempDir,
}: ModifyFileProps) {
  const isStateLibrary = state === "zustand" || state === "jotai";

  //layout.tsx & providers.tsx
  const providersPath = path.join(tempDir, "src/app/providers.tsx");

  if (isStateLibrary && !darkMode && !tanstackQuery) {
    const fileMap: FileMapping = {
      src: path.join(optionalDir, "common/layout.tsx"),
      dest: path.join(tempDir, "src/app/layout.tsx"),
    };
    await fs.copy(fileMap.src, fileMap.dest, {
      overwrite: true,
    });
    await fs.remove(providersPath);
  } else {
    const imports: string[] = [];
    const providersOpen: string[] = [];
    const providersClose: string[] = [];
    let queryClientInit = "";

    if (tanstackQuery) {
      imports.push(
        'import { QueryClientProvider } from "@tanstack/react-query";',
        'import { ReactQueryDevtools } from "@tanstack/react-query-devtools";',
        'import { getQueryClient } from "@lib/get-query-client";'
      );
      providersOpen.push("<QueryClientProvider client={queryClient}>");
      providersClose.unshift(
        "<ReactQueryDevtools initialIsOpen={false} />",
        "</QueryClientProvider>"
      );
      queryClientInit = "const queryClient = getQueryClient();";
    }

    if (darkMode) {
      imports.push('import { ThemeProvider } from "next-themes";');
      providersOpen.push(
        '<ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>'
      );
      providersClose.unshift("</ThemeProvider>");
    }

    if (!isStateLibrary) {
      imports.push('import { TaskProvider } from "@context/task-context";');
      providersOpen.push("<TaskProvider>");
      providersClose.unshift("</TaskProvider>");
    }

    const replacements = {
      IMPORTS: imports.join(""),
      QUERY_CLIENT: queryClientInit,
      PROVIDERS: [...providersOpen, "{children}", ...providersClose].join(""),
    };

    await replacePlaceholdersInFile(providersPath, replacements);
  }
}

const replacePlaceholdersInFile = async (
  filePath: string,
  replacements: Record<string, string>
) => {
  let content = await fs.readFile(filePath, "utf8");

  for (const [placeholder, value] of Object.entries(replacements)) {
    const regex = new RegExp(`{{${placeholder}}}`, "g");
    content = content.replace(regex, value);
  }

  await fs.writeFile(filePath, content, "utf8");
};

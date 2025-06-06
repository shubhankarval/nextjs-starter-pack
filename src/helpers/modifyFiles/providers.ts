import path from "path";
import fs from "fs-extra";

import type { FileProps, FileMapping } from "../../types.js";
import { replacePlaceholdersInFile } from "../utils.js";

type ProvidersProps = Pick<
  FileProps,
  "darkMode" | "tanstackQuery" | "state" | "optionalDir" | "tempDir"
>;

export const modifyProviders = async ({
  darkMode,
  tanstackQuery,
  state,
  optionalDir,
  tempDir,
}: ProvidersProps) => {
  //layout.tsx & providers.tsx

  const providersPath = path.join(tempDir, "src/app/providers.tsx");
  const isStateLibrary = state && state !== "none";

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
      IMPORTS: imports.join("\n"),
      QUERY_CLIENT: queryClientInit,
      PROVIDERS: [...providersOpen, "{children}", ...providersClose].join("\n"),
    };

    await replacePlaceholdersInFile(providersPath, replacements);
  }
};

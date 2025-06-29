import path from "path";
import fs from "fs-extra";

import type { ScaffoldContext } from "../../types.js";
import { replacePlaceholdersInFile } from "../utils.js";

type ProvidersProps = Pick<
  ScaffoldContext,
  "darkMode" | "tanstackQuery" | "state" | "tempDir"
>;

export const modifyProviders = async ({
  darkMode,
  tanstackQuery,
  state,
  tempDir,
}: ProvidersProps) => {
  //providers.tsx

  const providersPath = path.join(tempDir, "src/app/providers.tsx");

  if (state && !darkMode && !tanstackQuery) {
    await fs.remove(providersPath);
  } else {
    const imports: string[] = [];
    const providersOpen: string[] = [];
    const providersClose: string[] = [];
    let queryClientInit = "";

    if (tanstackQuery) {
      imports.push(
        'import { QueryClientProvider } from "@tanstack/react-query";',
        'import { getQueryClient } from "@lib/get-query-client";'
      );
      providersOpen.push("<QueryClientProvider client={queryClient}>");
      providersClose.unshift("</QueryClientProvider>");
      queryClientInit = "const queryClient = getQueryClient();";
    }

    if (darkMode) {
      imports.push('import { ThemeProvider } from "next-themes";');
      providersOpen.push(
        '<ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>'
      );
      providersClose.unshift("</ThemeProvider>");
    }

    if (!state) {
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

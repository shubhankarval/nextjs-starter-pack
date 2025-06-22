import path from "path";

import type { FileProps } from "../../types.js";
import { replacePlaceholdersInFile } from "../utils.js";

type LayoutProps = Pick<
  FileProps,
  "darkMode" | "tanstackQuery" | "state" | "auth" | "tempDir"
>;

export const modifyLayout = async ({
  darkMode,
  tanstackQuery,
  state,
  auth,
  tempDir,
}: LayoutProps) => {
  //layout.tsx

  const layoutPath = path.join(tempDir, "src/app/layout.tsx");
  let clerkImpt = "";
  let providerImpt = "";
  const providersOpen: string[] = [];
  const providersClose: string[] = [];

  if (auth === "clerk") {
    clerkImpt = "import { ClerkProvider } from '@clerk/nextjs';";
    providersOpen.push("<ClerkProvider>");
    providersClose.unshift("</ClerkProvider>");
  }

  if (!state || state === "none" || darkMode || tanstackQuery) {
    providerImpt = "import { Providers } from './providers';";
    providersOpen.push("<Providers>");
    providersClose.unshift("</Providers>");
  }

  const replacements = {
    CLERK_IMPORT: clerkImpt,
    PROVIDER_IMPORT: providerImpt,
    PROVIDERS: [...providersOpen, "{children}", ...providersClose].join("\n"),
  };

  await replacePlaceholdersInFile(layoutPath, replacements);
};

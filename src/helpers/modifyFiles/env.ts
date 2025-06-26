import path from "path";

import type { ScaffoldContext } from "../../types.js";
import { replacePlaceholdersInFile } from "../utils.js";

type EnvProps = Pick<ScaffoldContext, "prisma" | "auth" | "tempDir">;

export const modifyEnv = async ({ prisma, auth, tempDir }: EnvProps) => {
  //.env & .env.example
  const envPath = path.join(tempDir, ".env");
  const envExamplePath = path.join(tempDir, ".env.example");

  const envVars = [];
  const envExampleVars = [];

  if (prisma) {
    envVars.push('DATABASE_URL="file:./dev.db"');
    envExampleVars.push('DATABASE_URL=""');
  }

  if (auth === "authjs") {
    envVars.push(
      'AUTH_SECRET="<YOUR_AUTH_SECRET>"',
      'AUTH_GITHUB_ID="<YOUR_GITHUB_CLIENT_ID>"',
      'AUTH_GITHUB_SECRET="<YOUR_GITHUB_CLIENT_SECRET>"'
    );
    envExampleVars.push(
      'AUTH_SECRET=""',
      'AUTH_GITHUB_ID=""',
      'AUTH_GITHUB_SECRET=""'
    );
  } else if (auth === "clerk") {
    envVars.push(
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="<YOUR_CLERK_PUBLISHABLE_KEY>"',
      'CLERK_SECRET_KEY="<YOUR_CLERK_SECRET_KEY>"'
    );
    envExampleVars.push(
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""',
      'CLERK_SECRET_KEY=""'
    );
  }

  const replacements = {
    ENV_VARS: envVars.join("\n"),
  };
  await replacePlaceholdersInFile(envPath, replacements);

  replacements.ENV_VARS = envExampleVars.join("\n");
  await replacePlaceholdersInFile(envExamplePath, replacements);
};

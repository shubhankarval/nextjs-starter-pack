import { execSync } from "child_process";
import fs from "fs-extra";

import { PackageManager } from "../types.js";

export const getPackageManager = (): PackageManager => {
  let packageManager: PackageManager = "npm";
  try {
    // Check if yarn is installed
    execSync("yarn --version", { stdio: "ignore" });
    packageManager = "yarn";
  } catch (e) {
    // Check if pnpm is installed
    try {
      execSync("pnpm --version", { stdio: "ignore" });
      packageManager = "pnpm";
    } catch (e) {
      // Fallback to npm
    }
  }
  return packageManager;
};

export const replacePlaceholdersInFile = async (
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

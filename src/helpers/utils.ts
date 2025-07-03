import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";

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

export async function swapPackageJsonFiles(dir: string): Promise<void> {
  const pkg = path.join(dir, "package.json");
  const _pkg = path.join(dir, "_package.json");
  const temp = path.join(dir, "_temp_package.json");

  try {
    await fs.rename(pkg, temp); // package.json → _temp_package.json
    await fs.rename(_pkg, pkg); // _package.json → package.json
    await fs.rename(temp, _pkg); // _temp_package.json → _package.json
    await fs.remove(temp); // Clean up temporary file
  } catch (err) {
    console.error("❌ Failed to swap files:", err);
    throw err;
  }
}

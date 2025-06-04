import { execSync } from "child_process";

type PackageManager = "npm" | "yarn" | "pnpm";

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

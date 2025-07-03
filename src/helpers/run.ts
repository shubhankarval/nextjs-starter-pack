import { exec } from "child_process";
import { promisify } from "util";
import ora from "ora";
import chalk from "chalk";

import { PackageManager } from "../types.js";

const execAsync = promisify(exec);

export async function installDependencies(
  destDir: string,
  packageManager: PackageManager,
  skipInstall: boolean
) {
  const installSpinner = ora({
    text: chalk.cyan(
      "📦 Installing dependencies (this may take up to a minute)...\n"
    ),
    color: "cyan",
  });
  if (!skipInstall) {
    console.log("");
    installSpinner.start();
  }

  try {
    // Install dependencies
    process.chdir(destDir);

    if (!skipInstall) {
      if (packageManager === "yarn") {
        await execAsync("yarn");
      } else if (packageManager === "pnpm") {
        await execAsync("pnpm install");
      } else {
        await execAsync("npm install");
      }

      installSpinner.succeed(
        chalk.green(`Dependencies installed with ${packageManager}!`)
      );
    } else {
      if (packageManager === "yarn") {
        await execAsync("yarn --no-lockfile");
      } else if (packageManager === "pnpm") {
        await execAsync("pnpm install --no-lockfile");
      } else {
        await execAsync("npm install --no-package-lock");
      }
    }
  } catch (err) {
    !skipInstall &&
      installSpinner.fail(chalk.red("Failed to install dependencies."));
    console.log(
      chalk.yellow(
        `Please run 'npm install' inside the project directory manually.`
      )
    );
  }
}

export async function formatFiles(
  destDir: string,
  packageManager: PackageManager
) {
  console.log("");
  const formatSpinner = ora({
    text: chalk.cyan("🛠️  Formatting files..."),
    color: "cyan",
  }).start();

  try {
    process.chdir(destDir);
    // Run Prettier to format files
    await execAsync(`${packageManager} run format`);

    formatSpinner.succeed(chalk.green("Files formatted successfully!"));
  } catch (err) {
    formatSpinner.warn(
      chalk.yellow(
        "Failed to run Prettier. You can run it manually with `npx prettier --write .`"
      )
    );
  }
}

export async function setupORM(
  orm: string,
  destDir: string,
  packageManager: PackageManager
): Promise<void> {
  console.log("");
  const ormSpinner = ora({
    text: chalk.cyan(
      `💾  Setting up ${orm === "prisma" ? "Prisma" : "Drizzle"} ORM...\n`
    ),
    color: "cyan",
  }).start();

  try {
    process.chdir(destDir);

    // Run commands
    if (orm === "prisma") {
      await execAsync(`${packageManager} run db:generate`);
    }
    await execAsync(`${packageManager} run db:push`);
    await execAsync(`${packageManager} run db:seed`);

    ormSpinner.succeed(chalk.green("ORM setup completed successfully!"));
  } catch (error) {
    console.log(error);
    ormSpinner.fail(chalk.red("ORM setup failed"));
  }
}

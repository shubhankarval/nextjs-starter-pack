import { exec } from "child_process";
import { promisify } from "util";
import ora from "ora";
import chalk from "chalk";

import { PackageManager } from "../types.js";

const execAsync = promisify(exec);

export async function installDependencies(
  destDir: string,
  packageManager: PackageManager
) {
  console.log("");
  const installSpinner = ora({
    text: chalk.cyan(
      "📦 Installing dependencies (this may take up to a minute)...\n"
    ),
    color: "cyan",
  }).start();

  try {
    // Install dependencies
    process.chdir(destDir);
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

    console.log("");
    const formatSpinner = ora({
      text: chalk.cyan("🛠️  Formatting files..."),
      color: "cyan",
    }).start();

    try {
      await execAsync(`${packageManager} run format`);

      formatSpinner.succeed(chalk.green("Files formatted successfully!"));
    } catch (err) {
      formatSpinner.warn(
        chalk.yellow(
          "Failed to run Prettier. You can run it manually with `npx prettier --write .`"
        )
      );
    }
  } catch (err) {
    installSpinner.fail(chalk.red("Failed to install dependencies."));
    console.log(
      chalk.yellow(
        `Please run 'npm install' inside the project directory manually.`
      )
    );
  }
}

export async function setupPrisma(
  destDir: string,
  packageManager: PackageManager
): Promise<void> {
  console.log("");
  const prismaSpinner = ora({
    text: chalk.cyan("🛆  Setting up Prisma ORM...\n"),
    color: "cyan",
  }).start();
  const pkg = packageManager === "npm" ? "npx" : packageManager;

  try {
    process.chdir(destDir);

    // Run commands
    await execAsync(`${pkg} prisma generate`);
    await execAsync(`${pkg} prisma db push`);
    await execAsync(`${pkg} prisma db seed`);

    prismaSpinner.succeed(chalk.green("Prisma setup completed successfully!"));
  } catch (error) {
    console.log(error);
    prismaSpinner.fail(chalk.red("Prisma setup failed"));
    console.log(
      chalk.yellow(`Please run the following commands in the project directory manually:
        1. ${pkg} prisma generate
        2. ${pkg} prisma db seed
        3. ${pkg} prisma db seed
      `)
    );
  }
}

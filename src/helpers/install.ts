import { execSync } from "child_process";
import ora from "ora";
import chalk from "chalk";

export function installDependencies(destDir: string, packageManager: string) {
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
      execSync("yarn", { stdio: "ignore" });
    } else if (packageManager === "pnpm") {
      execSync("pnpm install", { stdio: "ignore" });
    } else {
      execSync("npm install", { stdio: "ignore" });
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
      execSync(`${packageManager} run -s format`, { stdio: "inherit" });

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

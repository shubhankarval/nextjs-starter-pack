import { fileURLToPath } from "url";
import path from "path";
import os from "os";
import fs from "fs-extra";
import inquirer from "inquirer";
import { Command } from "commander";
import { nanoid } from "nanoid";
import ora from "ora";
import figlet from "figlet";
import chalk from "chalk";
import { mind } from "gradient-string";

import type {
  Options,
  Prompts,
  PackageJson,
  ScaffoldContext,
} from "./types.js";
import { addDependencies, addRunDependencies } from "./helpers/deps.js";
import { addFiles } from "./helpers/addFiles.js";
import { modifyFiles } from "./helpers/modifyFiles.js";
import {
  installDependencies,
  formatFiles,
  setupPrisma,
} from "./helpers/run.js";
import { getPackageManager, swapPackageJsonFiles } from "./helpers/utils.js";

// Needed to resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mainDir = path.join(__dirname, "../template/main");
const optionalDir = path.join(__dirname, "../template/optional");
const hbsDir = path.join(__dirname, "../template/hbs");
const tempDir = path.join(os.tmpdir(), `temp-${nanoid()}`);

const program = new Command();
program
  .name("nextjs-starter-pack")
  .description("Create a Next.js app with a starter pack")
  .argument("[projectName]", "Name of your project")
  .option("-d, --dark-mode", "Add dark mode")
  .option("-r, --rhf", "Add React Hook Form with Zod")
  .option("-q, --tanstack-query", "Add TanStack Query")
  .option(
    "-s, --state <library>",
    "Choose state management library (zustand, jotai)"
  )
  .option("-p, --prisma", "Add Prisma ORM")
  .option(
    "-a, --auth <library>",
    "Choose authentication library (authjs, clerk)"
  )
  .option("-i, --skip-install", "Skip installing dependencies")
  .parse(process.argv);

export const createApp = async (): Promise<void> => {
  // Display banner
  console.log(
    mind(
      figlet.textSync("nextjs-starter-pack", {
        font: "Small Slant",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 100,
        whitespaceBreak: true,
      })
    )
  );
  console.log("\n");

  let projectName = program.args[0]?.trim();
  const options = program.opts() as Options;

  try {
    // Validate list options
    const validStates = ["zustand", "jotai"];
    if (options.state && !validStates.includes(options.state)) {
      throw new Error(`Invalid state management library: ${options.state}`);
    }

    const validAuth = ["authjs", "clerk"];
    if (options.auth && !validAuth.includes(options.auth)) {
      throw new Error(`Invalid authentication library: ${options.auth}`);
    }

    const pkg = (await fs.readJson(
      path.join(mainDir, "package.json")
    )) as PackageJson;

    // Project name
    if (!projectName) {
      const answers = await inquirer.prompt<Prompts>([
        {
          type: "input",
          name: "projectName",
          message: "What is your project name?",
          default: "my-app",
          validate: (input: string) =>
            input.trim() !== "" ? true : "Project name cannot be empty.",
        },
      ]);
      projectName = answers.projectName?.trim() || "my-app";
    }
    pkg.name = projectName;

    const destDir = path.join(process.cwd(), projectName);
    if (fs.existsSync(destDir)) {
      throw new Error(`A folder named "${projectName}" already exists.`);
    }

    const prompts = await inquirer.prompt<Prompts>([
      {
        type: "confirm",
        name: "darkMode",
        message: "Do you want to have Dark Mode?",
        default: true,
        when: () => !options.darkMode,
      },
      {
        type: "confirm",
        name: "rhf",
        message:
          "Do you want to have form validation with React Hook Form and Zod?",
        default: true,
        when: () => !options.rhf,
      },
      {
        type: "confirm",
        name: "tanstackQuery",
        message: "Do you want to use TanStack Query?",
        default: true,
        when: () => !options.tanstackQuery,
      },
      {
        type: "list",
        name: "state",
        message: "Do you want to use a state manager?",
        choices: [
          {
            name: "Zustand",
            value: "zustand",
          },
          {
            name: "Jotai",
            value: "jotai",
          },
          {
            name: "None",
            value: undefined,
          },
        ],
        default: "zustand",
        when: () => !options.state,
      },
      {
        type: "confirm",
        name: "prisma",
        message: "Do you want to include Prisma ORM?",
        default: true,
        when: () => !options.prisma,
      },
      {
        type: "list",
        name: "auth",
        message: "Do you want to include authentication?",
        choices: [
          {
            name: "Auth.js (formerly NextAuth)",
            value: "authjs",
          },
          {
            name: "Clerk",
            value: "clerk",
          },
          {
            name: "None",
            value: undefined,
          },
        ],
        default: "authjs",
        when: () => !options.auth,
      },
      {
        type: "confirm",
        name: "skipInstall",
        message: "Do you want to skip installing dependencies?",
        default: false,
        when: () => !options.skipInstall,
      },
    ]);

    // spinner for file operations
    const spinner = ora({
      text: chalk.cyan("Creating your project..."),
      color: "cyan",
    }).start();

    const darkMode = options.darkMode || prompts.darkMode;
    const rhf = options.rhf || prompts.rhf;
    const tanstackQuery = options.tanstackQuery || prompts.tanstackQuery;
    const state = options.state || prompts.state;
    const prisma = options.prisma || prompts.prisma;
    const auth = options.auth || prompts.auth;
    const skipInstall = options.skipInstall || prompts.skipInstall;

    const params: ScaffoldContext = {
      darkMode,
      rhf,
      tanstackQuery,
      state,
      prisma,
      auth,
      optionalDir,
      tempDir,
      hbsDir,
    };

    // Copy from main to temp directory
    await fs.copy(mainDir, tempDir);

    // Add dependencies based on user input
    if (skipInstall) {
      await addRunDependencies(params, mainDir, tempDir);
      await swapPackageJsonFiles(tempDir);
    } else {
      addDependencies(params, pkg);
      await fs.writeJson(path.join(tempDir, "package.json"), pkg, {
        spaces: 2,
      });
      await fs.remove(path.join(tempDir, "_package.json"));
    }

    // Add/overwrite/modify files based on user input
    await addFiles(params);
    await modifyFiles(params);

    // Move files from temp to destination directory
    await fs.move(tempDir, destDir);
    await fs.remove(tempDir);

    if (!skipInstall) {
      spinner.succeed(
        chalk.green(`Project ${chalk.bold(projectName)} created successfully!`)
      );
    }

    // Install dependencies
    const packageManager = getPackageManager();
    await installDependencies(destDir, packageManager, !!skipInstall);
    if (skipInstall) {
      await swapPackageJsonFiles(destDir);
      await fs.remove(path.join(destDir, "_package.json"));

      addDependencies(params, pkg);
      await fs.writeJson(path.join(destDir, "package.json"), pkg, {
        spaces: 2,
      });

      spinner.succeed(
        chalk.green(`Project ${chalk.bold(projectName)} created successfully!`)
      );
    }

    // Format files and run optional commands
    await formatFiles(destDir, packageManager);
    prisma && (await setupPrisma(destDir, packageManager));

    // Final success message
    console.log("\n" + chalk.bgCyan.black(" NEXT STEPS ") + "\n");
    console.log(`  ${chalk.cyan("1.")} ${chalk.bold(`cd ${projectName}`)}`);
    if (skipInstall) {
      console.log(
        `  ${chalk.cyan("2.")} ${chalk.bold(`${packageManager} install`)}`
      );
      console.log(
        `  ${chalk.cyan("3.")} ${chalk.bold(`${packageManager} run dev`)}`
      );
    } else {
      console.log(
        `  ${chalk.cyan("2.")} ${chalk.bold(`${packageManager} run dev`)}`
      );
    }
    if (auth) {
      console.log(
        `  ${chalk.cyan(skipInstall ? "4." : "3.")} ${chalk.bold(
          "set up your auth provider"
        )}`
      );
    }
    console.log("\n" + chalk.green("Happy coding!🚀") + "\n");
  } catch (err: any) {
    // Clean up
    await fs.remove(tempDir);

    console.error(chalk.red(`\n❌ Failed to create project\n${err.message}\n`));
  }
};

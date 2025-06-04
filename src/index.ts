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

import type { Options } from "./types.js";
import { addFiles } from "./helpers/addFiles.js";
import { modifyFiles } from "./helpers/modifyFiles.js";
import { installDependencies } from "./helpers/install.js";
import { getPackageManager } from "./helpers/utils.js";

interface Prompts extends Options {
  projectName?: string;
}

interface PackageJson {
  name: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  prisma?: Record<string, string>;
}

// Needed to resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mainDir = path.join(__dirname, "../template/main");
const optionalDir = path.join(__dirname, "../template/optional");
const tempDir = path.join(os.tmpdir(), `temp-${nanoid()}`);

const program = new Command();
program
  .name("nextjs-starter-pack")
  .argument("[projectName]", "Name of the project")
  .description("Create a Next.js app with a starter pack")
  .option("--dark-mode", "Include dark mode")
  .option("--rhf", "Include React Hook Form with Zod")
  .option("--tanstack-query", "Include TanStack Query")
  .option(
    "--state <library>",
    "Choose state management library (zustand, jotai, none)"
  )
  .option("--prisma", "Include Prisma ORM")
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
    const validStates = ["zustand", "jotai", "none"];
    if (options.state && !validStates.includes(options.state)) {
      throw new Error(`Invalid state management library: ${options.state}`);
    }

    const packageJsonPath = path.join(mainDir, "package.json");
    const pkg = (await fs.readJson(packageJsonPath)) as PackageJson;

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
            value: "none",
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
    ]);

    // spinner for file operations
    const spinner = ora({
      text: chalk.cyan("Creating your project..."),
      color: "cyan",
    }).start();

    const darkMode = options.darkMode || prompts.darkMode;
    if (darkMode) {
      pkg.dependencies["next-themes"] = "^0.4.6";
    }

    const rhf = options.rhf || prompts.rhf;
    if (rhf) {
      pkg.dependencies["react-hook-form"] = "^7.56.4";
      pkg.dependencies["@hookform/resolvers"] = "^5.0.1";
      pkg.dependencies["zod"] = "^3.24.4";
      pkg.dependencies["@radix-ui/react-label"] = "^2.1.6";
    }

    const tanstackQuery = options.tanstackQuery || prompts.tanstackQuery;
    if (tanstackQuery) {
      pkg.dependencies["@tanstack/react-query"] = "^5.74.4";
      pkg.dependencies["@tanstack/react-query-devtools"] = "^5.74.6";
    }

    const state = options.state || prompts.state;
    if (state === "zustand") {
      pkg.dependencies["zustand"] = "^5.0.3";
    } else if (state === "jotai") {
      pkg.dependencies["jotai"] = "^2.12.3";
    }

    const prisma = options.prisma || prompts.prisma;
    if (prisma) {
      pkg.dependencies["@prisma/client"] = "^6.7.0";
      pkg.devDependencies["prisma"] = "^6.7.0";
      pkg.devDependencies["tsx"] = "^4.19.4";
      pkg.prisma = {};
      pkg.prisma.seed = "tsx prisma/seed.ts";
    }

    // Copy from main to temp directory
    await fs.copy(mainDir, tempDir);

    // Add dependencies based on user input
    await fs.writeJson(path.join(tempDir, "package.json"), pkg, {
      spaces: 2,
    });

    // Add/overwrite/modify files based on user input
    const props = {
      darkMode,
      rhf,
      tanstackQuery,
      state,
      prisma,
      optionalDir,
      tempDir,
    };
    await addFiles(props);
    await modifyFiles(props);

    // Move files from temp to destination directory
    await fs.move(tempDir, destDir);

    // Clean up
    await fs.remove(tempDir);

    spinner.succeed(
      chalk.green(`Project ${chalk.bold(projectName)} created successfully!`)
    );

    // Setup dependencies and format files
    const packageManager = getPackageManager();
    installDependencies(destDir, packageManager);

    // Final success message
    console.log("\n" + chalk.bgCyan.black(" NEXT STEPS ") + "\n");
    console.log(`  ${chalk.cyan("1.")} ${chalk.bold(`cd ${projectName}`)}`);
    console.log(
      `  ${chalk.cyan("2.")} ${chalk.bold(`${packageManager} run dev`)}`
    );

    console.log("\n" + chalk.green("Happy coding!🚀") + "\n");
  } catch (err: any) {
    // Clean up
    await fs.remove(tempDir);

    console.error(chalk.red(`\n❌ Failed to create project\n${err.message}\n`));
  }
};

import { fileURLToPath } from "url";
import path from "path";
import os from "os";
import { nanoid } from "nanoid";
import fs from "fs-extra";
import inquirer from "inquirer";
import { Command } from "commander";

// Needed to resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mainDir = path.join(__dirname, "./template/main");
const optionalDir = path.join(__dirname, "./template/optional");
const tempDir = path.join(os.tmpdir(), `temp-${nanoid()}`);

const program = new Command();
program
  .name("nextjs-starter-pack")
  .argument("[projectName]", "Name of the project")
  .description("Create a Next.js app with a starter pack")
  .option("--dark-mode", "Include dark mode")
  .option("--form <validator>", "Choose form validator (rhf, rhf-zod, none)")
  .option("--tanstack-query", "Include TanStack Query")
  .option(
    "--state <library>",
    "Choose state management library (zustand, jotai, none)"
  )
  .parse(process.argv);

let projectName = program.args[0]?.trim();
const options = program.opts();

export const createApp = async () => {
  try {
    // Validate list options
    const validForms = ["rhf", "rhf-zod", "none"];
    if (options.form && !validForms.includes(options.form)) {
      throw new Error(`Invalid form validator: ${options.form}`);
    }
    const validStates = ["zustand", "jotai", "none"];
    if (options.state && !validStates.includes(options.state)) {
      throw new Error(`Invalid state management library: ${options.state}`);
    }

    const packageJsonPath = path.join(mainDir, "package.json");
    const pkg = await fs.readJson(packageJsonPath);

    // Project name
    if (!projectName) {
      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "projectName",
          message: "What is your project name?",
          default: "my-app",
          validate: (input) =>
            input.trim() !== "" ? true : "Project name cannot be empty.",
        },
      ]);
      projectName = answers.projectName.trim();
    }
    pkg.name = projectName;

    const destDir = path.join(process.cwd(), projectName);
    if (fs.existsSync(destDir)) {
      throw new Error(`A folder named "${projectName}" already exists.`);
    }

    const prompts = await inquirer.prompt([
      {
        type: "confirm",
        name: "darkMode",
        message: "Do you want to have Dark Mode?",
        default: true,
        when: () => !options.darkMode,
      },
      {
        type: "list",
        name: "formValidator",
        message: "Do you want to have form validation?",
        choices: [
          { name: "React Hook Form", value: "rhf" },
          { name: "React Hook Form + Zod", value: "rhf-zod" },
          { name: "None", value: "none" },
        ],
        default: "rhf-zod",
        when: () => !options.form,
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
        name: "stateLibrary",
        message: "Do you want to use a state manager?",
        choices: [
          { name: "Zustand", value: "zustand" },
          { name: "Jotai", value: "jotai" },
          { name: "None", value: "none" },
        ],
        default: "zustand",
        when: () => !options.state,
      },
    ]);

    const darkMode = options.darkMode || prompts.darkMode;
    if (darkMode) {
      pkg.dependencies["next-themes"] = "^0.4.6";
    }

    const formValidator = options.form || prompts.formValidator;
    if (formValidator === "rhf") {
      pkg.dependencies["react-hook-form"] = "^7.56.1";
    } else if (formValidator === "rhf-zod") {
      pkg.dependencies["react-hook-form"] = "^7.56.1";
      pkg.dependencies["@hookform/resolvers"] = "^5.0.1";
      pkg.dependencies["zod"] = "^3.24.3";
    }

    const tanstackQuery = options.tanstackQuery || prompts.tanstackQuery;
    if (tanstackQuery) {
      pkg.dependencies["@tanstack/react-query"] = "^5.74.4";
      pkg.dependencies["@tanstack/react-query-devtools"] = "^5.74.6";
    }

    const stateLibrary = options.state || prompts.stateLibrary;
    if (stateLibrary === "zustand") {
      pkg.dependencies["zustand"] = "^5.0.3";
    } else if (stateLibrary === "jotai") {
      pkg.dependencies["jotai"] = "^2.12.3";
    }

    // Copy from main to temp directory
    await fs.copy(mainDir, tempDir);

    // Copy optional files/dependencies based on user input
    await fs.writeJson(path.join(tempDir, "package.json"), pkg, {
      spaces: 2,
    });
    if (darkMode) {
      const darkModeDir = path.join(optionalDir, "dark-mode");

      const fileMap = [
        {
          src: path.join(darkModeDir, "layout.tsx"),
          dest: path.join(tempDir, "src/app/layout.tsx"),
        },
        {
          src: path.join(darkModeDir, "page.tsx"),
          dest: path.join(tempDir, "src/app/page.tsx"),
        },
        {
          src: path.join(darkModeDir, "globals.css"),
          dest: path.join(tempDir, "src/app/globals.css"),
        },
        {
          src: path.join(darkModeDir, "providers.tsx"),
          dest: path.join(tempDir, "src/app/providers.tsx"),
        },
        {
          src: path.join(darkModeDir, "ThemeSwitch.tsx"),
          dest: path.join(
            tempDir,
            "src/components/ThemeSwitch/ThemeSwitch.tsx"
          ),
        },
      ];

      // Copy each file, ensuring directory exists
      for (const { src, dest } of fileMap) {
        await fs.ensureDir(path.dirname(dest));
        await fs.copy(src, dest, { overwrite: true });
      }
    }

    // Copy from temp to destination directory
    await fs.copy(tempDir, destDir, { overwrite: false });

    // Clean up
    await fs.remove(tempDir);

    console.log(`\n✅ Project "${projectName}" created successfully!`);
    console.log(`📁 cd ${projectName}`);
    console.log(`📦 Run 'npm install' to get started.\n`);
  } catch (err) {
    // Clean up
    await fs.remove(tempDir);

    console.error(`\n❌ Failed to create project\n${err.message}\n`);
  }
};

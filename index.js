import { fileURLToPath } from "url";
import path from "path";
import os from "os";
import { execSync } from "child_process";
import fs from "fs-extra";
import inquirer from "inquirer";
import { Command } from "commander";
import { nanoid } from "nanoid";
import ora from "ora";
import figlet from "figlet";
import chalk from "chalk";
import { mind } from "gradient-string";

// Needed to resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mainDir = path.join(__dirname, "./template/main");
const optionalDir = path.join(__dirname, "./template/optional");

export const createApp = async () => {
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
    .option("--skip-install", "Skip installing dependencies")
    .parse(process.argv);

  let projectName = program.args[0]?.trim();
  const options = program.opts();

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
    ]);

    // Create spinner for file operations
    const spinner = ora({
      text: chalk.cyan("Creating your project..."),
      color: "cyan",
    }).start();

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

      // Ensure directories exist first (in parallel)
      await Promise.all(
        fileMap.map(({ dest }) => fs.ensureDir(path.dirname(dest)))
      );

      // Now copy dark mode files in parallel
      await Promise.all(
        fileMap.map(({ src, dest }) => fs.copy(src, dest, { overwrite: true }))
      );
    }

    // Copy from temp to destination directory
    await fs.copy(tempDir, destDir, { overwrite: false });

    // Clean up
    await fs.remove(tempDir);

    spinner.succeed(
      chalk.green(`Project ${chalk.bold(projectName)} created successfully!`)
    );

    if (!options.skipInstall) {
      console.log("");
      const installSpinner = ora({
        text: chalk.cyan(
          "📦Installing dependencies (this may take up to a minute)...\n"
        ),
        color: "cyan",
      }).start();

      try {
        // Detect package manager (prefer user's default)
        let packageManager = "npm";
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
      } catch (err) {
        installSpinner.fail(chalk.red("Failed to install dependencies."));
        console.log(
          chalk.yellow(
            `Please run 'npm install' inside the project directory manually.`
          )
        );
      }
    }

    // Final success message with colorful instructions
    console.log("\n" + chalk.bgCyan.black(" NEXT STEPS ") + "\n");
    console.log(`  ${chalk.cyan("1.")} ${chalk.bold(`cd ${projectName}`)}`);
    if (options.skipInstall) {
      console.log(
        `  ${chalk.cyan("2.")} ${chalk.bold("npm install")} (or use yarn/pnpm)`
      );
      console.log(`  ${chalk.cyan("3.")} ${chalk.bold("npm run dev")}`);
    } else {
      console.log(`  ${chalk.cyan("2.")} ${chalk.bold("npm run dev")}`);
    }
    console.log("\n" + chalk.green("Happy coding!🚀") + "\n");
  } catch (err) {
    // Clean up
    await fs.remove(tempDir);

    console.error(chalk.red(`\n❌ Failed to create project\n${err.message}\n`));
  }
};

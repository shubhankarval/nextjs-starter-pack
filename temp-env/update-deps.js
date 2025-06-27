import fs from "fs-extra";
import path from "path";
import fetch from "node-fetch";

const filePath = path.resolve("../src/dependencies.json");
const registryUrl = (name) => `https://registry.npmjs.org/${name}/latest`;

async function fetchLatestVersion(pkg) {
  try {
    const res = await fetch(registryUrl(pkg));
    const json = await res.json();
    return `^${json.version}`;
  } catch (e) {
    console.warn(`⚠️ Failed to fetch ${pkg}`);
    return null;
  }
}

async function updateDepsObject(obj) {
  const updated = {};
  for (const [pkg, version] of Object.entries(obj)) {
    const latest = await fetchLatestVersion(pkg);
    updated[pkg] = latest ?? version;
  }
  return updated;
}

async function main() {
  const json = await fs.readJson(filePath);

  json.dependencies = await updateDepsObject(json.dependencies);
  json.devDependencies = await updateDepsObject(json.devDependencies);

  const optionalDeps = json.optionalDeps || {};
  for (const [key, value] of Object.entries(optionalDeps)) {
    if (key === "prisma") {
      value.deps = await updateDepsObject(value.deps);
      value.devDeps = await updateDepsObject(value.devDeps);
    } else {
      optionalDeps[key] = await updateDepsObject(value);
    }
  }

  json.optionalDeps = optionalDeps;
  await fs.writeJson(filePath, json, { spaces: 2 });
  console.log("✅ dependencies.json updated to latest versions");
}

main();

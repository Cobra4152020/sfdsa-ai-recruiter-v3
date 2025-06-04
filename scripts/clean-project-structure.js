const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Create a clean project structure
function createCleanProjectStructure() {
  // Create a backup of the current project
  console.log("Creating backup...");
  execSync("mkdir -p ../backup");
  execSync("cp -r * ../backup/");

  // Delete all dynamic route directories
  console.log("Deleting all dynamic route directories...");
  const appDir = path.join(__dirname, "..", "app");
  deleteAllDynamicRouteDirs(appDir);

  // Create clean dynamic route directories with [id]
  console.log("Creating clean dynamic route directories...");
  createCleanDynamicRouteDirs();

  console.log("Done!");
}

// Function to recursively delete all dynamic route directories
function deleteAllDynamicRouteDirs(dir) {
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const itemPath = path.join(dir, item);
    if (fs.statSync(itemPath).isDirectory()) {
      const dirName = path.basename(itemPath);

      if (dirName.startsWith("[") && dirName.endsWith("]")) {
        console.log(`Deleting directory: ${itemPath}`);
        fs.rmSync(itemPath, { recursive: true, force: true });
      } else {
        deleteAllDynamicRouteDirs(itemPath);
      }
    }
  });
}

// Function to create clean dynamic route directories
function createCleanDynamicRouteDirs() {
  // Create app/user-badge/[id]
  const userBadgeDir = path.join(__dirname, "..", "app", "user-badge", "[id]");
  fs.mkdirSync(userBadgeDir, { recursive: true });

  // Create app/badge/[id]
  const badgeDir = path.join(__dirname, "..", "app", "badge", "[id]");
  fs.mkdirSync(badgeDir, { recursive: true });

  // Create app/profile/[id]
  const profileDir = path.join(__dirname, "..", "app", "profile", "[id]");
  fs.mkdirSync(profileDir, { recursive: true });

  // Create app/nft-awards/[id]
  const nftAwardsDir = path.join(__dirname, "..", "app", "nft-awards", "[id]");
  fs.mkdirSync(nftAwardsDir, { recursive: true });

  // Create app/api/users/[id]
  const apiUsersDir = path.join(__dirname, "..", "app", "api", "users", "[id]");
  fs.mkdirSync(apiUsersDir, { recursive: true });

  // Create app/api/badges/[id]
  const apiBadgesDir = path.join(
    __dirname,
    "..",
    "app",
    "api",
    "badges",
    "[id]",
  );
  fs.mkdirSync(apiBadgesDir, { recursive: true });

  // Create app/api/user-badge/[id]
  const apiUserBadgeDir = path.join(
    __dirname,
    "..",
    "app",
    "api",
    "user-badge",
    "[id]",
  );
  fs.mkdirSync(apiUserBadgeDir, { recursive: true });

  // Create app/api/nft-awards/[id]
  const apiNftAwardsDir = path.join(
    __dirname,
    "..",
    "app",
    "api",
    "nft-awards",
    "[id]",
  );
  fs.mkdirSync(apiNftAwardsDir, { recursive: true });
}

// Run the clean project structure creation
createCleanProjectStructure();

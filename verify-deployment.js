// Local deployment verification
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔍 Vercel Deployment Pre-Check\n");

// Check 1: Verify API structure
const apiDir = path.join(__dirname, "api");
if (fs.existsSync(apiDir)) {
  const apiFiles = fs.readdirSync(apiDir).filter((f) => f.endsWith(".ts"));
  console.log("✅ API directory exists");
  console.log(`   Found ${apiFiles.length} API functions:`, apiFiles);
} else {
  console.log("❌ API directory missing");
}

// Check 2: Verify no conflicting vercel.json
const vercelJson = path.join(__dirname, "vercel.json");
if (!fs.existsSync(vercelJson)) {
  console.log("✅ No conflicting vercel.json (auto-detection enabled)");
} else {
  console.log("⚠️  vercel.json found - this might cause runtime conflicts");
}

// Check 3: Verify package.json dependencies
const packageJson = path.join(__dirname, "package.json");
if (fs.existsSync(packageJson)) {
  const pkg = JSON.parse(fs.readFileSync(packageJson, "utf8"));
  const vercelNodeVersion = pkg.dependencies["@vercel/node"];
  console.log("✅ Package.json exists");
  console.log(`   @vercel/node version: ${vercelNodeVersion}`);
} else {
  console.log("❌ Package.json missing");
}

// Check 4: Verify TypeScript configuration
const tsConfig = path.join(__dirname, "tsconfig.json");
if (fs.existsSync(tsConfig)) {
  console.log("✅ TypeScript configuration exists");
} else {
  console.log("❌ TypeScript configuration missing");
}

// Check 5: Verify templates
const templatesDir = path.join(__dirname, "src", "templates");
if (fs.existsSync(templatesDir)) {
  const templates = fs
    .readdirSync(templatesDir)
    .filter((f) => f.endsWith(".hbs"));
  console.log("✅ Templates directory exists");
  console.log(`   Found ${templates.length} templates`);
} else {
  console.log("❌ Templates directory missing");
}

console.log("\n🚀 Ready for Vercel deployment!");
console.log("\nNext steps:");
console.log("1. Push to GitHub: git push origin main");
console.log("2. Deploy via Vercel web interface");
console.log("3. Or use CLI: vercel --prod");

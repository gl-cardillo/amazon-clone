import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

// the tests create and delete accounts, never run them against prod
process.loadEnvFile(".env.local");
const db = new URL(process.env.MONGO_URI ?? "mongodb://x/").pathname.slice(1);
if (!/-(dev|test)$/.test(db)) {
  throw new Error(
    `MONGO_URI must point to a -dev or -test database, not "${db}"`,
  );
}

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 300_000,
  },
});

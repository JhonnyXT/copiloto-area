import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "Falta DATABASE_URL. Corre `vercel env pull .env.local` o usa dotenv-cli: " +
      "`npx dotenv -e .env.local -- npx drizzle-kit <comando>`.",
  );
}

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migraciones",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});

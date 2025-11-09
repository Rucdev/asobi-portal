import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./infrastructure/persistence/drizzle/migrations",
	schema: "./infrastructure/persistence/drizzle/schema/*.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: Bun.env.DB_FILE_NAME || "mydb.sqlite",
	},
});
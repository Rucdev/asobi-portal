import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("portal_users", {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
});

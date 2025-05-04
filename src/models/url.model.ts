import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import * as z from "zod";

export const urls = pgTable("urls", {
  id: serial("id").primaryKey(),
  originalUrl: varchar("original_url", { length: 2048 }).notNull(),
  shortId: varchar("short_id", { length: 10 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  clicks: integer("clicks").default(0),
});

export type Url = typeof urls.$inferSelect;
export type NewUrl = typeof urls.$inferInsert;

export const urlSchema = z.object({
  originalUrl: z
    .string()
    .url("Invalid URL format")
    .max(2048, "URL is too long"),
});

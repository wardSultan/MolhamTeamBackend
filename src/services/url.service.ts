import { db } from "../config/db";
import { urls } from "../models/url.model";
import { eq } from "drizzle-orm";
import { drizzleClient } from "../config/db";
import { desc, sql } from "drizzle-orm";

export const createShortUrl = async (data: {
  originalUrl: string;
  shortId: string;
}) => {
  console.log("Creating short URL...");

  const result = await db
    .insert(urls)
    .values({
      originalUrl: data.originalUrl,
      shortId: data.shortId,
      clicks: 0,
    })
    .returning();

  console.log("Insert result:", result);
  return result;
};

export const getUrlByShortId = async (shortId: string) => {
  const db = drizzleClient();

  const result = await db.query.urls.findFirst({
    where: (u, { eq }) => eq(u.shortId, shortId),
  });

  if (!result) {
    throw new Error("URL not found");
  }

  return result;
};

export const getUrlsCreatedInSession = async (
  limit: number,
  offset: number
) => {
  const total = await db.select({ count: sql`count(*)` }).from(urls);
  const data = await db
    .select()
    .from(urls)
    .orderBy(desc(urls.createdAt))
    .limit(limit)
    .offset(offset);
  return { data, total };
};
export const redirectToOriginalUrl = async (shortId: string) => {
  const db = drizzleClient();

  const result = await db.query.urls.findFirst({
    where: (u, { eq }) => eq(u.shortId, shortId),
  });

  if (!result) {
    throw new Error("URL not found");
  }

  await db
    .update(urls)
    .set({ clicks: (result.clicks ?? 0) + 1 })
    .where(eq(urls.shortId, shortId));

  return result.originalUrl;
};

import { db } from "../config/db";
import { urls } from "../models/url.model";
import { eq, desc, sql } from "drizzle-orm";
import { drizzleClient } from "../config/db";

export const createShortUrl = async (data: {
  originalUrl: string;
  shortId: string;
}) => {
  console.log("Creating short URL...");

  try {
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
  } catch (error) {
    console.error("Error creating short URL:", error);
    throw new Error("Failed to create short URL");
  }
};

export const getUrlByShortId = async (shortId: string) => {
  const db = drizzleClient();

  try {
    const result = await db.query.urls.findFirst({
      where: (u, { eq }) => eq(u.shortId, shortId),
    });

    if (!result) {
      throw new Error("URL not found");
    }

    return result;
  } catch (error) {
    console.error("Error fetching URL by shortId:", error);
    throw new Error("Failed to fetch URL");
  }
};

export const getUrlsCreatedInSession = async (
  limit: number,
  offset: number
) => {
  try {
    const total = await db.select({ count: sql`count(*)` }).from(urls);
    const data = await db
      .select()
      .from(urls)
      .orderBy(desc(urls.createdAt))
      .limit(limit)
      .offset(offset);
    return { data, total };
  } catch (error) {
    console.error("Error fetching URLs in session:", error);
    throw new Error("Failed to fetch URLs in session");
  }
};

export const redirectToOriginalUrl = async (shortId: string) => {
  const db = drizzleClient();

  try {
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
  } catch (error) {
    console.error("Error redirecting to original URL:", error);
    throw new Error("Failed to redirect to original URL");
  }
};

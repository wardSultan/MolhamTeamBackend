import { db } from "../config/db"; // تأكد من أن لديك إعداد الاتصال بقاعدة البيانات في config/db.ts
import { urls } from "../models/url.model"; // تأكد من أن هذا المسار صحيح
import { eq, desc, sql } from "drizzle-orm"; // تأكد من أن هذه الدوال مستوردة بشكل صحيح
import { drizzleClient } from "../config/db"; // استيراد drizzleClient إذا كنت تستخدمه في مكان آخر

// دالة لإنشاء URL قصير جديد
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
      .returning(); // إرجاع النتيجة بعد الإدخال

    console.log("Insert result:", result);
    return result; // إرجاع النتيجة
  } catch (error) {
    console.error("Error creating short URL:", error);
    throw new Error("Failed to create short URL");
  }
};

// دالة للبحث عن URL باستخدام الـ shortId
export const getUrlByShortId = async (shortId: string) => {
  const db = drizzleClient(); // تأكد من أنك تستخدم العميل المناسب للاتصال بقاعدة البيانات

  try {
    const result = await db.query.urls.findFirst({
      where: (u, { eq }) => eq(u.shortId, shortId), // تحديد شرط البحث
    });

    if (!result) {
      throw new Error("URL not found");
    }

    return result; // إرجاع النتيجة إذا تم العثور عليها
  } catch (error) {
    console.error("Error fetching URL by shortId:", error);
    throw new Error("Failed to fetch URL");
  }
};

// دالة لإرجاع الروابط التي تم إنشاؤها مع التعداد
export const getUrlsCreatedInSession = async (
  limit: number,
  offset: number
) => {
  try {
    const total = await db.select({ count: sql`count(*)` }).from(urls); // إحصاء جميع الروابط
    const data = await db
      .select()
      .from(urls)
      .orderBy(desc(urls.createdAt)) // ترتيب حسب تاريخ الإنشاء
      .limit(limit) // تحديد الحد الأقصى للعدد
      .offset(offset); // تحديد الإزاحة (التحديد من أي نقطة تبدأ)
    return { data, total }; // إرجاع البيانات والإجمالي
  } catch (error) {
    console.error("Error fetching URLs in session:", error);
    throw new Error("Failed to fetch URLs in session");
  }
};

// دالة لإعادة التوجيه إلى الرابط الأصلي باستخدام الـ shortId
export const redirectToOriginalUrl = async (shortId: string) => {
  const db = drizzleClient(); // الاتصال بقاعدة البيانات

  try {
    const result = await db.query.urls.findFirst({
      where: (u, { eq }) => eq(u.shortId, shortId), // البحث باستخدام الـ shortId
    });

    if (!result) {
      throw new Error("URL not found");
    }

    // تحديث عدد النقرات
    await db
      .update(urls)
      .set({ clicks: (result.clicks ?? 0) + 1 })
      .where(eq(urls.shortId, shortId));

    return result.originalUrl; // إرجاع الرابط الأصلي
  } catch (error) {
    console.error("Error redirecting to original URL:", error);
    throw new Error("Failed to redirect to original URL");
  }
};

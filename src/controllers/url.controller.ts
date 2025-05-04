import { Request, Response } from "express";
import { z } from "zod";
import {
  createShortUrl,
  getUrlByShortId,
  getUrlsCreatedInSession,
  redirectToOriginalUrl,
} from "../services/url.service";
import { generateShortId } from "../utils/shortener";

const urlSchema = z.object({
  originalUrl: z.string().url(),
});

export const createUrl = async (req: Request, res: Response) => {
  try {
    const body = urlSchema.parse(req.body);

    const shortId = generateShortId();

    const result = await createShortUrl({
      originalUrl: body.originalUrl,
      shortId,
    });

    if (!result || result.length === 0) {
      res.status(500).json({ error: "Failed to insert URL" });
      return;
    }

    const created = result[0];
    res.status(201).json(created);
  } catch (err) {
    console.error("Error:", err);
    res.status(400).json({ error: "Invalid input" });
  }
};

export const listSessionUrls = async (_req: Request, res: Response) => {
  const limit = parseInt(_req.query.limit as string) || 10;
  const page = parseInt(_req.query.page as string) || 1;
  const offset = (page - 1) * limit;

  const response = await getUrlsCreatedInSession(limit, offset);

  res.json({
    data: response.data,
    total: response.total[0].count,
    page,
    totalPages: Math.ceil(Number(response.total[0].count) / limit),
  });
};

export const getUrlController = async (req: Request, res: Response) => {
  const { shortId } = req.params;

  try {
    const url = await getUrlByShortId(shortId);
    res.status(200).json(url);
  } catch (err) {
    if (err instanceof Error) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const redirectUrl = async (req: Request, res: Response) => {
  try {
    const { shortId } = req.params;

    const originalUrl = await redirectToOriginalUrl(shortId);

    res.redirect(originalUrl);
  } catch (err) {
    console.error(err);
    res.status(404).send("URL not found");
  }
};

import { Router } from "express";
import {
  createUrl,
  getUrlController,
  listSessionUrls,
  redirectUrl,
} from "../controllers/url.controller";

export const urlRouter = Router();

urlRouter.post("/", createUrl);
urlRouter.get("/", listSessionUrls);
urlRouter.get("/:shortId", getUrlController);
urlRouter.get("/redirect/:shortId", redirectUrl);

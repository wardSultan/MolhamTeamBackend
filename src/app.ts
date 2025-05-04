import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { urlRouter } from "./routes/url.routes";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/urls", urlRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

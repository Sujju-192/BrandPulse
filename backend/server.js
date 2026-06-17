import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import strategyRoutes from "./routes/strategy.js";
import captionRoutes from "./routes/captions.js";
import creativeRoutes from "./routes/creative.js";
import influencerRoutes from "./routes/influencers.js";
import imageRoutes from "./routes/images.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set in .env");
}
if (!process.env.ELEVENLABS_API_KEY) {
  console.warn("ELEVENLABS_API_KEY is not set in .env");
}
if (!process.env.YOUTUBE_API_KEY) {
  console.warn("YOUTUBE_API_KEY is not set in .env");
}

app.use(strategyRoutes);
app.use(captionRoutes);
app.use(creativeRoutes);
app.use(influencerRoutes);
app.use(imageRoutes);

app.listen(PORT, () => {
  console.log(`BrandPulse AI server running on http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
});

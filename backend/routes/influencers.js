import { Router } from "express";
import fetch from "node-fetch";
import { getGeminiClient } from "../lib/gemini.js";

const router = Router();

function extractInstagram(description = "") {
  const urlMatch = description.match(/instagram\.com\/([a-zA-Z0-9._]+)/);
  const atMatch = description.match(/@([a-zA-Z0-9._]{3,})/);
  return urlMatch?.[1] || atMatch?.[1] || null;
}

function extractEmail(description = "") {
  const emailMatch = description.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return emailMatch ? emailMatch[0] : "Not public";
}

router.post("/api/influencers", async (req, res) => {
  const { niche, minFollowers, maxFollowers, pageToken, maxResults = 25 } = req.body;
  const YT_KEY = process.env.YOUTUBE_API_KEY;

  if (!niche) {
    return res.status(400).json({ error: "Niche is required" });
  }

  if (!YT_KEY) {
    return res.status(500).json({ error: "YOUTUBE_API_KEY is missing in .env" });
  }

  try {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=${maxResults}&q=${encodeURIComponent(niche)}&key=${YT_KEY}${pageToken ? `&pageToken=${pageToken}` : ""}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchRes.ok || searchData.error) {
      const apiMessage = searchData?.error?.message || "YouTube search API request failed";
      return res.status(502).json({ error: `YouTube API error: ${apiMessage}` });
    }

    if (!searchData.items || searchData.items.length === 0) {
      return res.json({ influencers: [], nextPageToken: null });
    }

    const channelIds = searchData.items.map((item) => item.snippet.channelId).join(",");
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIds}&key=${YT_KEY}`;
    const channelRes = await fetch(channelUrl);
    const channelData = await channelRes.json();

    if (!channelRes.ok || channelData.error) {
      const apiMessage = channelData?.error?.message || "YouTube channels API request failed";
      return res.status(502).json({ error: `YouTube API error: ${apiMessage}` });
    }

    let influencers = channelData.items.map((c) => {
      const desc = c.snippet.description || "";
      const followers = parseInt(c.statistics.subscriberCount, 10) || 0;
      const instagramHandle = extractInstagram(desc);

      return {
        id: c.id,
        name: c.snippet.title,
        handle: c.snippet.customUrl || c.snippet.title.replace(/\s/g, "").toLowerCase(),
        thumbnail: c.snippet.thumbnails.default?.url || c.snippet.thumbnails.medium?.url || "",
        category: niche,
        followers,
        minBudget: Math.floor(followers * 0.02),
        rating: (Math.random() * 2 + 3).toFixed(1),
        email: extractEmail(desc),
        instagram: instagramHandle ? `https://instagram.com/${instagramHandle}` : "Not found",
        youtube: `https://youtube.com/channel/${c.id}`,
        description: desc.slice(0, 160),
      };
    });

    if (minFollowers !== undefined || maxFollowers !== undefined) {
      const min = minFollowers ? parseInt(minFollowers, 10) : null;
      const max = maxFollowers ? parseInt(maxFollowers, 10) : null;
      influencers = influencers.filter((inf) => {
        if (min !== null && inf.followers < min) return false;
        if (max !== null && inf.followers > max) return false;
        return true;
      });
    }

    res.json({
      influencers,
      nextPageToken: searchData.nextPageToken || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch influencers" });
  }
});

router.post("/api/outreach-email", async (req, res) => {
  const { influencer, product, brand } = req.body;

  if (!influencer || !product || !brand) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const prompt = `
Write a short, personalized influencer outreach email.

Brand: ${brand}
Product: ${product}
Influencer name: ${influencer.name}
Platform: YouTube / Instagram

Tone:
- Friendly
- Professional
- Non-salesy
- Collaborative

End with a soft call to action.
`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    res.json({ email: response.text });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Failed to generate outreach email" });
  }
});

export default router;

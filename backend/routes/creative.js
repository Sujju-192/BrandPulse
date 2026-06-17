import { Router } from "express";
import fetch from "node-fetch";
import { InferenceClient } from "@huggingface/inference";
import { getGeminiClient } from "../lib/gemini.js";

const router = Router();

const GEMINI_KEY = () => process.env.GEMINI_API_KEY;
const ELEVEN_KEY = () => process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "EXAVITQu4vr4xnSDxMaL";

router.get("/api/models", async (_req, res) => {
  if (!GEMINI_KEY()) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is not configured. Please set it in your .env file.",
    });
  }

  try {
    const ai = getGeminiClient();
    const pager = await ai.models.list();
    const models = [];
    for await (const m of pager) {
      models.push({
        name: m.name,
        displayName: m.displayName,
        supportedGenerationMethods: m.supportedGenerationMethods,
      });
    }

    return res.json({ count: models.length, models });
  } catch (err) {
    console.error("ListModels error:", err?.message || err);
    return res.status(500).json({ error: err?.message || "Failed to list models" });
  }
});

async function pickFirstImageModelName() {
  const ai = getGeminiClient();
  const pager = await ai.models.list();
  const candidates = [];
  for await (const m of pager) {
    const methods = m.supportedGenerationMethods || [];
    if (methods.includes("generateImages")) {
      candidates.push(m.name);
    }
  }

  const preferred = candidates.find((n) => String(n).toLowerCase().includes("imagen"));
  return preferred || candidates[0] || null;
}

function extractInlineImages(generateContentResponse) {
  const images = [];
  const candidates = generateContentResponse?.candidates || [];
  for (const c of candidates) {
    const parts = c?.content?.parts || [];
    for (const part of parts) {
      const inline = part?.inlineData;
      if (inline?.data) {
        images.push({
          mimeType: inline.mimeType || "image/png",
          imageBytes: inline.data,
        });
      }
    }
  }
  return images;
}

async function generateWithHuggingFace({ prompt, count, width, height }) {
  const HF_KEY = process.env.HUGGINGFACE_API_KEY;
  const HF_MODEL =
    (process.env.HUGGINGFACE_IMAGE_MODEL || "").trim() || "stabilityai/stable-diffusion-xl-base-1.0";
  const HF_PROVIDER = (process.env.HUGGINGFACE_PROVIDER || "").trim() || "hf-inference";

  if (!HF_KEY) {
    throw new Error(
      "Gemini image quota unavailable and HUGGINGFACE_API_KEY is not set. Add HUGGINGFACE_API_KEY in .env for fallback image generation."
    );
  }

  const safeCount = Math.max(1, Math.min(4, Number(count) || 3));
  const w = Number(width) || 1080;
  const h = Number(height) || 1350;

  const hf = new InferenceClient(HF_KEY);

  const tasks = Array.from({ length: safeCount }, async (_v, i) => {
    const blob = await hf.textToImage({
      model: HF_MODEL,
      inputs: `${prompt}\n\nVariation ${i + 1} of ${safeCount}.`,
      parameters: { width: w, height: h },
    });

    const ab = await blob.arrayBuffer();
    const buf = Buffer.from(ab);
    return {
      mimeType: blob.type || "image/png",
      imageBytes: buf.toString("base64"),
    };
  });

  return await Promise.all(tasks);
}

router.post("/api/generate-posters", async (req, res) => {
  const { prompt, count = 3, aspectRatio = "4:5" } = req.body || {};

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  if (!GEMINI_KEY()) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is not configured. Please set it in your .env file.",
    });
  }

  const safeCount = Math.max(1, Math.min(4, Number(count) || 3));
  const dimsByAspect = {
    "4:5": { width: 1080, height: 1350 },
    "1:1": { width: 1080, height: 1080 },
    "9:16": { width: 1080, height: 1920 },
  };
  const dims = dimsByAspect[aspectRatio] || dimsByAspect["4:5"];

  const finalPrompt = `${prompt.trim()}

Design constraints:
- Instagram-ready marketing poster
- Clean typography area, professional graphic design, high contrast, readable layout
- Avoid watermarks, avoid gibberish text`;

  try {
    const ai = getGeminiClient();
    const preferredModel = (process.env.GEMINI_IMAGE_MODEL || "").trim();
    const discoveredModel = preferredModel ? null : await pickFirstImageModelName();
    const candidateModels = [
      preferredModel,
      discoveredModel,
      "imagen-4.0-fast-generate-001",
      "imagen-4.0-generate-001",
      "gemini-3.1-flash-image",
      "gemini-2.5-flash-image",
    ].filter(Boolean);

    let response;
    let usedModel = null;
    let lastErr = null;

    for (const model of candidateModels) {
      try {
        response = await ai.models.generateImages({
          model,
          prompt: finalPrompt,
          config: { numberOfImages: safeCount, aspectRatio },
        });
        usedModel = model;
        break;
      } catch (e) {
        lastErr = e;
        const msg = e?.message || "";
        if (msg.includes("is not found") || msg.includes("not supported") || msg.includes("NOT_FOUND")) {
          continue;
        }
        throw e;
      }
    }

    let images = [];

    if (response) {
      images = (response.generatedImages || [])
        .map((gi) => gi?.image)
        .filter(Boolean)
        .map((img) => ({
          mimeType: img.mimeType || "image/png",
          imageBytes: img.imageBytes,
        }));
    } else {
      const nativeModelEnv = (process.env.GEMINI_NATIVE_IMAGE_MODEL || "").trim();
      const nativeModelCandidates = [
        nativeModelEnv,
        "gemini-2.5-flash",
      ].filter(Boolean);

      const calls = Math.max(1, Math.min(4, safeCount));
      let lastNativeErr = null;

      for (const candidateModel of nativeModelCandidates) {
        try {
          usedModel = candidateModel;
          for (let i = 0; i < calls; i++) {
            const gc = await ai.models.generateContent({
              model: candidateModel,
              contents: `${finalPrompt}\n\nVariation ${i + 1} of ${calls}. Make it distinct.`,
            });
            const extracted = extractInlineImages(gc);
            if (extracted.length) images.push(extracted[0]);
          }
          if (images.length) break;
        } catch (e) {
          console.error(`Gemini native error for ${candidateModel}:`, e.message || e);
          images = [];
          lastNativeErr = e;
          const msg = e?.message || "";

          if (msg.includes("not found") || msg.includes("NOT_FOUND") || msg.includes("not supported")) {
            continue;
          }

          console.warn("Gemini failed, falling back to HuggingFace...");
          usedModel = "huggingface";
          images = await generateWithHuggingFace({
            prompt: finalPrompt,
            count: safeCount,
            width: dims.width,
            height: dims.height,
          });
          break;
        }
      }

      if (!images.length && lastNativeErr) throw lastNativeErr;
      if (!images.length && lastErr) throw lastErr;
    }

    if (!images.length) {
      return res.status(502).json({
        error: "No images returned. Your API key may not have image generation enabled for any available model.",
      });
    }

    const source =
      usedModel === "huggingface"
        ? "huggingface"
        : String(usedModel || "").toLowerCase().includes("imagen")
          ? "gemini_imagen"
          : "gemini_native";

    console.log(`Poster source: ${source} (${usedModel})`);

    return res.json({
      images,
      meta: { count: images.length, aspectRatio, model: usedModel, source },
    });
  } catch (err) {
    console.error("Poster generation error:", err?.message || err);
    return res.status(500).json({ error: err?.message || "Failed to generate posters" });
  }
});

router.post("/api/audio/auto-ad", async (req, res) => {
  const { company, product } = req.body;

  if (!company || !product) {
    return res.status(400).json({ error: "Company & Product are required" });
  }

  if (!GEMINI_KEY()) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured. Please set it in your .env file." });
  }

  if (!ELEVEN_KEY()) {
    return res.status(500).json({ error: "ELEVENLABS_API_KEY is not configured. Please set it in your .env file." });
  }

  try {
    console.log(`Generating ad for: ${company} - ${product}`);

    const prompt = `Create a powerful 20-second advertising script (approximately 50-60 words when spoken at normal pace).

Company/Brand: ${company}
Product: ${product}

Requirements:
- Exactly 20 seconds when spoken (50-60 words)
- Tone: energetic, emotional, convincing
- Include: problem identification, solution/benefits, emotional hook, clear call-to-action
- End with a strong brand tagline for ${company}
- Make it engaging and memorable

Write only the script text, no additional commentary.`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const script =
      response.text?.trim() || "Introducing our latest product — experience innovation like never before!";

    const voiceResp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVEN_KEY(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: script,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.6, similarity_boost: 0.8 },
      }),
    });

    if (!voiceResp.ok) {
      const errorText = await voiceResp.text();
      console.error("ElevenLabs API error:", voiceResp.status, errorText);
      if (voiceResp.status === 402) {
        throw new Error(
          "ElevenLabs rejected this voice for your plan. Set ELEVENLABS_VOICE_ID in .env to a free-plan compatible voice from your account."
        );
      }
      throw new Error(`ElevenLabs audio generation failed: ${voiceResp.statusText}`);
    }

    const audioBuffer = await voiceResp.arrayBuffer();

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.byteLength,
      "Content-Disposition": `attachment; filename="${company}-${product}-ad.mp3"`,
    });

    res.send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error("Audio ad error:", err.message || err);
    res.status(500).json({
      error: err.message || "Pipeline failed",
      details: err.stack,
    });
  }
});

export default router;

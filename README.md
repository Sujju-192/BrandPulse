# 🚀 BrandPulse AI
### From Business Idea to Full-Funnel Campaign – Powered by AI

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Gemini-AI-8E75B2?logo=google&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/ElevenLabs-TTS-000000?logo=elevenlabs&logoColor=white" alt="ElevenLabs" />
  <img src="https://img.shields.io/badge/YouTube-Data%20API-FF0000?logo=youtube&logoColor=white" alt="YouTube" />
  <img src="https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=white" alt="Render" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

---

## 📌 Overview

BrandPulse AI is an **all-in-one marketing intelligence platform** that transforms a raw business idea into a complete, execution-ready campaign. Stop juggling scattered tools and re-entering the same information. Here, you enter your business idea **once**, and the platform automatically powers your **strategy, creative content, influencer discovery, and outreach** – seamlessly.

### 🌟 Why BrandPulse AI?

- 🧠 **One Idea, One Workflow** – No copy-pasting, no context switching  
- 🤖 **AI-First** – Strategy, copy, scripts, and audio generated with Gemini & ElevenLabs  
- 📊 **Always in Sync** – Real-time Firestore persistence across tabs and sessions  
- 🎧 **Multimedia Campaigns** – From ad copy to full audio advertisements  
- 🔎 **Data-Driven Influencer Discovery** – Find real creators with the YouTube Data API  
- 🔒 **Secure & Personal** – Google Auth with user-scoped data isolation

---

## 📷 Application Preview

### 🏠 Landing Page
![Landing Page](./screenshots/landing-page.png)

### 📊 Dashboard
![Dashboard](./screenshots/dashboard.png)

### 💡 Your Ideas – Central Hub
![Ideas](./screenshots/ideas.png)

### 🧠 AI Strategy Generator
![Strategy](./screenshots/strategy1.png)
![Strategy](./screenshots/strategy2.png)
![Strategy](./screenshots/strategy3.png)
![Strategy](./screenshots/strategy4.png)

### 🎨 Creative Content Generator
![Creative](./screenshots/content.png)
![Audio](./screenshots/voice-ad.png)

### 👥 Influencer Discovery Engine
![Influencers](./screenshots/influencers.png)

# 🎥 Demo

Experience BrandPulse AI live:  
🔗 **[Launch App](https://brand-pulse-three.vercel.app/)**

Prefer a walkthrough? Watch the full demo video:  
🎬 **[Watch Demo](YOUR_VIDEO_LINK)**

---

## ✨ Core Features

| Feature | Description | Powered By |
|--------|-------------|-------------|
| 🔐 **Google Authentication** | One-click login, protected routes, persistent sessions | Firebase Auth |
| ☁️ **Cloud Database** | Save, edit & delete campaign ideas; user-specific isolation, real-time sync | Firestore |
| 🧠 **AI Strategy Generator** | Marketing strategy, target audience, goals, platform recommendations, brand positioning | Gemini |
| 🎨 **Creative Content Generator** | Ad copy, captions, headlines, CTAs, full campaign copy | Gemini |
| 🎤 **Audio Ad Studio** | Generate scripts, AI voiceovers with playback controls & progress sync | Gemini + ElevenLabs |
| 👥 **Influencer Discovery** | Search by niche, filter by followers, fetch details, generate outreach emails | YouTube Data API + Gemini |
| 🔄 **Unified Workflow** | One idea powers all modules – zero redundant inputs | React Context + Express |

---

## 🏗️ System Architecture
![Architecture Diagram](./screenshots/flowchart.png)

### ⚖️ Old Way vs. BrandPulse AI – Benefits at a Glance
![Comparison](./screenshots/comparision.png)

### High-Level Flow

```text
User
   │
   ▼
React + Vite Frontend
   │
   ├── Firebase Authentication
   ├── Firestore Database
   └── Express Backend APIs
         │
         ├── Gemini (AI Text)
         ├── ElevenLabs (TTS)
         └── YouTube Data API (Influencers)
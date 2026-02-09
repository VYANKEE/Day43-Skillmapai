require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// API Key Check
if (!process.env.NVIDIA_API_KEY) {
  console.error("FATAL ERROR: NVIDIA_API_KEY missing in .env file");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY, 
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

app.post('/api/generate-roadmap', async (req, res) => {
  const { role } = req.body;
  console.log(`🚀 Generating UNLIMITED PHASE roadmap for: ${role}...`);

  try {
    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.1-70b-instruct",
      messages: [
        {
          role: "system",
          content: "You are the Principal Architect at a FAANG company. You are designing a curriculum to turn a junior developer into a Principal Engineer."
        },
        {
          role: "user",
          content: `Create a COMPREHENSIVE, DEEP-DIVE learning roadmap for "${role}".

          CRITICAL INSTRUCTIONS:
          1. 🚫 DO NOT LIMIT PHASES: Do not stick to 3 phases. If the subject needs 8, 10, or 12 phases, CREATE THEM.
          2. 🔎 MICRO-DETAIL: Every topic must have deep technical sub-concepts (e.g., instead of "Learn Databases", say "B-Trees, WAL, Sharding, CAP Theorem").
          3. 🔨 REAL WORLD: The final phases must involve building "Production-Grade" systems (e.g., "Build a Custom Database", "Write a Compiler", "Create a Video Streaming Engine").
          4. 📚 RESOURCES: Provide precise search queries for High-Quality Engineering Blogs (Netflix Tech Blog, Uber Eng) or Advanced YouTube channels.

          STRUCTURE (Strict JSON):
          {
            "role": "${role}",
            "description": "A masterclass path from zero to Principal Engineer.",
            "phases": [
              {
                "phaseName": "Phase 1: [Specific Name]",
                "topics": [
                  {
                    "topic": "Technical Topic Name",
                    "microConcepts": "Deep internal concepts (e.g. Memory Layout, Threading Models)",
                    "status": "pending", 
                    "resources": [
                      { "title": "Deep Dive Video", "url": "https://www.youtube.com/results?search_query=..." },
                      { "title": "Engineering Blog/Docs", "url": "https://www.google.com/search?q=..." }
                    ]
                  }
                ]
              },
              ... (Add as many phases as necessary) ...
            ]
          }

          RETURN ONLY RAW JSON. NO MARKDOWN.`
        }
      ],
      temperature: 0.3, // Precision over creativity
      max_tokens: 6000, // Maximum tokens taaki 10-12 phases aa sakein
      stream: false
    });

    const content = completion.choices[0].message.content;
    
    // Safai Abhiyan (Cleaning JSON)
    const jsonString = content.replace(/```json/g, "").replace(/```/g, "").trim();
    const finalData = JSON.parse(jsonString);
    
    console.log(`✅ Generated ${finalData.phases.length} Phases for ${role}`);
    res.json(finalData);

  } catch (error) {
    console.error("❌ AI Error:", error.message);
    res.status(500).json({ error: "Failed to generate roadmap. Try again." });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
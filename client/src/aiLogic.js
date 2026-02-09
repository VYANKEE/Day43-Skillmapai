// client/src/aiLogic.js

// ✅ YAHAN HAI TERA LIVE BACKEND URL (Render wala)
// Note: End mein '/api/generate-roadmap' zaroor hona chahiye
const SERVER_URL = "https://day43-skillmapai.onrender.com/api/generate-roadmap";

export const generateRoadmap = async (role) => {
  console.log("🚀 Asking Live Server for Roadmap:", role);

  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: role })
    });

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Real AI Data Received:", data);
    return data;

  } catch (error) {
    console.error("❌ Connection Failed:", error);
    // Render ka free server 50 seconds tak sota hai agar use na karo.
    alert("Server jag raha hai... 30 second ruk kar dobara try karo! (Render Free Tier)");
    return null;
  }
};
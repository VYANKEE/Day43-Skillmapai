// client/src/aiLogic.js

const SERVER_URL = "http://localhost:5000/api/generate-roadmap";

export const generateRoadmap = async (role) => {
  console.log("Asking Server for Roadmap:", role); // Debugging ke liye

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
    console.log("Real AI Data Received:", data); // Console mein check karna
    return data;

  } catch (error) {
    console.error("Connection Failed:", error);
    alert("Server se connect nahi ho pa raha! Kya 'node server.js' chal raha hai?");
    return null; // Ab hum Mock Data return NAHI karenge, taaki pata chale error hai
  }
};
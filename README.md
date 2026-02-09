# Day 43 : 45 DAYS CODING CHALLENGE [🚀 SkillMap AI ]

> **From Confusion to Clarity — The Intelligent Career Architect.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Site-blue?style=for-the-badge&logo=vercel)](https://day43-skillmapai.vercel.app/)
[![Tech Stack](https://img.shields.io/badge/Tech_Stack-MERN_%2B_Firebase_%2B_AI-success?style=for-the-badge)](https://github.com/)

**SkillMap AI** is a production-grade career intelligence platform designed to eliminate the ambiguity of self-taught programming. Unlike static roadmaps, SkillMap AI leverages **Large Language Models (LLMs)** via NVIDIA's NIM infrastructure to generate hyper-personalized, step-by-step curriculums tailored to modern industry standards.

---

## 🌟 Key Features

* **🧠 AI-Powered Curriculum Generation**: Utilizes **Meta Llama 3.1 70B (via NVIDIA API)** to architect detailed learning paths.
* **🎯 Role-Specific Intelligence**: Generates specialized roadmaps for MERN Stack, Data Science, AI Engineering, Cyber Security, and more.
* **🔒 Secure Authentication**: Robust user management using **Firebase Authentication** (Google OAuth + Email/Password).
* **☁️ Cloud Persistence**: Progress is synced in real-time across devices using **Firebase Firestore**.
* **💎 Enterprise UI/UX**: A responsive, glassmorphism-inspired interface built with **Tailwind CSS** and **Framer Motion**.
* **📚 Curated Resources**: Automatically aggregates high-quality documentation and YouTube search queries for every micro-concept.

---

## 🛠️ Technology Stack

### **Frontend (Client)**
* **Framework**: React.js (Vite)
* **Styling**: Tailwind CSS, PostCSS
* **Animations**: Framer Motion
* **Icons**: Lucide React
* **Routing**: React Router DOM
* **Deployment**: Vercel

### **Backend (Server)**
* **Runtime**: Node.js
* **Framework**: Express.js
* **AI Integration**: OpenAI SDK (configured for NVIDIA NIM)
* **Security**: CORS, Dotenv
* **Deployment**: Render

### **Database & Services**
* **Database**: Google Firebase Firestore (NoSQL)
* **Auth**: Google Firebase Authentication
* **AI Model**: Meta Llama 3.1 70B Instruct

---

## 🏗️ Architecture

The application follows a **Serverless-First** architecture with a decoupled client and server to ensure security and scalability.

1.  **User Interaction**: User selects a career path on the React Client.
2.  **Secure Request**: The client sends a request to the Node.js Express Server.
3.  **Prompt Engineering**: The server constructs a strict "Principal Engineer" persona prompt.
4.  **AI Inference**: The prompt is sent to NVIDIA's Inference Microservices (NIM).
5.  **Structured Output**: AI returns a raw JSON object containing phases, topics, and resources.
6.  **Data Storage**: The roadmap is stored in Firestore linked to the User ID.
7.  **Visualization**: The client renders the roadmap as an interactive dashboard.


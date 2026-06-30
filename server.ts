import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Initialize express middleware
app.use(express.json());

// Initialize Gemini client lazily to avoid crashing on startup if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in the AI Studio Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Portfolio Knowledge Base for System Instruction
const KEPTON_PORTFOLIO_CONTEXT = `
You are Kepton's digital AI double and Co-Pilot, representing Kepton Otieno (Full Stack Developer, Software Engineer, and AI Enthusiast based in Nairobi, Kenya).
You MUST speak in the FIRST PERSON ("I", "my", "me") because you are representing Kepton directly on his own website.

Your Profile:
- Name: Kepton Otieno
- Professional Title: Full Stack Developer | Software Engineer | AI Enthusiast
- Location: Nairobi, Kenya
- Email: keepytotize@gmail.com / keptonotieno@gmail.com
- GitHub: https://github.com/Keptonotieno?tab=repositories
- LinkedIn: https://www.linkedin.com/in/keptonotieno
- TikTok: https://www.tiktok.com/@keptonotieno

Biography:
I am a passionate, freelance mid-level full-stack developer specializing in building responsive, scalable web applications using cutting-edge technologies. I combine rigorous software engineering principles with deep artificial intelligence knowledge to solve real-world problems and create efficient, modern digital solutions. I am dedicated to continuous learning, maintaining high technical expertise, and building seamless user experiences.

Technical Skills:
- Programming Languages: C++, JavaScript, Python, Java
- Frontend Technologies: React, TypeScript, HTML5, CSS3
- CSS Frameworks: Tailwind CSS, Bootstrap
- Backend & Cloud: Supabase, API Design & Integration, Database Management (SQL/NoSQL)
- Other Skills: Artificial Intelligence, Responsive Web Development, Software Architecture, UI/UX Implementation, Git/GitHub, Website Performance Optimization

Professional Experience:
- Freelance Full Stack Developer (Mid-Level) (2023 - Present)
  - Responsibilities:
    - Developing fully responsive and fast websites.
    - Building scalable full-stack applications with modular code structures.
    - Creating polished, modern user interfaces using React and Tailwind CSS.
    - Implementing database systems, dynamic content sync, and secure backend integrations.
    - Exploring and embedding AI-powered features (like chatbots, prompt engineering, and intelligent processing).
    - Optimizing code for maximum speed, scalability, and accessibility.

Education:
- Full-stack Software Engineering training & certifications.
- Specialized courses in Web Development, Database Architecture, and Artificial Intelligence.
- Constantly pursuing certifications to stay on the absolute cutting edge of technology.

Core Services Offered:
1. Full Stack Web Development: Scalable end-to-end applications from database to responsive UI.
2. Frontend Engineering: Interactive React/TypeScript builds styled with custom Tailwind designs.
3. Backend Integration: Supabase, RESTful APIs, and relational/NoSQL database management.
4. AI Integration: Embedding smart chatbot agents, automated processes, and LLM orchestration.
5. Responsive UI/UX Implementation: Transforming beautiful designs into accessible, pixel-perfect web interfaces.
6. Performance & SEO Optimization: Elevating page speeds, core web vitals, and search visibility.

Featured Projects (which can be customized in the Admin CMS):
1. My Smart Portfolio: This very platform! Built using React, TypeScript, Express, Tailwind CSS, and powered by Gemini 3.5. Includes a dynamic Supabase content sync and live admin controls.
2. AI-Powered Analytics Hub: A SaaS platform incorporating Python and React to process complex data and generate predictive intelligence reports.
3. CyberSpace E-Commerce: A fully integrated digital marketplace using Supabase for authentication, real-time inventory, and interactive client-side checkouts.
4. Smart-Grid Task System: A sleek, keyboard-shortcut-driven project organizer for teams, with real-time sync and custom reminders.

Behavior Guidelines:
- Speak in the FIRST PERSON ("I", "my", "me") as Kepton Otieno.
- Keep your answers highly professional, innovative, clear, and confident.
- Be extremely polite, recruiter-friendly, and goal-oriented.
- Highlight my problem-solving ability, adaptability, and high coding standards.
- If asked about projects, describe the technical stack, my role, and the value it brings.
- Encourage visitors to contact me via the Contact form or directly at keepytotize@gmail.com / keptonotieno@gmail.com.
- Do not make up facts. Answer honestly and gracefully within this profile context.
`;

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Helper to provide an intelligent fallback response if all Gemini models fail or rate-limit
function getSmartFallbackResponse(contents: any[]): string {
  // Find the last user message to give a context-aware fallback answer
  let lastUserMessage = "";
  for (let i = contents.length - 1; i >= 0; i--) {
    if (contents[i].role === "user") {
      const parts = contents[i].parts;
      if (parts && parts.length > 0 && parts[0].text) {
        lastUserMessage = parts[0].text;
        break;
      }
    }
  }

  const query = lastUserMessage.toLowerCase();
  
  if (query.includes("skill") || query.includes("tech") || query.includes("languages") || query.includes("c++") || query.includes("react") || query.includes("typescript")) {
    return "I specialize in building high-performance full-stack applications. My key technologies include **C++**, **JavaScript**, **TypeScript**, **Python**, and **Java**.\n\nOn the frontend, I craft pixel-perfect, interactive user interfaces using **React** with **Tailwind CSS**. For backends, I prefer using serverless setups like **Supabase** or robust Node.js APIs to deliver smooth, scalable systems.";
  }
  
  if (query.includes("experience") || query.includes("job") || query.includes("work") || query.includes("career") || query.includes("freelance")) {
    return "As a freelance mid-level full-stack developer based in Nairobi, I've had the pleasure of building web applications, designing scalable databases, and integrating advanced AI capabilities like Gemini. My goal is always to deliver clean, maintainable, and highly optimized code that aligns perfectly with business objectives.";
  }
  
  if (query.includes("hire") || query.includes("contact") || query.includes("available") || query.includes("email") || query.includes("recruit")) {
    return "I am absolutely open to freelance contracts, part-time opportunities, or full-time roles! You can contact me directly at **keptonotieno@gmail.com** or **keepytotize@gmail.com**.\n\nAlso, feel free to fill out the contact form right on this page—messages are saved directly to my database and synced in real-time!";
  }
  
  if (query.includes("project") || query.includes("build") || query.includes("portfolio")) {
    return "I've built several exciting products, including this fully-interactive personal portfolio, an AI-powered Analytics platform, and a seamless E-commerce marketplace. You can scroll to the **Recent Projects** section of my portfolio to explore the live demos, source code repositories, and quick reviews of each project!";
  }

  if (query.includes("stack") || query.includes("this") || query.includes("database")) {
    return "This application is built with a modern, high-performance stack:\n- **Frontend**: React, TypeScript, and Tailwind CSS with Framer Motion animations.\n- **Backend**: Express.js server on Node.js running securely inside Docker/Cloud Run.\n- **AI Engine**: Gemini 3.5 API with custom system instructions.";
  }

  // Default polite, general response in Kepton's voice
  return "I'm always excited to discuss software engineering, full-stack design, and AI solutions! Although my backend assistant is currently experiencing an unusually high volume of queries, I am fully available to chat.\n\nPlease feel free to reach out to me directly at **keptonotieno@gmail.com** or **keepytotize@gmail.com**, or drop a message through my contact form below. I look forward to hearing from you!";
}

// Model fallback executor with retries
async function generateContentWithRetryAndFallback(
  ai: GoogleGenAI,
  contents: any[],
  systemInstruction: string
): Promise<string> {
  const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of modelsToTry) {
    let attempts = 2; // Try up to 2 times per model
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        console.log(`Attempting generateContent using model ${model} (attempt ${attempt}/${attempts})...`);
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
        if (response && response.text) {
          console.log(`Successfully generated content using model ${model}`);
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        const errMessage = err.message || String(err);
        console.warn(`Error using model ${model} (attempt ${attempt}/${attempts}):`, errMessage);
        
        // If it's the last attempt of the last model, don't sleep
        if (model === modelsToTry[modelsToTry.length - 1] && attempt === attempts) {
          break;
        }
        
        // Wait a small amount before retrying (exponential backoff: 300ms, 600ms...)
        const delay = attempt * 300;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // If both models and all retry attempts fail, log it and return our graceful fallback answer
  console.error("All Gemini API models failed due to high demand or service unavailability. Triggering intelligent server-side fallback.");
  return getSmartFallbackResponse(contents);
}

// Chatbot Endpoint using Gemini 3.5 Flash
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const ai = getGeminiClient();

    // Map the incoming chat history to standard GoogleGenAI format
    // GoogleGenAI chat expects 'user' and 'model' roles.
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        contents.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.content }],
        });
      }
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    // Call our robust retry/fallback helper to generate content safely
    const reply = await generateContentWithRetryAndFallback(ai, contents, KEPTON_PORTFOLIO_CONTEXT);
    res.json({ reply });
  } catch (error: any) {
    console.error("Critical Gemini API Error in backend:", error);
    res.status(500).json({
      error: error.message || "Failed to process chat request.",
      details: "Please ensure GEMINI_API_KEY is configured in Settings > Secrets."
    });
  }
});

// Start server and handle Vite development middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();

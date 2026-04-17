import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";
import { projects, experiences, contactLinks } from "@/lib/projects";

/** Node runtime: Gemini SDK expects a full Node environment on Vercel. */
export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are Jane Doe's portfolio assistant. Answer questions about her skills, projects, experience, and background. Be concise, friendly, and helpful. Keep answers under 3 sentences unless asked for details.

Here is her portfolio information:

Name: Jane Doe
Role: Full Stack Developer
Skills: React, Next.js, TypeScript, Python, GSAP, Tailwind
About: Building digital experiences that inspire and delight.

Projects:
${projects.map((p) => `- ${p.name}: ${p.description} (Tools: ${p.tools.join(", ")})`).join("\n")}

Experience:
${experiences.map((e) => `- ${e.company} — ${e.role} (${e.period}): ${e.description.join("; ")}`).join("\n")}

Contact:
${contactLinks.map((c) => `- ${c.label}: ${c.href}`).join("\n")}

If asked something not related to Jane's profile, politely redirect the conversation back to the portfolio.`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return Response.json(
        { error: "Gemini API key not configured. Add GEMINI_API_KEY to .env.local" },
        { status: 500 }
      );
    }

    const { messages } = await request.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Messages array is required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Understood! I'm Jane's portfolio assistant. How can I help you learn more about her work and experience?" }] },
        ...messages.slice(0, -1).map((m: { role: string; content: string }) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        })),
      ],
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();

    return Response.json({ message: text });
  } catch (err) {
    console.error("Chat API error:", err);
    const detail =
      err instanceof Error
        ? err.message
        : typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "Failed to generate response";
    return Response.json({ error: detail }, { status: 500 });
  }
}

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";
import {
  portfolioProfile,
  experiences,
  educations,
  getProfessionalTenureSummary,
  formatProjectsCaseStudyForChat,
  formatCurrentDateForChat,
  formatProfileForChat,
  formatContactLinksForChat,
  formatHighestDegreeForChat,
  formatPublicationsForChat,
} from "@/lib/projects";

/** Node runtime: Gemini SDK expects a full Node environment on Vercel. */
export const runtime = "nodejs";

function buildSystemPrompt(asOf = new Date()) {
  const owner = portfolioProfile.name;
  return `You are ${owner}'s portfolio assistant. Answer ONLY from the portfolio information below—do not invent employers, dates, degrees, or metrics. If something is not listed, say you do not see it in this portfolio. Be concise, friendly, and helpful. Keep answers under 3 sentences unless asked for details.

— Reference date / “today” (server clock, typically UTC on Vercel):
${formatCurrentDateForChat(asOf)}

— Profile (about, identity, skills):
${formatProfileForChat()}

— Projects (case-study excerpts match the site):
${formatProjectsCaseStudyForChat()}

— Experience (employers, titles, date ranges):
${experiences.map((e) => `- ${e.company} — ${e.role} (${e.period}): ${e.description.join("; ")}`).join("\n")}

${getProfessionalTenureSummary(asOf)}

— Education (degrees, schools, GPA):
${educations
  .map(
    (ed) =>
      `- ${ed.school}: ${ed.degree} — ${ed.field} (${ed.period})${ed.gpa != null ? `; GPA ${ed.gpa}` : ""}. Highlights: ${ed.highlights.join("; ")}.`,
  )
  .join("\n")}
${formatHighestDegreeForChat()}

— Publications (titles and venues as on the site):
${formatPublicationsForChat()}

— Contact links (use these exact labels and URLs):
${formatContactLinksForChat()}

If asked something not related to ${owner}'s profile, politely redirect the conversation back to the portfolio.`;
}

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
    // Default avoids models where Google reports free-tier limit: 0 for some AI Studio projects (see README).
    const modelId = process.env.GEMINI_MODEL?.trim() || "gemini-1.5-flash";
    const model = genAI.getGenerativeModel({ model: modelId });

    const systemPrompt = buildSystemPrompt(new Date());

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        {
          role: "model",
          parts: [
            {
              text: `Understood! I'm ${portfolioProfile.name}'s portfolio assistant. How can I help you learn more about this portfolio?`,
            },
          ],
        },
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

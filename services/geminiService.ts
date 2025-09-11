import { GoogleGenAI, Type } from "@google/genai";
import type { Post, YouTubeVideo } from "../types";

let ai: GoogleGenAI | null = null;

function getAiInstance(): GoogleGenAI | null {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    return null;
  }
  if (!ai) {
    try {
      ai = new GoogleGenAI({ apiKey: API_KEY });
    } catch (error) {
        console.error("Failed to initialize GoogleGenAI:", error);
        return null;
    }
  }
  return ai;
}

const model = "gemini-2.5-flash";

export async function findYouTubeVideo(post: Post): Promise<YouTubeVideo | null> {
  const aiInstance = getAiInstance();
  if (!aiInstance) {
    console.warn("Gemini AI features disabled: API_KEY is not set.");
    return null;
  }

  const prompt = `
    Based on the following blog post title and description, find the most relevant and helpful YouTube video ID.
    The video should be high-quality and directly related to the main topic of the post.
    
    Title: "${post.title}"
    Description: "${post.description}"

    Return ONLY a JSON object with the following structure: {"videoId": "YOUTUBE_VIDEO_ID", "reason": "A brief explanation of why this video is relevant."}.
    Do not include any other text or markdown formatting.
  `;

  try {
    const response = await aiInstance.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                videoId: { type: Type.STRING },
                reason: { type: Type.STRING }
            },
            required: ["videoId", "reason"]
        }
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) return null;
    
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Error fetching YouTube video from Gemini API:", error);
    return null;
  }
}

export async function generateRelatedContentIdeas(productTitle: string): Promise<string[]> {
    const aiInstance = getAiInstance();
    if (!aiInstance) {
        console.warn("Gemini AI features disabled: API_KEY is not set.");
        return [];
    }

    const prompt = `
    You are an expert SEO and content strategist.
    A user is viewing a product named "${productTitle}".
    Generate a list of 3 highly engaging and SEO-friendly blog post titles or topics that are related to this product.
    These topics should help the user make a better purchasing decision or get more value out of the product.

    Return ONLY a JSON object with a single key "ideas" which is an array of 3 strings.
    Example: {"ideas": ["Idea 1", "Idea 2", "Idea 3"]}
    Do not include any other text or markdown formatting.
    `;

    try {
        const response = await aiInstance.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                    ideas: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
                required: ["ideas"]
              }
            },
        });

        const jsonText = response.text.trim();
        if (!jsonText) return [];
        
        const result = JSON.parse(jsonText);
        return result.ideas || [];

    } catch (error) {
        console.error("Error generating related content from Gemini API:", error);
        return [];
    }
}
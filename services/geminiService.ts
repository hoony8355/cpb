import { GoogleGenAI, Type } from "@google/genai";
import { Post, YouTubeVideo } from "../types";

// FIX: Lazily initialize the GoogleGenAI client to avoid a crash on startup if the API_KEY is missing.
// This allows the application to run with Gemini features gracefully disabled.
let aiClient: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI | null => {
    if (aiClient === null) { // Only attempt to initialize once
        if (process.env.API_KEY) {
            aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
        } else {
            console.warn("API_KEY not provided. Gemini services will be disabled.");
            // Keep aiClient as null to indicate it's not available
        }
    }
    return aiClient;
};

export const findYouTubeVideo = async (post: Post): Promise<YouTubeVideo | null> => {
    const ai = getAiClient();
    if (!ai) {
        return null;
    }

    try {
        const prompt = `Find the most relevant YouTube video for a blog post titled "${post.title}" with keywords: ${post.keywords.join(', ')}. The post is about ${post.description}. Return only a JSON object with "id" (the YouTube video ID) and "reason" (a short, compelling reason for recommending it).`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        reason: { type: Type.STRING }
                    },
                    required: ["id", "reason"]
                }
            }
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as YouTubeVideo;
    } catch (error) {
        console.error("Error finding YouTube video:", error);
        return null;
    }
};

export const generateRelatedContentIdeas = async (productName: string): Promise<string[]> => {
    const ai = getAiClient();
    if (!ai) {
        return [];
    }
    
    try {
        const prompt = `You are an expert SEO content strategist. For the product "${productName}", generate 3 compelling, related blog post titles that a user might be interested in. Return only a JSON array of strings.`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as string[];
    } catch (error) {
        console.error("Error generating related content ideas:", error);
        return [];
    }
};


export const findRelatedPosts = async (currentPost: Post, allPosts: Post[]): Promise<Post[]> => {
    const ai = getAiClient();
    if (!ai || allPosts.length <= 1) {
        return [];
    }

    try {
        const otherPosts = allPosts
            .filter(p => p.slug !== currentPost.slug)
            .map(p => ({ slug: p.slug, title: p.title, description: p.description }));

        if (otherPosts.length === 0) return [];

        const prompt = `Based on the current post (title: "${currentPost.title}", description: "${currentPost.description}"), find the 3 most relevant posts from this list:\n${JSON.stringify(otherPosts)}\nReturn only a JSON array of the slugs, e.g., ["slug-1", "slug-2", "slug-3"].`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        const jsonStr = response.text.trim();
        const relatedSlugs: string[] = JSON.parse(jsonStr);
        
        const postsBySlug = new Map(allPosts.map(p => [p.slug, p]));
        return relatedSlugs.map(slug => postsBySlug.get(slug)).filter((p): p is Post => !!p);
    } catch (error) {
        console.error("Error finding related posts:", error);
        return []; // Return empty on error
    }
};

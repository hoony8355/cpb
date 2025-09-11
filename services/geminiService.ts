import { GoogleGenAI, Type } from "@google/genai";
import { Post, SeoData } from "../types";

// As per guidelines, the API key must be from process.env.API_KEY.
// The execution environment is assumed to provide this variable.
const apiKey = process.env.API_KEY;

// Initialize the AI client only if the API key is available.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

if (!apiKey) {
    console.warn("API_KEY environment variable is not set. AI features will be disabled.");
}

export const generateSeoData = async (postContent: string): Promise<SeoData> => {
    // Return fallback data if AI client is not initialized
    if (!ai) {
        return { title: "Blog Post", description: "An interesting blog post.", keywords: "blog, article" };
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the following blog post content, generate a concise and SEO-friendly title (max 60 characters), meta description (max 160 characters), and a comma-separated list of keywords.

Content:
${postContent.substring(0, 4000)}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "SEO-friendly title" },
                        description: { type: Type.STRING, description: "Meta description" },
                        keywords: { type: Type.STRING, description: "Comma-separated keywords" }
                    },
                    required: ["title", "description", "keywords"]
                },
            },
        });
        
        const jsonStr = response.text.trim();
        const seoData = JSON.parse(jsonStr);
        return seoData as SeoData;
    } catch (error) {
        console.error("Error generating SEO data:", error);
        // Return fallback data on error
        return {
            title: "Blog Post",
            description: "An interesting blog post.",
            keywords: "blog, article"
        };
    }
};

export const generateRelatedPosts = async (currentPost: Post, allPosts: Post[]): Promise<Post[]> => {
     // Fallback to simple tag-based logic if AI is not available
     if (!ai) {
        return allPosts.filter(p => 
            p.id !== currentPost.id &&
            p.tags.some(tag => currentPost.tags.includes(tag))
        ).slice(0, 3);
    }

    try {
        const otherPosts = allPosts.filter(p => p.id !== currentPost.id).map(p => ({id: p.id, title: p.title}));
        if (otherPosts.length === 0) return [];

        const prompt = `
Given the current blog post titled "${currentPost.title}" with excerpt "${currentPost.excerpt}", identify the top 3 most relevant posts from the following list.

List of other posts (with id and title):
${JSON.stringify(otherPosts)}

Return only a JSON array of the IDs of the three most related posts, like this: ["post-id-1", "post-id-2", "post-id-3"]. Do not include the current post's ID.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING
                    }
                }
            }
        });

        const jsonStr = response.text.trim();
        const relatedPostIds: string[] = JSON.parse(jsonStr);

        // Map IDs back to full post objects, preserving order from Gemini
        const relatedPostsMap = new Map(allPosts.map(p => [p.id, p]));
        return relatedPostIds.map(id => relatedPostsMap.get(id)).filter((p): p is Post => !!p);

    } catch (error) {
        console.error("Error generating related posts:", error);
        // Fallback to simple tag-based logic on error
        return allPosts.filter(p => 
            p.id !== currentPost.id &&
            p.tags.some(tag => currentPost.tags.includes(tag))
        ).slice(0, 3);
    }
}

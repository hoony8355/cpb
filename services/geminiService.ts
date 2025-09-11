import { GoogleGenAI, Type } from "@google/genai";
import { Post, YouTubeVideo } from '../types';

let ai: GoogleGenAI | null = null;

if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} else {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

export const findYouTubeVideo = async (title: string, description: string, keywords: string[]): Promise<YouTubeVideo | null> => {
  if (!ai) return null;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find the most relevant YouTube video ID for a blog post with the title "${title}", description "${description}", and keywords "${keywords.join(', ')}". Return ONLY a JSON object with "id" and "reason" for your choice.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: 'The YouTube video ID.'},
            reason: { type: Type.STRING, description: 'A short reason for choosing this video.'}
          }
        }
      }
    });
    return JSON.parse(response.text.trim()) as YouTubeVideo;
  } catch (error) {
    console.error("Error finding YouTube video:", error);
    return null;
  }
};


export const generateRelatedContentIdeas = async (productName: string): Promise<string[]> => {
    if (!ai) return [];
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `I have a blog post reviewing a product called "${productName}". As an SEO expert, suggest 3 highly relevant and clickable blog post titles that a user interested in this product might also want to read. Return ONLY a JSON object with a single key "ideas" which is an array of strings.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              ideas: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
          },
        },
      });
      const result = JSON.parse(response.text.trim());
      return result.ideas || [];
    } catch (error) {
      console.error("Error generating related content ideas:", error);
      return [];
    }
};

export const findRelatedPosts = async (currentPost: Post, allPosts: Post[]): Promise<Post[]> => {
    if (!ai || allPosts.length <= 1) return [];

    const otherPosts = allPosts.filter(p => p.slug !== currentPost.slug);
    const postSummaries = otherPosts.map(p => `- slug: ${p.slug}\n  title: ${p.title}\n  description: ${p.description}`).join('\n');

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Here is a main blog post:\n- title: ${currentPost.title}\n- description: ${currentPost.description}\n\nHere is a list of other available posts:\n${postSummaries}\n\nFrom the list, identify the top 3 most relevant posts to the main post. Return ONLY a JSON object with a single key "relatedSlugs" which is an array of the 3 chosen post slugs.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        relatedSlugs: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        const result = JSON.parse(response.text.trim());
        const relatedSlugs: string[] = result.relatedSlugs || [];
        return otherPosts.filter(p => relatedSlugs.includes(p.slug));

    } catch (error) {
        console.error("Error finding related posts:", error);
        return [];
    }
};

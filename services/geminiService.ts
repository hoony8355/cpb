import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { RelatedItem } from "../types";

// The API key MUST be obtained exclusively from the environment variable `process.env.API_KEY`.
// This code assumes `process.env.API_KEY` is set in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateRelatedContent = async (postTitle: string, postContent: string): Promise<RelatedItem[]> => {
    try {
        const prompt = `Based on the following blog post titled "${postTitle}" with content:\n\n${postContent.substring(0, 2000)}\n\nPlease generate 3-5 related content suggestions. These could be other blog posts, articles, or YouTube videos. Provide a title and a URL for each.`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        relatedContent: {
                            type: Type.ARRAY,
                            description: "A list of related content items.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: {
                                        type: Type.STRING,
                                        description: "The title of the related content."
                                    },
                                    url: {
                                        type: Type.STRING,
                                        description: "The URL for the related content."
                                    }
                                },
                                required: ["title", "url"],
                            }
                        }
                    },
                }
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result.relatedContent || [];

    } catch (error) {
        console.error("Error generating related content with Gemini:", error);
        // Implement robust handling for API errors, like exponential backoff for retries.
        return [];
    }
};

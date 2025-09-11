import { GoogleGenAI, Type } from "@google/genai";

// FIX: Correctly initialize GoogleGenAI with a named apiKey parameter from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * Generates a list of related topics for a given blog post title.
   * @param postTitle The title of the blog post.
   * @returns A promise that resolves to an array of related topic strings.
   */
  async getRelatedTopics(postTitle: string): Promise<string[]> {
    try {
      // FIX: Use the recommended 'gemini-2.5-flash' model for general text tasks.
      // FIX: Construct the request to generate content with a JSON response schema for structured output.
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Based on the blog post title "${postTitle}", generate a short list of 3 to 5 related topics or concepts.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              topics: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
              },
            },
            required: ["topics"],
          },
        },
      });

      // FIX: Directly access the 'text' property to get the model's response string.
      const jsonStr = response.text.trim();
      const result = JSON.parse(jsonStr);

      if (result && Array.isArray(result.topics)) {
        return result.topics;
      }

      console.warn("Gemini API returned an unexpected JSON structure.");
      return [];
    } catch (error) {
      console.error("Error generating related topics with Gemini API:", error);
      // Implement graceful error handling by returning an empty array.
      return [];
    }
  },
};

//
// Fix: Import `GoogleGenAI` and `Type` from `@google/genai`
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

//
// Fix: Initialize GoogleGenAI with a named apiKey parameter from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a short summary for a blog post.
 * @param content The full content of the blog post.
 * @returns A promise that resolves to the summary text.
 */
export const generatePostSummary = async (content: string): Promise<string> => {
  try {
    //
    // Fix: Use the correct method `ai.models.generateContent` and the recommended model 'gemini-2.5-flash'.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize the following blog post content in 1-2 sentences:\n\n${content}`,
    });
    //
    // Fix: Access the text directly from the `response.text` property.
    return response.text;
  } catch (error) {
    console.error("Error generating post summary:", error);
    // Gracefully handle API errors.
    return "Could not generate summary at this time.";
  }
};

/**
 * Generates a list of related topics based on post content using a JSON schema.
 * @param content The content of the blog post.
 * @returns A promise that resolves to an array of related topic strings.
 */
export const getRelatedTopics = async (content: string): Promise<string[]> => {
  try {
    //
    // Fix: Use the correct method `ai.models.generateContent` with JSON response configuration.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on the following blog post, list 3-5 related topics or keywords.
      Blog Post: "${content}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topics: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: 'A related topic or keyword'
              },
              description: 'A list of topics related to the blog post.'
            }
          },
          required: ["topics"]
        },
      }
    });

    //
    // Fix: Access the text directly from `response.text` and parse the JSON string.
    const jsonStr = response.text.trim();
    const result = JSON.parse(jsonStr);
    return result.topics || [];

  } catch (error) {
    console.error("Error fetching related topics:", error);
    // Gracefully handle API errors.
    return [];
  }
};

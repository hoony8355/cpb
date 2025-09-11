import { GoogleGenAI, Type } from "@google/genai";
import type { Post } from "../types";

// This file must have an API key set in the environment to work.
if (!process.env.API_KEY) {
  console.warn(
    "API_KEY environment variable not set. Related content feature will be disabled."
  );
}

// FIX: Initialize GoogleGenAI with a named apiKey parameter as required by the new SDK.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      slug: {
        type: Type.STRING,
        description: "The unique slug of the related blog post.",
      },
      title: {
        type: Type.STRING,
        description: "The title of the related blog post.",
      },
      reason: {
        type: Type.STRING,
        description:
          "A brief, compelling reason (under 15 words) why this post is a good recommendation for the reader.",
      },
    },
    required: ["slug", "title", "reason"],
  },
};

export async function findRelatedPosts(currentPost: Post, allPosts: Post[]) {
  if (!process.env.API_KEY) {
    return [];
  }

  // Filter out the current post from the list of potential related posts.
  const otherPosts = allPosts
    .filter((p) => p.slug !== currentPost.slug)
    .map(({ slug, title, description }) => ({ slug, title, description }));

  if (otherPosts.length === 0) {
    return [];
  }

  const prompt = `
    Based on the current blog post titled "${
      currentPost.title
    }" with the description "${
    currentPost.description
  }", please recommend up to 3 related posts from the following list.

    For each recommendation, provide the post's slug, title, and a short, engaging reason (under 15 words) explaining why someone who liked the current article would find it interesting.
    Do not recommend the original post.

    Available posts:
    ${JSON.stringify(otherPosts, null, 2)}

    Return your answer as a JSON array of objects.
  `;

  try {
    // FIX: Use the 'gemini-2.5-flash' model for general text tasks as per guidelines.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    // FIX: Extract text directly from response.text and parse it, which is the correct way to get the content.
    const jsonText = response.text.trim();
    if (!jsonText) {
        console.warn("Gemini API returned an empty response for related posts.");
        return [];
    }
    const related = JSON.parse(jsonText);
    
    // Ensure the result is an array before returning.
    return Array.isArray(related) ? related : [];

  } catch (error) {
    console.error("Error fetching related posts from Gemini API:", error);
    // Return an empty array on error to prevent the UI from breaking.
    return [];
  }
}

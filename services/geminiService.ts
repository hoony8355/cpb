import { GoogleGenAI, Type } from "@google/genai";
import type { Post } from '../types';

let ai: GoogleGenAI | null = null;
if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} else {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

export async function findYouTubeVideo(title: string, description: string, keywords: string[]) {
  if (!ai) return null;
  try {
    const prompt = `
      You are a helpful SEO content assistant.
      Based on the following blog post details, find the single most relevant and helpful YouTube video for the reader.
      
      Post Title: "${title}"
      Post Description: "${description}"
      Keywords: ${keywords.join(', ')}

      Respond with only a JSON object containing "videoId" and a "reason" explaining in Korean why this video is a great recommendation for the reader of this post.
      Example: {"videoId": "some_youtube_id", "reason": "이 영상은 제품의 실제 사용 모습을 보여주어 구매를 고려하는 독자에게 큰 도움이 됩니다."}
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            videoId: { type: Type.STRING, description: 'The YouTube video ID.' },
            reason: { type: Type.STRING, description: 'A brief reason for recommending this video, in Korean.' }
          }
        },
      },
    });
    
    return JSON.parse(response.text);

  } catch (error) {
    console.error('Error fetching YouTube video from Gemini API:', error);
    return null;
  }
}

export async function generateRelatedContentIdeas(productTitle: string): Promise<string[]> {
  if (!ai || !productTitle) return [];
  try {
    const prompt = `"${productTitle}" 제품과 관련된 블로그 게시물 주제 3개를 생성해 주세요. 주제는 사용 팁, 비교 가이드, 구매 결정에 도움이 되는 정보 등 독자의 관심을 끌 만한 창의적인 제목 형식이어야 합니다. 결과는 JSON 문자열 배열로만 응답해주세요. 예: ["주제 1", "주제 2", "주제 3"]`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error('Error fetching related content ideas from Gemini API:', error);
    return [];
  }
}

export async function findRelatedPosts(currentPost: Post, allPosts: Post[]): Promise<string[]> {
    if (!ai) return [];
    try {
        const postSummaries = allPosts.map(p => ({ slug: p.slug, title: p.title, description: p.description }));

        const prompt = `
        You are a blog content curator. Based on the current post, find the 3 most relevant posts from the provided list.
        
        Current Post:
        - Title: "${currentPost.title}"
        - Description: "${currentPost.description}"

        List of available posts (JSON format):
        ${JSON.stringify(postSummaries)}

        Analyze the content and context, not just keywords.
        Respond with only a JSON array of the top 3 most relevant post slugs.
        Example: ["related-post-slug-1", "related-post-slug-2", "related-post-slug-3"]
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                },
            },
        });
        
        return JSON.parse(response.text);

    } catch (error) {
        console.error('Error fetching related posts from Gemini API:', error);
        return [];
    }
}

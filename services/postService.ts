import type { Post, Author } from '../types';
import { parseMarkdown } from './markdownParser';

// Mock authors database
const authors: { [key: string]: Author } = {
  "trend-guru": {
    name: "Alex Chen",
    avatar: "https://i.pravatar.cc/150?u=alexchen"
  },
  "tech-enthusiast": {
    name: "Samantha Lee",
    avatar: "https://i.pravatar.cc/150?u=samanthalee"
  }
};

// Mock raw markdown content for posts
const rawPosts: { [slug: string]: string } = {
  "latest-smartphone-trends": `
---
title: "2024년 최신 스마트폰 트렌드: AI, 폴더블, 그리고 그 이상"
description: "AI 기능이 탑재된 최신 스마트폰부터 더욱 발전된 폴더블 기기까지, 2024년 스마트폰 시장을 주도하는 주요 트렌드를 심층 분석합니다."
date: "2024-07-20"
coverImage: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
author: "tech-enthusiast"
keywords: ["스마트폰", "AI", "폴더블", "2024년 트렌드", "기술"]
---
## 서론: 스마트폰 시장의 새로운 바람

2024년 스마트폰 시장은 인공지능(AI)의 통합과 폴더블 기술의 성숙을 중심으로 빠르게 변화하고 있습니다. 사용자들은 이제 단순한 통화와 앱 사용을 넘어, 개인 비서처럼 똑똑하고, 필요에 따라 화면 크기를 조절할 수 있는 기기를 원하고 있습니다. 본문에서는 올해 주목해야 할 주요 스마트폰 트렌드를 자세히 살펴보겠습니다.
`,
  "top-5-laptops-for-creators": `
---
title: "크리에이터를 위한 최고의 노트북 Top 5 (2024년 업데이트)"
description: "영상 편집, 그래픽 디자인, 음악 작업을 위한 최고의 성능을 갖춘 2024년 크리에이터용 노트북 5가지를 추천하고 각 모델의 장단점을 비교 분석합니다."
date: "2024-07-18"
coverImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1326&q=80"
author: "trend-guru"
keywords: ["노트북", "크리에이터", "영상 편집", "맥북 프로", "델 XPS"]
---
### 콘텐츠 제작의 핵심, 노트북

크리에이터에게 노트북은 단순한 작업 도구를 넘어 창의력을 발휘하는 캔버스와도 같습니다. 영상 편집, 3D 모델링, 고해상도 이미지 작업 등 무거운 작업을 원활하게 처리하려면 강력한 성능은 필수입니다. 2024년, 크리에이터들의 까다로운 요구를 만족시키는 최고의 노트북은 어떤 것들이 있을까요?
`,
    "understanding-gemini-api": `
---
title: "Google Gemini API 시작하기: 초보자를 위한 안내서"
description: "Google의 강력한 AI 모델인 Gemini를 시작하는 방법을 알아보세요. API 키 설정부터 첫 번째 요청 전송까지 모든 단계를 안내합니다."
date: "2024-07-22"
coverImage: "https://images.unsplash.com/photo-1696231113559-2314c4369a25?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
author: "tech-enthusiast"
keywords: ["Gemini API", "Google AI", "프로그래밍", "API", "인공지능"]
---
## Gemini API란 무엇인가?

Gemini는 Google이 개발한 차세대 멀티모달 AI 모델 제품군입니다. 텍스트, 이미지, 오디오, 비디오 등 다양한 유형의 정보를 이해하고 처리할 수 있습니다. 개발자는 Gemini API를 사용하여 자신의 애플리케이션에 이러한 강력한 AI 기능을 통합할 수 있습니다.
`
};

let allPosts: Post[] | undefined;

function processPosts(): Post[] {
  if (allPosts) return allPosts;

  const posts = Object.entries(rawPosts).map(([slug, rawContent]) => {
    const { frontmatter, content, schemaJson } = parseMarkdown(rawContent);
    const authorId = frontmatter.author as string;
    
    return {
      slug,
      title: frontmatter.title as string,
      description: frontmatter.description as string,
      date: frontmatter.date as string,
      coverImage: frontmatter.coverImage as string,
      author: authors[authorId] || { name: 'Unknown', avatar: ''},
      keywords: frontmatter.keywords as string[] || [],
      content,
      schemaJson
    };
  });

  // Sort posts by date in descending order
  allPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return allPosts;
}


export function getAllPosts(): Post[] {
  return processPosts();
}

export function getPostBySlug(slug: string): Post | undefined {
  return processPosts().find(p => p.slug === slug);
}

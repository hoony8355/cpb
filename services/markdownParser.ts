import { Post, Product, FaqItem } from '../types';

const parseProductSection = (section: string): Product | null => {
  try {
    const nameMatch = section.match(/###\s?\d*\.\s*(.*)/);
    const imageMatch = section.match(/!\[.*?\]\((.*?)\)/);
    const linkMatch = section.match(/<a href="(.*?)"/);
    
    // This regex is a bit brittle and depends on the exact format from the example.
    const ratingReviewMatch = section.match(/<span>⭐ ([\d.]+)\/\d+<\/span>[\s\S]*?<span>리뷰 ([\d,]+)개<\/span>/);
    let rating, reviewCount;
    if (ratingReviewMatch) {
      rating = ratingReviewMatch[1];
      reviewCount = ratingReviewMatch[2];
    }

    // A more robust way to get description, looking for the first paragraph after an image or link.
    const descriptionParagraphs = section.split('\n\n');
    let description = '';
    let foundImageOrLink = false;
    for(const p of descriptionParagraphs) {
        if (p.includes('![]') || p.includes('<a href')) {
            foundImageOrLink = true;
            continue;
        }
        if (foundImageOrLink && p.trim() && !p.trim().startsWith('**') && !p.trim().startsWith('<')) {
            description = p.trim();
            break;
        }
    }


    const prosMatch = section.match(/\*\*장점:\*\*\s*\n((-\s*.*\n?)+)/);
    const pros = prosMatch ? prosMatch[1].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace('-', '').trim()) : [];
    
    const consMatch = section.match(/\*\*단점:\*\*\s*\n((-\s*.*\n?)+)/);
    const cons = consMatch ? consMatch[1].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace('-', '').trim()) : [];
    

    return {
      name: nameMatch ? nameMatch[1].trim() : 'Unnamed Product',
      imageUrl: imageMatch ? imageMatch[1].split(',')[0].trim() : undefined,
      rating,
      reviewCount,
      description,
      pros,
      cons,
      link: linkMatch ? linkMatch[1] : '#',
    };
  } catch (error) {
    console.error('Error parsing product section:', error);
    return null;
  }
};


const parseFaqSection = (faqContent: string): FaqItem[] => {
  const faqItems: FaqItem[] = [];
  const questionMatches = Array.from(faqContent.matchAll(/###\s*(.*)/g));
  
  questionMatches.forEach((match, index) => {
    const question = match[1].trim();
    const startIndex = match.index! + match[0].length;
    const endIndex = index + 1 < questionMatches.length ? questionMatches[index + 1].index : undefined;
    const answer = faqContent.substring(startIndex, endIndex).trim();
    faqItems.push({ question, answer });
  });

  return faqItems;
};


export const parseMarkdown = (slug: string, rawContent: string): Post => {
  const parts = rawContent.split('---');
  const frontmatter = parts[1];
  let body = parts.slice(2).join('---').trim();

  const metadata: any = {};
  frontmatter.split('\n').forEach(line => {
    if (line.trim()) {
      const firstColonIndex = line.indexOf(':');
      if (firstColonIndex !== -1) {
        const key = line.slice(0, firstColonIndex).trim();
        const value = line.slice(firstColonIndex + 1).trim().replace(/^['"]|['"]$/g, '');
        metadata[key] = value;
      }
    }
  });
  
  if (metadata.keywords && typeof metadata.keywords === 'string') {
      metadata.keywords = JSON.parse(metadata.keywords);
  } else {
      metadata.keywords = [];
  }

  let schemaJson: string | undefined = undefined;
  const schemaRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/;
  const match = body.match(schemaRegex);
  if (match && match[1]) {
    schemaJson = match[1].trim();
    body = body.replace(schemaRegex, '').trim();
  }
  
  // Structured content parsing
  const topHeading = '## 추천 상품 목록';
  const conclusionHeading = '## 결론';
  const faqHeading = '## 자주 묻는 질문 (FAQ)';

  const introEndIndex = body.indexOf(topHeading);
  const intro = introEndIndex !== -1 ? body.substring(0, introEndIndex).trim() : body.split(conclusionHeading)[0].split(faqHeading)[0].trim();

  const conclusionIndex = body.indexOf(conclusionHeading);
  const faqIndex = body.indexOf(faqHeading);

  const productSectionStart = introEndIndex !== -1 ? introEndIndex + topHeading.length : -1;
  const productSectionEnd = conclusionIndex !== -1 ? conclusionIndex : (faqIndex !== -1 ? faqIndex : body.length);
  
  let products: Product[] = [];
  if(productSectionStart !== -1){
      const productContent = body.substring(productSectionStart, productSectionEnd).trim();
      products = productContent
          .split('---')
          .map(section => section.trim())
          .filter(Boolean)
          .map(parseProductSection)
          .filter((p): p is Product => p !== null);
  }


  let conclusion = '';
  if (conclusionIndex !== -1) {
    const conclusionEnd = faqIndex !== -1 ? faqIndex : body.length;
    conclusion = body.substring(conclusionIndex + conclusionHeading.length, conclusionEnd).trim();
  }

  let faq: FaqItem[] = [];
  if (faqIndex !== -1) {
    const faqContent = body.substring(faqIndex + faqHeading.length).trim();
    faq = parseFaqSection(faqContent);
  }


  return {
    slug,
    title: metadata.title || 'Untitled Post',
    date: metadata.date || new Date().toISOString().split('T')[0],
    description: metadata.description || '',
    keywords: metadata.keywords || [],
    author: {
        name: metadata.author || 'Trend Spotter 콘텐츠 팀',
        image: metadata.authorImage,
        bio: metadata.authorBio,
        socialLinks: metadata.authorSocialLinks ? JSON.parse(metadata.authorSocialLinks) : []
    },
    schemaJson,
    // Add structured content
    intro,
    products,
    conclusion,
    faq,
    content: body, // Keep raw content for fallback or other uses
  };
};

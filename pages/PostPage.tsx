import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Helmet } from 'react-helmet-async';

import { getAllPosts, getPostBySlug } from '../services/postService';
import { findYouTubeVideo } from '../services/geminiService';
import { Post, YouTubeVideo } from '../types';

import SeoManager from '../components/SeoManager';
import AuthorBox from '../components/AuthorBox';
import Breadcrumbs from '../components/Breadcrumbs';
import YouTubeEmbed from '../components/YouTubeEmbed';
import RelatedPosts from '../components/RelatedPosts';
import ProductSection from '../components/ProductSection';
import FaqSection from '../components/FaqSection';
import RelatedContent from '../components/RelatedContent';

// ✅ 동일 규칙(소문자-하이픈)으로 slug를 표준화
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const ORIGIN = 'https://cpb-five.vercel.app';
const headingIdFromText = (text: string, fallback: string) => {
  const normalized = text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return normalized || fallback;
};
const extractPlainText = (value: React.ReactNode): string => {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(extractPlainText).join('');
  if (React.isValidElement(value)) return extractPlainText(value.props.children);
  return '';
};

const sanitizeFaqHtml = (html = '') =>
  html
    .replace(/<\/?(?!a\b|ol\b|ul\b|li\b)[^>]+>/gi, '')
    .replace(/\s(on\w+|style)="[^"]*"/gi, '');

const PostPage: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();

  // 사용자 입력 slug를 정규화(디코드 → slugify)
  const cleanSlug = slugify(decodeURIComponent(slug));

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [video, setVideo] = useState<YouTubeVideo | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');
  const [quickNextPost, setQuickNextPost] = useState<Post | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

  const tableOfContents = useMemo(() => {
    if (!post) return [];
    const headingRegex = /^(##|###)\s+(.+)$/gm;
    const matches = Array.from(post.content.matchAll(headingRegex));
    return matches.map((match, index) => {
      const level = match[1].length;
      const title = match[2].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
      const id = headingIdFromText(title, `section-${index + 1}`);
      return { level, title, id };
    });
  }, [post]);

  const readingTimeMinutes = useMemo(() => {
    if (!post) return 1;
    const plainText = post.content
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/!\[.*?\]\(.*?\)/g, ' ')
      .replace(/\[([^\]]+)\]\((.*?)\)/g, '$1')
      .replace(/[#>*`~-]/g, ' ');
    const words = plainText.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 250));
  }, [post]);
  const sectionSummaries = useMemo(() => {
    if (!post) return {};
    const lines = post.content.split('\n');
    const map: Record<string, string> = {};

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i].trim();
      const headingMatch = line.match(/^(##|###)\s+(.+)$/);
      if (!headingMatch) continue;

      const headingText = headingMatch[2].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
      const id = headingIdFromText(headingText, `section-${i}`);

      let summary = '';
      for (let j = i + 1; j < lines.length; j += 1) {
        const candidate = lines[j].trim();
        if (!candidate || candidate.startsWith('#') || candidate.startsWith('![') || candidate.startsWith('- ')) continue;
        if (candidate.startsWith('<')) continue;
        summary = candidate.replace(/[*`_>#-]/g, '').slice(0, 120);
        break;
      }
      map[id] = summary;
    }
    return map;
  }, [post]);

  useEffect(() => {
    const fetchPost = async () => {
      // slug가 없으면 에러
      if (!slug) {
        setError('No post slug provided.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setVideo(null);
      setIsMobileTocOpen(false);

      try {
        // 서비스에서도 동일 규칙으로 탐색하므로 안전하게 매칭됨
        const fetchedPost = await getPostBySlug(cleanSlug);
        setPost(fetchedPost);

        if (fetchedPost) {
          // 부가 영상 탐색(비동기)
          findYouTubeVideo(fetchedPost).then(setVideo).catch(() => {});
          const allPosts = await getAllPosts();
          const candidate = allPosts.find(
            (item) =>
              item.slug !== fetchedPost.slug &&
              item.keywords?.some((keyword) => fetchedPost.keywords?.includes(keyword))
          );
          setQuickNextPost(candidate || allPosts.find((item) => item.slug !== fetchedPost.slug) || null);
        } else {
          setQuickNextPost(null);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load the post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [cleanSlug, slug]);

  useEffect(() => {
    if (tableOfContents.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: '0px 0px -70% 0px',
        threshold: [0.1, 0.5, 1.0],
      }
    );

    tableOfContents.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [tableOfContents]);

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const maxScrollable = scrollHeight - clientHeight;
      if (maxScrollable <= 0) {
        setReadingProgress(0);
        return;
      }
      const ratio = Math.min(100, Math.max(0, (scrollTop / maxScrollable) * 100));
      setReadingProgress(Math.round(ratio));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 로딩
  if (loading) {
    return <div className="text-center py-20">Loading post...</div>;
  }

  // 에러
  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  // 포스트가 없는데, 현재 URL이 비정규화(slug !== cleanSlug)라면
  // 표준 경로로 교체 시도 (중복/변칙 주소를 한 번에 정리)
  if (!post && slug && slug !== cleanSlug) {
    return <Navigate to={`/post/${cleanSlug}`} replace />;
  }

  // 정말 없는 경우
  if (!post) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <p className="mt-4">The post you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  // 포스트는 있는데 현재 경로가 캐노니컬과 다르면 정리(예: 대문자/공백 포함 URL로 접근)
  if (slug !== post.slug) {
    return <Navigate to={`/post/${post.slug}`} replace />;
  }

  const canonicalUrl = `${ORIGIN}/post/${post.slug}`;
  const keywords = Array.isArray(post.keywords) ? post.keywords.join(', ') : '';
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Trend Spotter 콘텐츠 팀',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Trend Spotter',
      url: ORIGIN,
    },
    mainEntityOfPage: canonicalUrl,
    image: post.coverImage ? [post.coverImage] : undefined,
    keywords,
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trend Spotter 블로그 메인',
        item: ORIGIN,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '제품 추천 아티클',
        item: `${ORIGIN}/all-posts.html`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };
  const faqSchema =
    post.faq && post.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: sanitizeFaqHtml(item.answer),
            },
          })),
        }
      : null;
  const productListSchema =
    post.products && post.products.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: post.products.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Product',
              name: product.name,
              description: product.description,
              url: product.link,
              image: product.imageUrl,
              aggregateRating:
                product.rating && product.reviewCount
                  ? {
                      '@type': 'AggregateRating',
                      ratingValue: product.rating,
                      reviewCount: product.reviewCount,
                    }
                  : undefined,
            },
          })),
        }
      : null;
  const tableOfContentsSchema =
    tableOfContents.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `${post.title} 목차`,
          itemListElement: tableOfContents.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.title,
            url: `${canonicalUrl}#${item.id}`,
          })),
        }
      : null;
  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [articleSchema, breadcrumbSchema, faqSchema, productListSchema, tableOfContentsSchema].filter(Boolean),
  };
  const activeSectionIndex = tableOfContents.findIndex((item) => item.id === activeSection);
  const nextSection = activeSectionIndex >= 0 ? tableOfContents[activeSectionIndex + 1] : tableOfContents[0];
  const followUpSection = nextSection || tableOfContents[0];
  const isLastSection = !nextSection && tableOfContents.length > 0;

  return (
    <>
      <SeoManager
        title={`${post.title} | Trend Spotter`}
        description={post.description}
        keywords={keywords}
        canonicalUrl={canonicalUrl}
        ogImage={post.coverImage}
        type="article"
      />

      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schemaGraph)}</script>
      </Helmet>

      <div className="sticky top-0 z-40 h-1 w-full bg-slate-200/70">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-cyan-500 transition-all duration-200"
          style={{ width: `${readingProgress}%` }}
          role="progressbar"
          aria-label="읽기 진행률"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={readingProgress}
        />
      </div>

      <div className="container mx-auto px-4 py-8 md:py-10">
        <article className="max-w-3xl mx-auto content-card p-5 md:p-8 overflow-hidden">
          <Breadcrumbs postTitle={post.title} />

          <header className="mb-8 pb-6 border-b border-slate-100">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{post.title}</h1>
            <p className="text-gray-500 text-sm">
              {new Date(post.date).toLocaleDateString()} by {post.author.name} · 읽기 약 {readingTimeMinutes}분
            </p>
            <p className="text-xs text-gray-400 mt-1">
              최종 검수: {new Date().toLocaleDateString()} · 가격/혜택 정보는 수시로 변동될 수 있습니다.
            </p>
            <p className="text-xs text-sky-700 mt-2 font-medium">읽기 진행률: {readingProgress}%</p>
          </header>

          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={`Cover for ${post.title}`}
              className="w-full h-auto max-h-96 object-cover rounded-lg mb-8 shadow-lg"
            />
          )}

          <div className="prose prose-slate max-w-none lg:prose-lg mb-12">
            {tableOfContents.length > 0 && (
              <nav
                aria-label="Table of contents"
                className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4 not-prose lg:sticky lg:top-24 z-20 max-h-[70vh] overflow-auto"
              >
                <p className="text-sm font-semibold text-slate-700 mb-3">목차</p>
                <button
                  type="button"
                  onClick={() => setIsMobileTocOpen((prev) => !prev)}
                  aria-expanded={isMobileTocOpen}
                  aria-controls="post-toc-list"
                  className="mb-3 inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 lg:hidden"
                >
                  {isMobileTocOpen ? '목차 접기' : '목차 펼치기'}
                </button>
                <ul id="post-toc-list" className={`space-y-2 text-sm ${isMobileTocOpen ? 'block' : 'hidden'} lg:block`}>
                  {tableOfContents.map((item, index) => (
                    <li key={`${item.id}-${index}`} className={item.level === 3 ? 'ml-4' : ''}>
                      <a
                        href={`#${item.id}`}
                        className={`hover:underline ${
                          activeSection === item.id ? 'text-sky-900 font-semibold' : 'text-sky-700 hover:text-sky-900'
                        }`}
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
                {activeSection && sectionSummaries[activeSection] && (
                  <div className="mt-4 rounded-md bg-white border border-slate-200 p-3">
                    <p className="text-xs text-slate-500 mb-1">현재 섹션 요약</p>
                    <p className="text-sm text-slate-700">{sectionSummaries[activeSection]}</p>
                  </div>
                )}
                {followUpSection && (
                  <button
                    type="button"
                    onClick={() => {
                      const element = document.getElementById(followUpSection.id);
                      if (element) {
                        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                        element.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
                      }
                    }}
                    className="mt-4 w-full rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700"
                  >
                    {isLastSection ? `처음으로 돌아가기: ${followUpSection.title}` : `다음 섹션 읽기: ${followUpSection.title}`}
                  </button>
                )}
              </nav>
            )}

            {quickNextPost && (
              <aside className="not-prose mb-8 rounded-xl border border-sky-200 bg-gradient-to-r from-sky-50 to-cyan-50 p-4">
                <p className="text-xs text-sky-700 font-semibold mb-2">다음 추천 글</p>
                <Link to={`/post/${quickNextPost.slug}`} className="text-sky-900 font-semibold hover:underline inline-flex items-center gap-1">
                  {quickNextPost.title}
                  <span aria-hidden="true">→</span>
                </Link>
              </aside>
            )}

            {post.products && post.products.length > 0 && (
              <section className="not-prose mb-8 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="px-3 py-2 text-left">순위</th>
                      <th className="px-3 py-2 text-left">상품명</th>
                      <th className="px-3 py-2 text-left">핵심 포인트</th>
                      <th className="px-3 py-2 text-left">링크</th>
                    </tr>
                  </thead>
                  <tbody>
                    {post.products.map((product, index) => (
                      <tr key={index} className="border-t border-slate-100 odd:bg-white even:bg-slate-50/40">
                        <td className="px-3 py-2 font-semibold">{index + 1}</td>
                        <td className="px-3 py-2">{product.name}</td>
                        <td className="px-3 py-2 text-slate-600">{product.description?.slice(0, 80)}</td>
                        <td className="px-3 py-2">
                          <a
                            href={product.link}
                            target="_blank"
                            rel="noopener sponsored"
                            className="text-sky-700 hover:text-sky-900 hover:underline"
                          >
                            보러가기
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="px-3 py-2 text-xs text-slate-500 md:hidden">좌우로 스와이프해서 표를 확인하세요.</p>
              </section>
            )}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h2: ({ children, ...props }) => {
                  const text = extractPlainText(children);
                  const id = headingIdFromText(text, 'section');
                  return (
                    <h2 {...props} id={id} className={`scroll-mt-24 ${props.className || ''}`.trim()}>
                      {children}
                    </h2>
                  );
                },
                h3: ({ children, ...props }) => {
                  const text = extractPlainText(children);
                  const id = headingIdFromText(text, 'section');
                  return (
                    <h3 {...props} id={id} className={`scroll-mt-24 ${props.className || ''}`.trim()}>
                      {children}
                    </h3>
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {video && (
            <div className="my-10">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">추천 영상</h3>
              <p className="text-sm text-slate-600 mb-4">{video.reason}</p>
              <YouTubeEmbed embedId={video.id} title={post.title} />
            </div>
          )}

          {post.products && post.products.length > 0 && (
            <div className="my-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                🏆 추천 상품 Top {post.products.length}
              </h2>
              {post.products.map((product, index) => (
                <ProductSection key={index} product={product} index={index + 1} />
              ))}
              <RelatedContent productName={post.products[0].name} />
            </div>
          )}

          {post.faq && post.faq.length > 0 && <FaqSection faqItems={post.faq} />}

          <AuthorBox author={post.author} />
          <RelatedPosts currentPost={post} />
        </article>
      </div>
    </>
  );
};

export default PostPage;

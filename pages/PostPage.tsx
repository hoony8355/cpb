import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Helmet } from 'react-helmet-async';

import { getPostBySlug } from '../services/postService';
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

const PostPage: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();

  // 사용자 입력 slug를 정규화(디코드 → slugify)
  const cleanSlug = slugify(decodeURIComponent(slug));

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [video, setVideo] = useState<YouTubeVideo | null>(null);

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

      try {
        // 서비스에서도 동일 규칙으로 탐색하므로 안전하게 매칭됨
        const fetchedPost = await getPostBySlug(cleanSlug);
        setPost(fetchedPost);

        if (fetchedPost) {
          // 부가 영상 탐색(비동기)
          findYouTubeVideo(fetchedPost).then(setVideo).catch(() => {});
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
  const tableOfContents = useMemo(() => {
    const headingRegex = /^(##|###)\s+(.+)$/gm;
    const matches = Array.from(post.content.matchAll(headingRegex));
    return matches.map((match, index) => {
      const level = match[1].length;
      const title = match[2].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
      const id = headingIdFromText(title, `section-${index + 1}`);
      return { level, title, id };
    });
  }, [post.content]);
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
        name: '홈',
        item: ORIGIN,
      },
      {
        '@type': 'ListItem',
        position: 2,
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
              text: item.answer,
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

      <div className="container mx-auto px-4 py-8">
        <article className="max-w-3xl mx-auto">
          <Breadcrumbs postTitle={post.title} />

          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{post.title}</h1>
            <p className="text-gray-500 text-sm">
              {new Date(post.date).toLocaleDateString()} by {post.author.name}
            </p>
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
                className="mb-8 rounded-lg border border-slate-200 bg-slate-50 p-4 not-prose"
              >
                <p className="text-sm font-semibold text-slate-700 mb-3">목차</p>
                <ul className="space-y-2 text-sm">
                  {tableOfContents.map((item, index) => (
                    <li key={`${item.id}-${index}`} className={item.level === 3 ? 'ml-4' : ''}>
                      <a href={`#${item.id}`} className="text-sky-700 hover:text-sky-900 hover:underline">
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h2: ({ children, ...props }) => {
                  const text = extractPlainText(children);
                  const id = headingIdFromText(text, 'section');
                  return (
                    <h2 id={id} {...props}>
                      {children}
                    </h2>
                  );
                },
                h3: ({ children, ...props }) => {
                  const text = extractPlainText(children);
                  const id = headingIdFromText(text, 'section');
                  return (
                    <h3 id={id} {...props}>
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

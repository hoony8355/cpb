import React, { useEffect, useState } from 'react';
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

  return (
    <>
      {/* 기존 SEO 매니저 유지 + 캐노니컬/OG를 Helmet으로 보강 */}
      <SeoManager
        title={`${post.title} | Trend Spotter`}
        description={post.description}
        keywords={keywords}
      />

      <Helmet>
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={`${post.title} | Trend Spotter`} />
        {post.description && <meta property="og:description" content={post.description} />}
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
        <meta name="robots" content="index,follow" />
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
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
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

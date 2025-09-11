import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostBySlug } from '../services/postService';
import { Post } from '../types';
import SeoManager from '../components/SeoManager';
import AuthorBox from '../components/AuthorBox';
import NotFoundPage from './NotFoundPage';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedPosts from '../components/RelatedPosts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ProductSection from '../components/ProductSection';
import FaqSection from '../components/FaqSection';

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setPost(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const fetchedPost = await getPostBySlug(slug);
        setPost(fetchedPost);
      } catch (error) {
        console.error("Failed to fetch post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="text-center p-10">Loading post...</div>;
  }

  if (!post) {
    return <NotFoundPage />;
  }

  return (
    <>
      <SeoManager post={post} />
        <main className="container mx-auto p-4 md:p-8">
            <article className="bg-white shadow-lg rounded-lg p-6 md:p-10">
                <header className="text-center border-b pb-8 mb-8">
                    <Breadcrumbs postTitle={post.title} />
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight">{post.title}</h1>
                    <p className="mt-4 text-lg text-slate-500 max-w-3xl mx-auto">{post.description}</p>
                     <p className="text-gray-500 text-sm mt-4">
                        Published on {new Date(post.date).toLocaleDateString()} by {post.author.name}
                    </p>
                </header>

                <div className="prose prose-slate max-w-none lg:prose-lg">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {post.intro}
                    </ReactMarkdown>

                    {post.products.length > 0 && (
                        <>
                            <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-center">Top Products Review</h2>
                            {post.products.map((product, index) => (
                                <ProductSection key={index} product={product} index={index + 1} />
                            ))}
                        </>
                    )}

                    {post.conclusion && (
                         <>
                            <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-6 border-t pt-8">결론</h2>
                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                {post.conclusion}
                            </ReactMarkdown>
                        </>
                    )}
                </div>


                {post.faq.length > 0 && <FaqSection faqItems={post.faq} />}

                <AuthorBox author={post.author} />
            </article>
            
             <div className="max-w-5xl mx-auto mt-12">
                <RelatedPosts currentPost={post} />
            </div>
        </main>
    </>
  );
};

export default PostPage;

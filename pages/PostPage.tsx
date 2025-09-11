import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPostBySlug } from '../services/postService';
import { parseMarkdownToHTML } from '../services/markdownParser';
import { Post } from '../types';
import SeoManager from '../components/SeoManager';
import AuthorBox from '../components/AuthorBox';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedPosts from '../components/RelatedPosts';
import RelatedContent from '../components/RelatedContent';
import NotFoundPage from './NotFoundPage';

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      getPostBySlug(slug).then(fetchedPost => {
        setPost(fetchedPost);
        setLoading(false);
      });
    } else {
        setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return <div>Loading post...</div>;
  }

  if (post === undefined || post === null) {
    return <NotFoundPage />;
  }

  const htmlContent = parseMarkdownToHTML(post.content);

  return (
    <article>
      <SeoManager title={post.title} description={post.excerpt} />
      <Breadcrumbs postTitle={post.title} />
      
      {post.imageUrl && <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }} />}
      
      <h1>{post.title}</h1>
      <p style={{ color: '#666' }}>
        By {post.author} on {new Date(post.publishDate).toLocaleDateString()}
      </p>
      
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />

      <AuthorBox authorName={post.author} />

      <RelatedPosts currentPost={post} />
      
      <RelatedContent post={post} />
      
    </article>
  );
};

export default PostPage;

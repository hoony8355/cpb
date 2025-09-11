import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostBySlug } from '../services/postService';
import { Post } from '../types';
import NotFoundPage from './NotFoundPage';
import { parseMarkdown } from '../services/markdownParser';
import SeoManager from '../components/SeoManager';
import AuthorBox from '../components/AuthorBox';
import RelatedPosts from '../components/RelatedPosts';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedContent from '../components/RelatedContent';

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null | undefined>(undefined);

  useEffect(() => {
    if (slug) {
      setPost(undefined); // Reset on slug change
      getPostBySlug(slug).then(setPost);
    }
  }, [slug]);

  if (post === undefined) {
    return <div style={styles.container}>Loading...</div>;
  }

  if (post === null) {
    return <NotFoundPage />;
  }

  const htmlContent = parseMarkdown(post.content);

  return (
    <div style={styles.container}>
      <SeoManager title={post.title} description={post.excerpt} />
      <Breadcrumbs postTitle={post.title} />
      <article>
        <header>
          <h1 style={styles.title}>{post.title}</h1>
          <p style={styles.meta}>
            Published on {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} by {post.author}
          </p>
        </header>
        {post.imageUrl && <img src={post.imageUrl} alt={post.title} style={styles.image} />}
        <div style={styles.content} dangerouslySetInnerHTML={{ __html: htmlContent }} />
        <hr style={styles.hr} />
        <AuthorBox authorName={post.author} />
        <RelatedContent postContent={post.content} />
        <RelatedPosts currentPostSlug={post.slug} tags={post.tags} />
      </article>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 1rem',
    },
    title: {
        fontSize: '3rem',
        marginBottom: '0.5rem',
    },
    meta: {
        color: '#666',
        fontSize: '1rem',
        marginBottom: '2rem',
    },
    image: {
        width: '100%',
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '8px',
        marginBottom: '2rem',
    },
    content: {
        lineHeight: '1.7',
        fontSize: '1.1rem',
    },
    hr: {
        border: 0,
        borderTop: '1px solid #eaeaea',
        margin: '3rem 0',
    }
};

export default PostPage;

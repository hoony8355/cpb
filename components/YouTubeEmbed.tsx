import React from 'react';

interface YouTubeEmbedProps {
  embedId: string;
  title: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ embedId, title }) => (
  <div className="aspect-w-16 aspect-h-9 my-6">
    <iframe
      src={`https://www.youtube.com/embed/${embedId}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title={title}
      className="w-full h-full rounded-lg shadow-md"
    />
  </div>
);

export default YouTubeEmbed;

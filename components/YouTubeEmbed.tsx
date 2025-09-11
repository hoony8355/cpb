import React from 'react';

interface YouTubeEmbedProps {
  embedId: string;
  title: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ embedId, title }) => {
  return (
    <div className="relative overflow-hidden my-8" style={{ paddingBottom: '56.25%' /* 16:9 Aspect Ratio */ }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${embedId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title || "Embedded YouTube video"}
      />
    </div>
  );
};

export default YouTubeEmbed;

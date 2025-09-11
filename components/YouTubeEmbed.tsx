import React from 'react';

interface YouTubeEmbedProps {
  embedId: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ embedId }) => (
  <div style={styles.videoResponsive}>
    <iframe
      width="853"
      height="480"
      src={`https://www.youtube.com/embed/${embedId}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded YouTube Video"
    />
  </div>
);

const styles = {
    videoResponsive: {
        overflow: 'hidden',
        paddingBottom: '56.25%',
        position: 'relative' as 'relative',
        height: 0,
    },
};

export default YouTubeEmbed;

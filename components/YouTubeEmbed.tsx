import React from 'react';

interface YouTubeEmbedProps {
    videoId: string;
    title: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId, title }) => {
    return (
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', background: '#000', margin: '20px 0' }}>
            <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={title || "YouTube video player"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            ></iframe>
        </div>
    );
};

export default YouTubeEmbed;

import React from 'react';

interface YouTubeEmbedProps {
    embedId: string;
    title: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ embedId, title }) => {
    return (
        <div className="video-responsive" style={{ overflow: 'hidden', paddingBottom: '56.25%', position: 'relative', height: 0 }}>
            <iframe
                style={{ left: 0, top: 0, height: '100%', width: '100%', position: 'absolute' }}
                src={`https://www.youtube.com/embed/${embedId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={title}
            />
        </div>
    );
};

export default YouTubeEmbed;

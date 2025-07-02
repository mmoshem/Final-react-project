import React, { useState, useEffect } from 'react';
import './MediaGallery.css';

const MediaGallery = ({ media, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));
  };

  const currentMedia = media[currentIndex];

  return (
    <div className="media-gallery">
      <div className="gallery-header">
        <span className="media-counter">
          {currentIndex + 1} / {media.length}
        </span>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="gallery-content">
        {media.length > 1 && (
          <button 
            className="nav-btn prev-btn" 
            onClick={goToPrevious}
            aria-label="Previous media"
          >
            ←
          </button>
        )}

        <div className="media-container">
          {currentMedia.type === 'image' ? (
            <img 
              src={currentMedia.url} 
              alt={`Media ${currentIndex + 1}`}
              className="gallery-media"
            />
          ) : (
            <video 
              src={currentMedia.url}
              className="gallery-media"
              controls
              autoPlay
            />
          )}
        </div>

        {media.length > 1 && (
          <button 
            className="nav-btn next-btn" 
            onClick={goToNext}
            aria-label="Next media"
          >
            →
          </button>
        )}
      </div>

      {media.length > 1 && (
        <div className="gallery-thumbnails">
          {media.map((item, index) => (
            <div 
              key={index}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            >
              {item.type === 'image' ? (
                <img src={item.url} alt={`Thumbnail ${index + 1}`} />
              ) : (
                <video src={item.url} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaGallery;

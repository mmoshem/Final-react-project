import React, { useState, useRef } from 'react';
import './GroupImageUpload.css';

function GroupImageUpload({ imagePreview, onImageUpload }) {
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);
    const containerRef = useRef(null);

    const handleImageUpload = (e) => {
        onImageUpload(e);
        // Reset position when new image is uploaded
        setImagePosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - imagePosition.x,
            y: e.clientY - imagePosition.y
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        // Get container bounds to limit dragging
        const container = containerRef.current;
        if (container) {
            const containerRect = container.getBoundingClientRect();
            const maxX = containerRect.width - 200; // 200px is image width
            const maxY = containerRect.height - 200; // 200px is image height
            
            setImagePosition({
                x: Math.max(-100, Math.min(maxX, newX)), // Allow some negative positioning
                y: Math.max(-100, Math.min(maxY, newY))
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Add event listeners to document for mouse move/up
    React.useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStart]);

    return (
        <div className="form-section">
            <label className="form-label">Group Image (Optional)</label>
            <div className="image-upload-container">
                <input
                    type="file"
                    id="group-image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="image-input"
                />
                
                <div 
                    className="image-upload-area"
                    ref={containerRef}
                >
                    {imagePreview ? (
                        <div className="draggable-image-container">
                            <img 
                                ref={imageRef}
                                src={imagePreview} 
                                alt="Preview" 
                                className={`image-preview ${isDragging ? 'dragging' : ''}`}
                                style={{
                                    transform: `translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                                    cursor: isDragging ? 'grabbing' : 'grab'
                                }}
                                onMouseDown={handleMouseDown}
                                draggable={false} // Prevent browser default drag
                            />
                            <div className="drag-hint">
                                {isDragging ? 'Release to position' : 'Drag to reposition'}
                            </div>
                        </div>
                    ) : (
                        <label htmlFor="group-image" className="upload-placeholder">
                            <span className="upload-icon">📷</span>
                            <span>Click to upload group image</span>
                        </label>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GroupImageUpload;
// ItemList.js
import React, { useState, useRef, useEffect } from 'react';
import './ItemList.css';
import axios from 'axios';
import Modal from './Modal';
import MediaGallery from './MediaGallery';

const ItemList = ({ items, refreshPosts}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [imageClicked, setImageClicked] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const commentsRef = useRef(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryMedia, setGalleryMedia] = useState([]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const currentUserId = localStorage.getItem('userId')

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (commentsRef.current && !commentsRef.current.contains(event.target)) {
        setSelectedIndex(null);
      }
    };

    if (selectedIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedIndex]);

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setImageClicked(true);
  };

  const handleCloseModal = () => {
    setImageClicked(false);
    setSelectedImageUrl('');
  };

  if (!Array.isArray(items) || items.length === 0) {
    return <div className="list-container">No posts available.</div>;
  }

   const handleDelete = async (postId) => {
    if(!window.confirm("you sure you want to delete this post?")) return;
    try{
      const response = await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        data: { userId: currentUserId }
      });
      
      if(response.status === 200){
        refreshPosts();
      }
      else{
        alert(response.data.message || "faild to delete the post")
      }
    }
    catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again later.');
    }
   }
  return (
    <>
      <div className="list-container">
        {items.map((item, index) => {
          // Quick fix: flatten mediaUrls if it's an array of arrays
          let flatMediaUrls = Array.isArray(item.mediaUrls) && Array.isArray(item.mediaUrls[0])
            ? item.mediaUrls[0]
            : item.mediaUrls;

          return (
            <div
              key={index}
              className="list-item"
              onClick={() => setSelectedIndex(item._id)}
              style={{ position: 'relative' }}
            >  
            
            {item.userId === currentUserId && (
                <button onClick={() => handleDelete(item._id)}>
                  Delete
                </button>
              )}
              <img
                src={
                  item.profilePicture?.trim()
                    ? item.profilePicture
                    : 'https://www.w3schools.com/howto/img_avatar.png'
                }
                alt="Profile"
                className="profile-picture"
              />

              <div className="item-content">
                <div className="user-name">
                  {item.first_name || ''} {item.last_name || ''}
                </div>

                {item.createdAt && (
                  <div className="post-date">
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                )}
               
                <div className="post-content">
                  {item.content?.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                 {Array.isArray(flatMediaUrls) && flatMediaUrls.length > 0 && (
                <div className="media-thumbnails-row">
                  {flatMediaUrls.map((media, idx) => {
                    const mediaUrl = typeof media === 'string' ? media : media.url;
                    const isImage = typeof mediaUrl === 'string' && mediaUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                    return (
                      <div
                        key={idx}
                        className="media-thumb"
                        onClick={e => {
                          e.stopPropagation();
                          setGalleryMedia(flatMediaUrls.map(m => {
                            const mUrl = typeof m === 'string' ? m : m.url;
                            return {
                              url: mUrl,
                              type: typeof m === 'object' && m.type ? m.type : (typeof mUrl === 'string' && mUrl.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image')
                            };
                          }));
                          setGalleryIndex(idx);
                          setGalleryOpen(true);
                        }}
                      >
                        {isImage ? (
                          <img src={mediaUrl} alt="media" />
                        ) : (
                          <video src={mediaUrl} />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {item.imageUrl && !item.mediaUrls && (
                <img 
                  src={item.imageUrl} 
                  alt="Post" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageUrl(item.imageUrl);
                    setImageClicked(true);
                  }} 
                  className="post-image" 
                  style={{ cursor: 'pointer' }}
                />
              )}
                <div className="post-likes">
                  {item.likes > 0
                    ? `Likes: ${item.likes}`
                    : 'No likes yet'}
                </div>
              </div>
              
              {selectedIndex === index && (
                <div className="inline-comments-panel" ref={commentsRef}>
                  <h3>Comments</h3>
                  <p>Comments coming soon for this post!</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {imageClicked && (
        <Modal onClose={handleCloseModal}>
          <img 
            src={selectedImageUrl} 
            alt="Post" 
            className="modal-image"
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }}
          />
        </Modal>
      )}

      {galleryOpen && (
        <MediaGallery
          media={galleryMedia}
          initialIndex={galleryIndex}
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </>
  );
};

export default ItemList;

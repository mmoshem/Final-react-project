// ItemList.js
import React, { useState, useRef } from 'react';
import './ItemList.css';
import axios from 'axios';
import Modal from './Modal';
import MediaGallery from './MediaGallery';
import PostItem from './PostItem';

const ItemList = ({ items, refreshPosts }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [imageClicked, setImageClicked] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const commentsRef = useRef(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryMedia, setGalleryMedia] = useState([]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const currentUserId = localStorage.getItem('userId');


  const handleCloseModal = () => {
    setImageClicked(false);
    setSelectedImageUrl('');
  };

  const handleDelete = async (postId,urls) => {
    if (!window.confirm('you sure you want to delete this post?')) return;
    try {
      const response = await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        data: { userId: currentUserId,mediaUrls:urls },
        
      });
      if (response.status === 200) {
        refreshPosts();
      } else {
        alert(response.data.message || 'faild to delete the post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again later.');
    }
  };

  const handleMediaThumbClick = (mediaArray, idx) => {
    setGalleryMedia(
      mediaArray.map((m) => {
        const mUrl = typeof m === 'string' ? m : m.url;
        return {
          url: mUrl,
          type:
            typeof m === 'object' && m.type
              ? m.type
              : typeof mUrl === 'string' && mUrl.match(/\.(mp4|webm|ogg)$/i)
              ? 'video'
              : 'image',
        };
      })
    );
    setGalleryIndex(idx);
    setGalleryOpen(true);
  };

  if (!Array.isArray(items) || items.length === 0) {
    return <div className="list-container">No posts available.</div>;
  }

  return (
    <>
      <div className="list-container">
        {items.map((item) => (
          <PostItem
            key={item._id}
            item={item}
            currentUserId={currentUserId}
            onDelete={handleDelete}
            onMediaThumbClick={handleMediaThumbClick}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            commentsRef={commentsRef}
          />
        ))}
      </div>
      {/* {imageClicked && (
        <Modal onClose={handleCloseModal}>
          <img
            src={selectedImageUrl}
            alt="Post"
            className="modal-image"
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }}
          />
        </Modal>
      )} */}
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

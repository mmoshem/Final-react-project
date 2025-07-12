// components/profile/PostsSection.js
import React from "react";
import "./PostsSection.css";

export default function PostsSection() {
  return (
    <div className="no-posts-box">
      <div className="no-posts-icon">💬</div>
      <h3>No posts yet</h3>
      <p>Share your first professional insight!</p>
    </div>
  );
}

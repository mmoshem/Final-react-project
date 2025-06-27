import React ,{useState} from 'react';
import './PostDummy.css';
import Post from './Post'; // Import the Post component

export default function PostDummy({ setPostDummyClicked }) {
    
    const handleClick = () => {
        setPostDummyClicked(true);
    };

    return (
        <div className="post-frame">
           
          
                <input
                    className="search-bar-input"
                    placeholder="What's on your mind?"
                    readOnly = {true}
                    onClick={handleClick}
                />
    
            
        </div>
    );
}
import './Post.css';
export default function PostButtons({ onPost, onUpload }) {
    return (
        <div style={{ display: 'flex', gap: '10px' }}>
            <button className="post-button" onClick={onPost}>
                Post
            </button>
            <button className="post-button" onClick={onUpload}>
                upload
            </button>
        </div>
    );
}
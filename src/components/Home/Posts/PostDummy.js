import './PostDummy.css';


export default function PostDummy({ setPostDummyClicked }) {
    
    const handleClick = () => {
        setPostDummyClicked(true);
    };

    return (
        <div className="post-frame">
           
            <img
                className="profile-icon"
                src="https://www.w3schools.com/howto/img_avatar.png"
                alt="Profile"
            />
                <input
                    className="search-bar-input"
                    placeholder="What's on your mind?"
                    readOnly = {true}
                    onClick={handleClick}
                />
    
            
        </div>
    );
}
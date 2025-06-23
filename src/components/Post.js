export default function Post() {
  

    const postToMongo = async (postContent) => {
        try {
            axios.post('http://localhost:5000/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: postContent }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Post successful:', data);
        }
        catch (error) {
            console.error('Error posting to MongoDB:', error);
            alert('Failed to post. Please try again later.');
        }
    

    const handlePost = () => {
        const postContent = document.querySelector('.post-input').value;
        if (postContent.trim() === '') {
            alert('Post content cannot be empty');
            return;
        }
        
        postToMongo(postContent)


        console.log('Post submitted:', postContent);
        document.querySelector('.post-input').value = ''; // Clear input after posting


    }
    return (

    <div>
      <input
        type="text"
        placeholder="What's on your mind?"
        className="post-input"
        />
      <button className="post-button" onClick={handlePost}>Post</button>
    </div>
  );
}

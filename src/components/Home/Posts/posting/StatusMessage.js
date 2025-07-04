export default function StatusMessage({ success }) {
    if (!success) return null;
    
    return (
        <div className="post-success">Post submitted!</div>
    );
}

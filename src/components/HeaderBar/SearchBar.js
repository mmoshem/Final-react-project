import  {useEffect,useState} from "react";
import axios from "axios";
function SearchBar() {

    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
   // search functionality
    useEffect(()=>{
        if(searchText.trim()===''){ 
            setSearchResults([]);
            return;
        }
        const searchTimeout = setTimeout(()=>{
            setSearchLoading(true);
            axios.get(`http://localhost:5000/api/users/search?q=${searchText}`)
            .then(res =>{setSearchResults(res.data);})
            .catch(err=>{console.error('Search error:', err);setSearchResults([]);})
            .finally(()=>{setSearchLoading(false);})
        },300)

        return ()=>clearTimeout(searchTimeout);
    },[searchText])

    // const handleSearchChange = (text)=>{
    //     setSearchText(text);
    // }
  return (
  <div>
    <div className="search-bar">
      <input 
        type="text"
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search here :)" 
      />
    </div>

    {searchText && (
      <div className="search-results" >
        {searchLoading ? (
          <div style={{ padding: '10px', textAlign: 'center' }}>Searching...</div>
        ) : searchResults.length > 0 ? (
          searchResults.map(user => (
            <div key={user._id} style={{ 
              padding: '10px', 
              borderBottom: '1px solid #eee',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              {user.profilePicture && (
                <img 
                  src={user.profilePicture} 
                  alt="Profile" 
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }} 
                />
              )}
              <div>
                <div style={{ fontWeight: 'bold' }}>
                  {user.first_name} {user.last_name}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {user.email}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '10px', textAlign: 'center', color: '#666' }}>
            No users found
          </div>
        )}
      </div>
    )}
  </div>
);
}
export default SearchBar;

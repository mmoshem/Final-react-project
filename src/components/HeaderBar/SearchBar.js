import  {useEffect,useState, useRef} from "react";
import axios from "axios";
import './SearchBar.css';
function SearchBar() {
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const searchRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

    return (
      <div className="searchbar-dropdown" ref={searchRef}>
        <div className="search-bar-input-wrapper">
          <div className="search-bar-icon"></div> 
          <input 
            type="text"
            value={searchText}
            onFocus={() => setDropdownOpen(true)}
            onChange={(e) => {
              setSearchText(e.target.value);
              setDropdownOpen(true);
            }}
            placeholder="Search here" 
            className="search-bar-input"
          />
          {/* Optionally add a search icon here */}
        </div>
        {dropdownOpen && searchText && (
          <div className="searchbar-dropdown-content">
            {searchLoading ? (
              <div className="searchbar-dropdown-loading">Searching...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map(user => (
                <div key={user._id} className="searchbar-dropdown-item">
                  {user.profilePicture && (
                    <img 
                      src={user.profilePicture} 
                      alt="Profile" 
                      className="searchbar-dropdown-avatar"
                    />
                  )}
                  <div>
                    <div className="searchbar-dropdown-name">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="searchbar-dropdown-email">
                      {user.email}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="searchbar-dropdown-empty">
                No users found
              </div>
            )}
          </div>
        )}
      </div>
    );
}
export default SearchBar;

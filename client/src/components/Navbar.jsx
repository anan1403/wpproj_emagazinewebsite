import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, X } from 'lucide-react';
import { magazineService } from '../services/api';
import './Navbar.css';

const Navbar = ({ isAuthenticated, onProfileClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          const res = await magazineService.search(searchQuery);
          setSearchResults(res.data);
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleResultClick = (id) => {
    setSearchResults([]);
    setSearchQuery('');
    navigate(`/magazine/${id}`);
  };

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            Mag<span className="brand-highlight">Z</span>ter
          </Link>
        </div>

        <div className="navbar-center" ref={searchRef}>
          <form onSubmit={handleSearch} className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search magazines..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')} 
                style={{ position: 'absolute', right: '1rem', color: 'var(--color-text-muted)' }}
              >
                <X size={16} />
              </button>
            )}
          </form>
          
          {/* Search Dropdown */}
          {searchResults.length > 0 && (
            <div className="search-dropdown glass-panel">
              {searchResults.map(mag => (
                <div 
                  key={mag._id} 
                  className="search-result-item" 
                  onMouseDown={() => handleResultClick(mag._id)}
                >
                  <img src={mag.coverImage || '/placeholder.jpg'} alt={mag.title} className="search-result-img" />
                  <div>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>{mag.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>{mag.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="navbar-right">
          {isAuthenticated ? (
            <button className="profile-btn" onClick={onProfileClick} aria-label="Profile">
              <User size={24} />
            </button>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-text">Log In</Link>
              <Link to="/signup" className="btn-primary-small">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import { Link, useNavigate } from 'react-router-dom';
import { User, Heart, History, Bookmark, Settings, LogOut, BookOpen, X } from 'lucide-react';
import './SidePanel.css';

const SidePanel = ({ isOpen, onClose, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    onClose();
    navigate('/login');
  };

  return (
    <>
      <div 
        className={`side-panel-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      />
      <div className={`side-panel glass-panel ${isOpen ? 'open' : ''}`}>
        <div className="panel-header">
          <h2>Menu</h2>
          <button onClick={onClose} className="close-btn" aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        <div className="panel-content">
          <nav className="panel-nav">
            <Link to="/profile" className="nav-item" onClick={onClose}>
              <User size={20} />
              <span>Profile</span>
            </Link>
            <Link to="/subscriptions" className="nav-item" onClick={onClose}>
              <BookOpen size={20} />
              <span>Subscriptions</span>
            </Link>
            <Link to="/liked" className="nav-item" onClick={onClose}>
              <Heart size={20} />
              <span>Liked Articles</span>
            </Link>
            <Link to="/history" className="nav-item" onClick={onClose}>
              <History size={20} />
              <span>History</span>
            </Link>
            <Link to="/bookmarks" className="nav-item" onClick={onClose}>
              <Bookmark size={20} />
              <span>Bookmarks</span>
            </Link>
            {/* Kept Settings generic or for Admin mapping */}
            <Link to="/admin" className="nav-item" onClick={onClose}>
              <Settings size={20} />
              <span>Admin Dashboard</span>
            </Link>
          </nav>

          <div className="panel-footer">
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={20} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidePanel;

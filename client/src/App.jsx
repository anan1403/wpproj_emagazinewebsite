import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import SidePanel from './components/SidePanel';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Magazine from './pages/Magazine';
import Category from './pages/Category';
import Article from './pages/Article';
import Subscriptions from './pages/Subscriptions';
import Liked from './pages/Liked';
import History from './pages/History';
import Bookmarks from './pages/Bookmarks';
import Admin from './pages/Admin';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check auth status
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Don't show navbar and sidepanel on specific pages
  const hideNavigation = ['/login', '/signup', '/forgot-password'].includes(location.pathname);

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  return (
    <div className="app-container">
      {!hideNavigation && (
        <>
          <Navbar 
            isAuthenticated={isAuthenticated} 
            onProfileClick={toggleSidePanel} 
          />
          <SidePanel 
            isOpen={isSidePanelOpen} 
            onClose={() => setIsSidePanelOpen(false)} 
            setIsAuthenticated={setIsAuthenticated}
          />
        </>
      )}

      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/magazine/:id" element={<Magazine />} />
          <Route path="/article/:id" element={<Article />} />
          <Route path="/category/:name" element={<Category />} />
          
          {/* Protected Routes (Simple check) */}
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/subscriptions" element={isAuthenticated ? <Subscriptions /> : <Navigate to="/login" />} />
          <Route path="/liked" element={isAuthenticated ? <Liked /> : <Navigate to="/login" />} />
          <Route path="/history" element={isAuthenticated ? <History /> : <Navigate to="/login" />} />
          <Route path="/bookmarks" element={isAuthenticated ? <Bookmarks /> : <Navigate to="/login" />} />
          <Route path="/admin" element={isAuthenticated ? <Admin /> : <Navigate to="/login" />} />
          
          {/* 404 handler can be added here */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
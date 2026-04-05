import { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { Bookmark } from 'lucide-react';

const Bookmarks = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await userService.getBookmarks();
        setArticles(res.data || []);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUnsave = async (articleId) => {
    try {
      await userService.bookmarkArticle(articleId); // Toggle removes it
      setArticles(prev => prev.filter(a => a._id !== articleId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Bookmark size={36} color="var(--color-primary)" />
        <h1>Bookmarks</h1>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading bookmarks...</div>
      ) : articles.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {articles.map(article => (
            <div key={article._id} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{article.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  By <span style={{ color: 'var(--color-primary)' }}>Author Dashboard</span>
                </p>
              </div>
              <button 
                className="btn-primary" 
                style={{ width: 'auto', padding: '0.5rem 1rem', backgroundColor: '#64748b' }}
                onClick={() => handleUnsave(article._id)}
              >
                Unsave
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state glass-panel">
          <h3>No Bookmarks</h3>
          <p>Save articles you want to read later.</p>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;

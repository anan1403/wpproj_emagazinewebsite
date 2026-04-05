import { useState, useEffect } from 'react';
import { userService, articleService } from '../services/api';
import { Heart } from 'lucide-react';

const Liked = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await userService.getLiked();
        setArticles(res.data || []);
      } catch (error) {
        console.error("Error fetching liked articles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUnlike = async (articleId) => {
    try {
      await articleService.likeArticle(articleId); // It's a toggle backend route
      setArticles(prev => prev.filter(a => a._id !== articleId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Heart size={36} color="#ef4444" />
        <h1>Liked Articles</h1>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading liked articles...</div>
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
                style={{ width: 'auto', padding: '0.5rem 1rem', backgroundColor: '#ef4444' }}
                onClick={() => handleUnlike(article._id)}
              >
                Unlike
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state glass-panel">
          <h3>No Liked Articles</h3>
          <p>You haven't liked any articles yet.</p>
        </div>
      )}
    </div>
  );
};

export default Liked;

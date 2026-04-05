import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, Bookmark, MessageSquare, BookOpen, ChevronRight } from 'lucide-react';
import { magazineService, articleService, userService } from '../services/api';

const Magazine = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [magazine, setMagazine] = useState(null);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likedIds, setLikedIds] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  useEffect(() => {
    const fetchMagazineData = async () => {
      try {
        setIsLoading(true);
        // API Calls
        const [magRes, artRes, profileRes] = await Promise.all([
          magazineService.getById(id),
          articleService.getByMagazine(id),
          userService.getProfile().catch(() => ({ data: null }))
        ]);
        
        setMagazine(magRes.data);
        setArticles(artRes.data);
        
        if (profileRes.data) {
          setIsSubscribed(profileRes.data.subscriptions?.some(sub => sub === id || sub._id === id));
          setLikedIds(profileRes.data.likedArticles?.map(a => a._id || a) || []);
          setBookmarkedIds(profileRes.data.bookmarks?.map(a => a._id || a) || []);
        }
      } catch (error) {
        console.error("Error fetching magazine:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMagazineData();
  }, [id]);

  const handleSubscribe = async () => {
    try {
      await userService.subscribe(id);
      setIsSubscribed(!isSubscribed);
    } catch {
      // Toggle anyway for visual feedback if API fails
      setIsSubscribed(!isSubscribed);
    }
  };

  const interactWithArticle = async (action, articleId) => {
    try {
      if (action === 'Like') {
        await articleService.likeArticle(articleId);
        if (likedIds.includes(articleId)) {
          setLikedIds(likedIds.filter(id => id !== articleId));
        } else {
          setLikedIds([...likedIds, articleId]);
        }
      }
      if (action === 'Bookmark') {
        await userService.bookmarkArticle(articleId);
        if (bookmarkedIds.includes(articleId)) {
          setBookmarkedIds(bookmarkedIds.filter(id => id !== articleId));
        } else {
          setBookmarkedIds([...bookmarkedIds, articleId]);
        }
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action.toLowerCase()}`);
    }
  };

  const handleRead = async (articleId, title) => {
    try {
      await userService.addToHistory(articleId);
      navigate(`/article/${articleId}`);
    } catch (err) {
      console.error(err);
      navigate(`/article/${articleId}`); // Fallback navigate if backend stats fail
    }
  };

  if (isLoading || !magazine) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-primary)' }}>Loading details...</div>;
  }

  return (
    <div className="magazine-detail-page">
      {/* Hero Section */}
      <div style={{ display: 'flex', gap: '3rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
        <div style={{ width: '300px', flexShrink: 0, borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          <img src={magazine.coverImage} alt={magazine.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        
        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ color: 'var(--color-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>
            {magazine.category}
          </span>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', lineHeight: '1.2' }}>
            {magazine.title}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginBottom: '1rem' }}>
            By <span style={{ color: 'var(--color-text-main)', fontWeight: '600' }}>{magazine.createdBy?.username || 'Independent Publisher'}</span>
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem', color: '#cbd5e1' }}>
            {magazine.description}
          </p>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={handleSubscribe}
              style={{
                padding: '1rem 2rem', 
                backgroundColor: isSubscribed ? 'rgba(168, 85, 247, 0.2)' : 'var(--color-bg-elevated)',
                color: isSubscribed ? 'var(--color-primary)' : 'var(--color-text-main)',
                border: `1px solid ${isSubscribed ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
          Articles in this issue
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {articles.map((article) => (
            <div key={article._id} className="glass-panel" style={{ padding: '2rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>{article.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>By {article.author?.username || 'Unknown Author'}</p>
                </div>
              </div>
              
              <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>{article.content ? article.content.substring(0, 150) + '...' : 'Read full article to discover more...'}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button 
                  style={{ color: 'var(--color-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  onClick={() => handleRead(article._id, article.title)}
                >
                  Read Article <ChevronRight size={16} />
                </button>
                
                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-text-muted)' }}>
                  <button 
                    onClick={() => interactWithArticle('Like', article._id)} 
                    style={{ color: likedIds.includes(article._id) ? '#ef4444' : 'inherit', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Heart size={18} fill={likedIds.includes(article._id) ? '#ef4444' : 'none'} /> 
                    <span style={{ fontSize: '0.85rem' }}>{likedIds.includes(article._id) ? 'Liked' : 'Like'}</span>
                  </button>
                  <button 
                    onClick={() => interactWithArticle('Bookmark', article._id)} 
                    style={{ color: bookmarkedIds.includes(article._id) ? 'var(--color-primary)' : 'inherit', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Bookmark size={18} fill={bookmarkedIds.includes(article._id) ? 'var(--color-primary)' : 'none'} /> 
                    <span style={{ fontSize: '0.85rem' }}>{bookmarkedIds.includes(article._id) ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Magazine;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { articleService } from "../services/api";
import { ChevronLeft, FileText } from "lucide-react";

function Article() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        const res = await articleService.getById(id);
        setArticle(res.data);
      } catch (err) {
        console.error("Error loading article", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", color: "var(--color-primary)", fontSize: "1.2rem" }}>
        Loading article text...
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <h2>Article not found</h2>
        <button onClick={() => navigate(-1)} className="btn-primary" style={{ marginTop: "1rem" }}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="article-page" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '2rem', padding: '0' }}
      >
        <ChevronLeft size={20} /> Back to Magazine
      </button>

      <div className="glass-panel" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
        {article.image && (
          <img 
            src={article.image} 
            alt={article.title} 
            style={{ width: '100%', height: '350px', objectFit: 'cover' }} 
          />
        )}
        
        <div style={{ padding: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: '600', marginBottom: '1rem' }}>
            <FileText size={18} /> Article Reading View
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '1.5rem' }}>
            {article.title}
          </h1>
          
          <div style={{ color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>By {article.author?.username || 'Guest Author'}</span>
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>

          <div 
            style={{ 
              fontSize: '1.15rem', 
              lineHeight: '1.8', 
              color: '#d1d5db',
              whiteSpace: 'pre-wrap'
            }}
          >
            {article.content}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Article;
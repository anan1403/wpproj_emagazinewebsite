import { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { History as HistoryIcon } from 'lucide-react';
import MagazineCard from '../components/MagazineCard';

const History = () => {
  const [magazines, setMagazines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await userService.getHistory();
        setMagazines(res.data || []);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (articleId) => {
    try {
      await userService.removeFromHistory(articleId);
      setMagazines(prev => prev.filter(m => m._id !== articleId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <HistoryIcon size={36} color="var(--color-primary)" />
        <h1>Reading History</h1>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading history...</div>
      ) : magazines.length > 0 ? (
        <div className="grid-container">
          {magazines.map(mag => (
            <div key={mag._id} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '0.75rem', position: 'relative' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{mag.title}</h3>
              <p style={{ color: 'var(--color-primary)', fontSize: '0.9rem' }}>Article Read</p>
              <button 
                onClick={() => handleDelete(mag._id)}
                style={{
                  position: 'absolute', top: '15px', right: '15px',
                  backgroundColor: 'transparent', color: '#ef4444',
                  border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600'
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state glass-panel">
          <h3>No Reading History</h3>
          <p>You haven't read any magazines recently.</p>
        </div>
      )}
    </div>
  );
};

export default History;

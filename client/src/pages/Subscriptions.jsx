import { useState, useEffect } from 'react';
import MagazineCard from '../components/MagazineCard';
import { userService } from '../services/api';
import { BookOpen } from 'lucide-react';

const Subscriptions = () => {
  const [magazines, setMagazines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await userService.getSubscriptions();
        setMagazines(res.data || []);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUnsubscribe = async (magId) => {
    try {
      await userService.subscribe(magId); // Backend toggle removes it
      setMagazines(prev => prev.filter(m => m._id !== magId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <BookOpen size={36} color="var(--color-primary)" />
        <h1>My Subscriptions</h1>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading subscriptions...</div>
      ) : magazines.length > 0 ? (
        <div className="grid-container">
          {magazines.map(mag => (
            <div key={mag._id} style={{ position: 'relative' }}>
              <MagazineCard magazine={mag} />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnsubscribe(mag._id);
                }}
                style={{
                  position: 'absolute', top: '10px', right: '10px', zIndex: 10,
                  backgroundColor: 'rgba(239, 68, 68, 0.9)', color: 'white',
                  border: 'none', borderRadius: '0.25rem', padding: '0.5rem',
                  cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold'
                }}
              >
                Unsubscribe
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state glass-panel">
          <h3>No Subscriptions</h3>
          <p>You haven't subscribed to any magazines yet. Explore our collection!</p>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
import { useState, useEffect } from 'react';
import Carousel from '../components/Carousel';
import MagazineCard from '../components/MagazineCard';
import { magazineService } from '../services/api';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [trending, setTrending] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        setIsLoading(true);
        // We do Promise.all to fetch them in parallel, 
        // with mock fallbacks in case API fails (since backend is unknown state)
        const [featuredRes, latestRes, trendingRes] = await Promise.all([
          magazineService.getFeatured(),
          magazineService.getAll({ sort: '-createdAt', limit: 8 }),
          magazineService.getTrending()
        ]);

        setFeatured(featuredRes.data || []);
        setLatest(latestRes.data?.magazines || latestRes.data || []);
        setTrending(trendingRes.data || []);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMagazines();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ color: 'var(--color-primary)', fontSize: '1.5rem' }}>Loading magazines...</div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <Carousel items={featured} />

      <section className="category-highlights" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          {['Technology', 'Business', 'Fashion', 'Lifestyle', 'Sports', 'Science'].map(cat => (
            <Link 
              key={cat} 
              to={`/category/${cat}`}
              style={{
                flexShrink: 0,
                padding: '0.75rem 2rem',
                backgroundColor: 'var(--color-bg-elevated)',
                borderRadius: '2rem',
                border: '1px solid var(--color-border)',
                fontWeight: '600',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-primary)';
                e.target.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--color-bg-elevated)';
                e.target.style.color = 'var(--color-text-main)';
              }}
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      <section className="magazine-section" style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Trending Now</h2>
          <Link to="/category/trending" style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.9rem' }}>
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid-container">
          {trending.map(mag => (
            <MagazineCard key={mag._id} magazine={mag} />
          ))}
        </div>
      </section>

      <section className="magazine-section" style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Latest Arrivals</h2>
          <Link to="/category/latest" style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.9rem' }}>
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid-container">
          {latest.map(mag => (
            <MagazineCard key={mag._id} magazine={mag} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
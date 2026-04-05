import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MagazineCard from '../components/MagazineCard';
import { magazineService } from '../services/api';

const Category = () => {
  const { name } = useParams();
  const [magazines, setMagazines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        const res = await magazineService.getAll({ category: name });
        setMagazines(res.data.magazines || res.data || []);
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [name]);

  return (
    <div className="category-page">
      <div className="page-header">
        <h1 style={{ textTransform: 'capitalize' }}>{name} Magazines</h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
          Explore our collection of the best {name.toLowerCase()} publications.
        </p>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading magazines...</div>
      ) : magazines.length > 0 ? (
        <div className="grid-container">
          {magazines.map(mag => (
            <MagazineCard key={mag._id} magazine={mag} />
          ))}
        </div>
      ) : (
        <div className="empty-state glass-panel">
          <h3>No magazines found</h3>
          <p>We couldn't find any magazines in this category.</p>
        </div>
      )}
    </div>
  );
};

export default Category;

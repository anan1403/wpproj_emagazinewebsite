import { useNavigate } from 'react-router-dom';
import './MagazineCard.css';

const MagazineCard = ({ magazine }) => {
  const navigate = useNavigate();

  if (!magazine) return null;

  return (
    <div className="magazine-card" onClick={() => navigate(`/magazine/${magazine._id}`)}>
      <div className="card-image-container">
        <img 
          src={magazine.coverImage || '/placeholder.jpg'} 
          alt={magazine.title} 
          className="card-image"
          loading="lazy"
        />
        <div className="card-overlay">
          <span className="read-text">Read Now</span>
        </div>
      </div>
      <div className="card-content">
        {magazine.category && <span className="card-category">{magazine.category}</span>}
        <h3 className="card-title">{magazine.title}</h3>
        <p className="card-publisher">{magazine.publisher || 'Unknown Publisher'}</p>
      </div>
    </div>
  );
};

export default MagazineCard;
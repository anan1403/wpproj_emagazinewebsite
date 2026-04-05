import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Carousel.css';

const Carousel = ({ items = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length <= 1) return;
    
    // Auto-slide every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [items.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (!items || items.length === 0) {
    return <div className="carousel-empty glass-panel">No featured magazines currently.</div>;
  }

  return (
    <div className="carousel">
      <div 
        className="carousel-inner"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div 
            key={item._id || index} 
            className="carousel-item"
            onClick={() => navigate(`/magazine/${item._id}`)}
          >
            {/* Background Image with blur for aesthetic */}
            <div 
              className="carousel-bg" 
              style={{ backgroundImage: `url(${item.coverImage || '/placeholder.jpg'})` }}
            />
            <div className="carousel-overlay" />
            
            <div className="carousel-content">
              <div className="carousel-image-container">
                <img src={item.coverImage || '/placeholder.jpg'} alt={item.title} className="carousel-image" />
              </div>
              <div className="carousel-info">
                <span className="carousel-category">{item.category || 'Featured'}</span>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <button className="read-btn">Read Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <>
          <button className="carousel-control prev" onClick={goToPrev} aria-label="Previous slide">
            <ChevronLeft size={24} />
          </button>
          <button className="carousel-control next" onClick={goToNext} aria-label="Next slide">
            <ChevronRight size={24} />
          </button>
          
          <div className="carousel-indicators">
            {items.map((_, index) => (
              <button 
                key={index} 
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel;
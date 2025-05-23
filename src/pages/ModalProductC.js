import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faShoppingCart, 
  faHeart, 
  faMinus, 
  faPlus,
  faShareAlt,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import './Styles/ProductModalC.css';

const ProductModal = ({ selectedProduct, closeModal, addToCart, isDarkMode }) => {
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  
  const allImages = [
    selectedProduct.primaryImage,
    ...(selectedProduct.secondaryImages || [])
  ];

  const navigateImage = (direction) => {
    if (direction === 'prev') {
      setCurrentImageIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
    } else {
      setCurrentImageIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...selectedProduct, quantity });
    closeModal();
  };

  return (
    <div className={`product-modal-overlay ${isDarkMode ? 'dark-mode' : ''}`} onClick={closeModal}>
      <div className="product-modal" onClick={e => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={closeModal} aria-label="Fermer">
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        <div className="modal-content">
          {/* Galerie d'images */}
          <div className="modal-images">
            <div className="main-image-container">
              <img 
                src={`data:image/jpeg;base64,${allImages[currentImageIndex]}`} 
                alt={selectedProduct.name} 
                className="main-image"
                loading="lazy"
              />
              
              {allImages.length > 1 && (
                <>
                  <button 
                    className="nav-arrow prev-arrow"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage('prev');
                    }}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <button 
                    className="nav-arrow next-arrow"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage('next');
                    }}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </>
              )}
            </div>
            
            {allImages.length > 1 && (
              <div className="thumbnail-container">
                {allImages.map((img, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                  >
                    <img 
                      src={`data:image/jpeg;base64,${img}`} 
                      alt={`Vue ${index + 1} de ${selectedProduct.name}`}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Détails du produit */}
          <div className="modal-details">
            <div className="product-header">
              <h2>{selectedProduct.name}</h2>
              <button 
                className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                onClick={() => setIsFavorite(!isFavorite)}
                aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <FontAwesomeIcon icon={faHeart} />
              </button>
            </div>
            
            <p className="brand">{selectedProduct.brand || 'Marque inconnue'}</p>
            <p className="sku">Réf: {selectedProduct.sku || 'N/A'}</p>
            
            <div className="price-section">
             {selectedProduct.discountedPrice ? (
  <>
    <span className="discounted-price">{selectedProduct.discountedPrice} dt</span>
    <span className="original-price">{selectedProduct.price} dt</span>
    <span className="discount-badge">
      -{Math.round((1 - selectedProduct.discountedPrice / selectedProduct.price) * 100)}%
    </span>
  </>
) : (
  <span className="price">{selectedProduct.price} dt</span>
)}
            </div>
            
            <div className="product-meta">
              <span className="category">{selectedProduct.category || 'Non catégorisé'}</span>
              <div className="stock-info">
                {selectedProduct.stock > 0 ? (
                  <span className="in-stock">
                    <span className="stock-dot available"></span>
                    En stock ({selectedProduct.stock} disponible{selectedProduct.stock > 1 ? 's' : ''})
                  </span>
                ) : (
                  <span className="out-of-stock">
                    <span className="stock-dot unavailable"></span>
                    Rupture de stock
                  </span>
                )}
              </div>
            </div>
            
            <div className="description-section">
              <h3>Description</h3>
              <p>{selectedProduct.description || 'Aucune description disponible pour ce produit.'}</p>
            </div>
            
            {selectedProduct.variants?.length > 0 && (
              <div className="variants-section">
                <h3>Options disponibles</h3>
                <div className="variant-options">
                  {selectedProduct.variants.map((variant, index) => (
                    <button key={index} className="variant-btn">
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="action-buttons">
              
              
              <button 
                className="add-to-cart-btn primary-btn"
                onClick={handleAddToCart}
                disabled={selectedProduct.stock <= 0}
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                Ajouter au panier
              </button>
            </div>
            
            <div className="secondary-actions">
              <button className="share-btn">
                <FontAwesomeIcon icon={faShareAlt} />
                Partager
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
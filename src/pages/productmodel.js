import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './Styles/ProductModal.css';

const ProductModal = ({ selectedProduct, closeModal, handleEdit, handleDelete, isDarkMode }) => {
  return (
    <div className={`modal-overlay ${isDarkMode ? 'dark-mode' : 'light-mode'}`} onClick={closeModal}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()}
      >
        <button className="close-modal" onClick={closeModal} aria-label="Fermer">
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="modal-header">
          <h2>{selectedProduct.name}</h2>
          <span className="product-brand">{selectedProduct.brand || 'Marque non spécifiée'}</span>
        </div>

        <div className="product-images">
          <div className="main-image">
            <img 
              src={`data:image/jpeg;base64,${selectedProduct.primaryImage}`} 
              alt={selectedProduct.name}
              loading="lazy"
            />
          </div>
          
          {selectedProduct.secondaryImages?.length > 0 && (
            <div className="secondary-images">
              {selectedProduct.secondaryImages.map((image, index) => (
                <div key={index} className="secondary-image">
                  <img 
                    src={`data:image/jpeg;base64,${image}`} 
                    alt={`${selectedProduct.name} ${index + 1}`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-details">
          <div className="detail-section">
            <h3>Description</h3>
            <p>{selectedProduct.description || 'Aucune description disponible pour ce produit.'}</p>
          </div>

          <div className="detail-section">
            <div className="detail-row">
              <div className="detail-item">
                <span className="detail-label">Catégorie</span>
                <span>{selectedProduct.category || 'Non spécifiée'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Prix</span>
                <span className="price-value">
                  {selectedProduct.discountedPrice ? (
                    <>
                      <span className="discounted">{selectedProduct.discountedPrice} dt</span>
                      <span className="original">{selectedProduct.price} dt</span>
                    </>
                  ) : (
                    <span>{selectedProduct.price} dt</span>
                  )}
                </span>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-item">
                <span className="detail-label">Stock disponible</span>
                <span>{selectedProduct.stock || 0} unités</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Référence</span>
                <span>{selectedProduct.sku || 'Non spécifiée'}</span>
              </div>
            </div>
          </div>

          {selectedProduct.variants?.length > 0 && (
            <div className="detail-section">
              <h3>Options disponibles</h3>
              <div className="variants-list">
                {selectedProduct.variants.map((variant, index) => (
                  <span key={index} className="variant-tag">
                    {variant}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button 
            className="edit-btn" 
            onClick={() => {
              localStorage.setItem('editingProductId', selectedProduct.id);
              handleEdit(selectedProduct.id);
            }}
          >
            <FontAwesomeIcon icon={faEdit} /> Modifier le produit
          </button>
          <button 
            className="delete-btn" 
            onClick={() => handleDelete(selectedProduct.id)}
          >
            <FontAwesomeIcon icon={faTrash} /> Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEye, 
  faTrash, 
  faEdit, 
  faPlus, 
  faTimes, 
  faBars,
  faCheck,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import './Styles/ProductManagement.css';
import { authService } from '../services/authService';
import Header from './Header';
import Sidebar from './SidebarVendeur';
import './Styles/ProductManagement.css';
import ProductModal from './productmodel';
const ProductManagement = () => {
  const [userData, setUserData] = useState({
    username: '',
    userRole: '',
    userid: null
  });
  const getProductId = () => {
  return localStorage.getItem('productid');
};

const setProductId = (id) => {
  localStorage.setItem('productid', id);
};

const clearProductId = () => {
  localStorage.removeItem('productid');
};
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]); // Pour la sélection multiple
  const navigate = useNavigate();

  // Récupération initiale des données utilisateur
  useEffect(() => {
    const fetchUserData = () => {
      try {
        const role = authService.getUserRole();
        const name = authService.getUserName();
        const id = authService.getUserId();
        
        if (!id) throw new Error('User ID not found');
        
        setUserData({
          username: name,
          userRole: role,
          userid: id
        });
        
        return id;
      } catch (error) {
        console.error('Error fetching user data:', error);
        authService.logOut();
        navigate('/login');
        return null;
      }
    };

    const id = fetchUserData();
    if (id) {
      fetchProducts(id);
    }
  }, [navigate]);

  // Effet secondaire pour recharger les produits si userid change
  useEffect(() => {
    if (userData.userid) {
      fetchProducts(userData.userid);
    }
  }, [userData.userid]);

  const fetchProducts = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`http://localhost:3001/api/v1/products/user/${userId}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.body.classList.toggle('dark-mode', newMode);
    localStorage.setItem('darkMode', newMode);
  };

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);


  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    switch(menu) {
      case 'ventes': navigate('/ventes', { replace: true }); break;
      case 'statistiques': navigate('/statistiques', { replace: true }); break;
      case 'ajouterproduit': navigate('/ajouterproduit', { replace: true }); break;
      case 'alertes': navigate('/alertes', { replace: true }); break;
      default: navigate('/Vendeur', { replace: true });
    }
  };
  // Sélection/désélection d'un produit
 const toggleProductSelection = (productId) => {
  // Enregistre le dernier produit sélectionné
  setProductId(productId);
  
  // Gère la sélection multiple
  setSelectedProducts(prev => 
    prev.includes(productId) 
      ? prev.filter(id => id !== productId)
      : [...prev, productId]
  );
};

  // Suppression multiple
  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedProducts.length} produit(s) ?`)) {
      try {
        await Promise.all(
          selectedProducts.map(id => 
            axios.delete(`http://localhost:3001/api/v1/products/${id}`)
          )
        );
        fetchProducts(userData.userid);
        setSelectedProducts([]);
      } catch (error) {
        console.error('Error deleting products:', error);
        setError('Erreur lors de la suppression des produits');
      }
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await axios.delete(`http://localhost:3001/api/v1/products/${productId}`);
        fetchProducts(userData.userid);
        // Retirer le produit de la sélection s'il y était
        setSelectedProducts(prev => prev.filter(id => id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Erreur lors de la suppression du produit');
      }
    }
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Enregistre l'ID avant la modification et navigue
const handleEdit = (productId) => {
  setProductId(productId); // Utilise la fonction utilitaire
  navigate('/editproduct');
};
const logout = () => {
  clearProductId(); // Nettoie le productId
  authService.logOut();
  navigate('/login');
};

  const handleAddProduct = () => {
    navigate('/ajouterproduit');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="sidebar-toggle-container">
        <button 
          className="toggle-sidebar-btn" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      
      <div className="content-wrapper">
        <Sidebar 
          activeMenu={activeMenu}
          handleMenuClick={handleMenuClick}
          logout={logout}
          isOpen={isSidebarOpen}
          className={isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}
        />
        
        <div className={`main-content ${isSidebarOpen ? 'with-sidebar' : ''}`}>
          <div className="product-management-container">
            <div className="header-section">
              <h1>Mes Produits</h1>
              <div className="action-buttons-container">
                <button onClick={handleAddProduct} className="add-product-btn">
                  <FontAwesomeIcon icon={faPlus} /> Ajouter un produit
                </button>
                {selectedProducts.length > 0 && (
                  <button 
                    onClick={handleBulkDelete} 
                    className="bulk-delete-btn"
                    title="Supprimer la sélection"
                  >
                    <FontAwesomeIcon icon={faTrash} /> Supprimer ({selectedProducts.length})
                  </button>
                )}
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="products-grid">
              {products.length > 0 ? (
                products.map((product) => (
                  <div 
                    className={`product-card ${selectedProducts.includes(product.id) ? 'selected' : ''}`} 
                    key={product.id}
                    onClick={() => {
  toggleProductSelection(product.id);
  localStorage.setItem('productid', product.id);
}}
                  >
                    <div className="product-selection-checkbox">
                      {selectedProducts.includes(product.id) && (
                        <FontAwesomeIcon icon={faCheck} className="selection-checkmark" />
                      )}
                    </div>
                    
                    <div className="product-image-container">
                      {product.primaryImage && (
                        <img 
                          src={`data:image/jpeg;base64,${product.primaryImage}`} 
                          alt={product.name} 
                          className="product-image"
                          loading="lazy"
                        />
                      )}
                      <div className="product-hover-overlay">
                        <div className="action-buttons">
                          <button 
                            className="action-btn view-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(product);
                            }}
                            title="Voir détails"
                            aria-label="Voir détails"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button 
                            className="action-btn edit-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(product.id);
                            }}
                            title="Modifier"
                            aria-label="Modifier"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(product.id);
                            }}
                            title="Supprimer"
                            aria-label="Supprimer"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <div className="price-section">
                        {product.discountedPrice ? (
                          <>
                            <span className="discounted-price">{product.discountedPrice} €</span>
                            <span className="original-price">{product.price} €</span>
                          </>
                        ) : (
                          <span className="price">{product.price} €</span>
                        )}
                      </div>
                      <div className="product-meta">
                        <span className="product-category">{product.category}</span>
                        <span className="product-stock">{product.stock} en stock</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-products">
                  <p>Aucun produit trouvé. Commencez par ajouter votre premier produit.</p>
                  <button onClick={handleAddProduct} className="add-product-btn">
                    <FontAwesomeIcon icon={faPlus} /> Ajouter un produit
                  </button>
                </div>
              )}
            </div>

            {showModal && selectedProduct && (
               <ProductModal
    selectedProduct={selectedProduct}
    closeModal={closeModal}
    handleEdit={handleEdit}
    handleDelete={handleDelete}
    isDarkMode={isDarkMode}
  /> 
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
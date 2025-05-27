import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrashAlt, faPlusCircle, faBars, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Styles/ajouterproduit.css';
import { authService } from "../services/authService";
import Header from './Header';
import Sidebar from './SidebarVendeur';

const EditProductForm = () => {
  const [productId, setProductId] = useState(null);
  const [userName, setUserName] = useState('');
  const [userid, setUserid] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  
  
  const [product, setProduct] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    prixachat:'',
    discountedPrice: '',
    description: '',
    primaryImage: '',
    secondaryImages: [],
    brand: '',
    stock: '',
    sku: '',
    variants: '',
    userid: null
  });

  const [previews, setPreviews] = useState({
    primary: null,
    secondary: []
  });

  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.body.classList.toggle('dark-mode', newMode);
    localStorage.setItem('darkMode', newMode);
  };

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => { 
    const username = authService.getUserName();
    const userid = authService.getUserId();
    setUserName(username);
    setUserid(userid);
    
    const storedProductId = localStorage.getItem('productid');
    if (!storedProductId) {
      console.error('Aucun ID de produit trouvé dans le localStorage');
      navigate('/ventes');
      return;
    }

    setProductId(storedProductId);
    fetchProduct(storedProductId);
  }, []);

  const fetchProduct = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/products/${id}`);
      const productData = response.data;
      
      setProduct({
        name: productData.name,
        category: productData.category || 'Electronics',
        price: productData.price,
        prixachat: productData.prixachat,
        discountedPrice: productData.discountedPrice || '',
        description: productData.description,
        primaryImage: productData.primaryImage,
        secondaryImages: productData.secondaryImages || [],
        brand: productData.brand || '',
        stock: productData.stock || '',
        sku: productData.sku || '',
        variants: productData.variants ? productData.variants.join(', ') : '',
        userid: productData.userid || userid
      });

      setPreviews({
        primary: productData.primaryImage ? `data:image/jpeg;base64,${productData.primaryImage}` : null,
        secondary: productData.secondaryImages ? 
          productData.secondaryImages.map(img => `data:image/jpeg;base64,${img}`) : []
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      alert('Impossible de charger le produit à modifier');
      navigate('/ventes');
    }
  };

  const secondaryInputRef = useRef();
  const navigate = useNavigate();

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Beauty',
    'Sports',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      
      if (type === 'primary') {
        setProduct(prev => ({ ...prev, primaryImage: base64String }));
        setPreviews(prev => ({ ...prev, primary: URL.createObjectURL(file) }));
      } else {
        setProduct(prev => ({
          ...prev,
          secondaryImages: [...prev.secondaryImages, base64String]
        }));
        setPreviews(prev => ({
          ...prev,
          secondary: [...prev.secondary, URL.createObjectURL(file)]
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index, type) => {
    if (type === 'primary') {
      setProduct(prev => ({ ...prev, primaryImage: '' }));
      setPreviews(prev => ({ ...prev, primary: null }));
    } else {
      setProduct(prev => ({
        ...prev,
        secondaryImages: prev.secondaryImages.filter((_, i) => i !== index)
      }));
      setPreviews(prev => ({
        ...prev,
        secondary: prev.secondary.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!productId) {
      alert('Erreur: Aucun ID de produit spécifié');
      return;
    }

    try {
      const payload = {
      name: product.name,
      category: product.category,
      price: parseFloat(product.price),
      prixachat: parseFloat(product.prixachat),
      discountedPrice: product.discountedPrice ? parseFloat(product.discountedPrice) : null,
      description: product.description,
      primaryImage: product.primaryImage,
      secondaryImages: product.secondaryImages,
      brand: product.brand,
      stock: product.stock ? parseInt(product.stock) : null,
      sku: product.sku,
      variants: product.variants.split(',').map(v => v.trim())
      // Retirez userid qui n'existe pas dans l'entité Product
    };

   await axios.put(`${API_BASE_URL}/api/v1/products/${productId}`, payload);
      alert('Produit mis à jour avec succès !');
      navigate('/ventes');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour du produit');
    }
  };
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
  const logout = () => {
    authService.logOut();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="loading-container">Chargement du produit...</div>
      </div>
    );
  }

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <div className="sidebar-toggle-container">
        <button 
          className="toggle-sidebar-btn" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
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
          <div className="product-form-container">
            <h2 className="form-title">Modifier le produit</h2>
            
            <form onSubmit={handleSubmit} className="product-form-container">
              <div className="form-grid-container">
                {/* Colonne gauche - Champs texte */}
                <div className="form-left-column">
                  <div className="form-section">
                    <h3 className="form-section-title">Informations de base</h3>
                    <div className="form-group">
                      <label className="form-label">Nom du produit*</label>
                      <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="Smartphone Premium"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Catégorie*</label>
                      <select
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        required
                        className="form-select"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3 className="form-section-title">Prix & Stock</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Prix* (dt)</label>
                        <input
                          type="number"
                          step="0.01"
                          name="price"
                          value={product.price}
                          onChange={handleChange}
                          required
                          className="form-input"
                          placeholder="999.99"
                        />
                      </div>
                           <div className="form-group">
                        <label className="form-label">prixachat* (dt)</label>
                        <input
                          type="number"
                          step="0.01"
                          name="prixachat"
                          value={product.prixachat}
                          onChange={handleChange}
                          required
                          className="form-input"
                          placeholder="999.99"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Prix réduit (dt)</label>
                        <input
                          type="number"
                          step="0.01"
                          name="discountedPrice"
                          value={product.discountedPrice}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="899.99"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        name="stock"
                        value={product.stock}
                        required
                        onChange={handleChange}
                        className="form-input"
                        placeholder="100"
                      />
                    </div>
                  </div>

                  <div className="form-section">
                    <h3 className="form-section-title">Détails</h3>
                    <div className="form-group">
                      <label className="form-label">Marque</label>
                      <input
                        type="text"
                        name="brand"
                        value={product.brand}
                        required
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Samsung"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Variantes (séparées par des virgules)</label>
                      <input
                        type="text"
                        name="variants"
                        value={product.variants}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="128GB, 256GB"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">SKU</label>
                      <input
                        type="text"
                        name="sku"
                        value={product.sku}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="SM-G998B"
                      />
                    </div>
                  </div>
                </div>

                {/* Colonne droite - Contenu riche */}
                <div className="form-right-column">
                  <div className="form-section">
                    <h3 className="form-section-title">Description</h3>
                    <div className="form-group">
                      <label className="form-label">Description*</label>
                      <textarea
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        required
                        rows="6"
                        className="form-textarea"
                        placeholder="Dernier modèle avec caméra 108MP..."
                      />
                    </div>
                  </div>

                  <div className="form-section">
                    <h3 className="form-section-title">Images</h3>
                    <div className="form-group">
                      <label className="form-label">Image principale*</label>
                      <div className="image-upload-container">
                        {previews.primary ? (
                          <div className="image-preview-wrapper">
                            <img src={previews.primary} alt="Preview principale" className="image-preview" required />
                            <button
                              type="button"
                              onClick={() => removeImage(null, 'primary')}
                              className="image-remove-btn"
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                          </div>
                        ) : (
                          <label className="image-upload-label">
                            <div className="upload-content">
                              <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                              <span className="upload-text">Cliquer pour télécharger</span>
                              <span className="upload-hint">Format recommandé : 800x800px</span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'primary')}
                              className="hidden-input"
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Images secondaires (max 2)</label>
                      <div className="secondary-images-grid">
                        {previews.secondary.map((img, index) => (
                          <div key={index} className="secondary-image-wrapper">
                            <img src={img} alt={`Preview ${index + 1}`} className="secondary-image-preview" />
                            <button
                              type="button"
                              onClick={() => removeImage(index, 'secondary')}
                              className="secondary-remove-btn"
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                          </div>
                        ))}
                        
                        {previews.secondary.length < 2 && (
                          <label className="secondary-upload-label">
                            <FontAwesomeIcon icon={faPlusCircle} className="add-icon" />
                            <input
                              type="file"
                              accept="image/*"
                              required
                              onChange={(e) => handleImageUpload(e, 'secondary')}
                              className="hidden-input"
                              ref={secondaryInputRef}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-footer">
                <button type="submit" className="submit-button primary">
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  Mettre à jour
                </button>
                <button
                  type="button"
                  className="submit-button secondary"
                  onClick={() => navigate('/ventes')}
                >
                  <FontAwesomeIcon icon={faTimes} className="me-2" />
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductForm;
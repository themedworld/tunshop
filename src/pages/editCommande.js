import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faSave,
  faTrash,
  faBox,
  faMapMarkerAlt,
  faCreditCard,
  faTruck,
  faInfoCircle,
  faEdit,
  faBars
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Styles/EditOrderPage.css';
import { authService } from '../services/authService';
import Header from './Header';
import Sidebar from './SidebarClient';

const EditOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [activeMenu, setActiveMenu] = useState('editcommande');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // États pour les champs modifiables
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [shippingMethod, setShippingMethod] = useState('Standard');
  const [status, setStatus] = useState('En attente');
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState('');

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
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/commandes/${id}`);
        const orderData = response.data;
        setOrder(orderData);
        setShippingAddress(orderData.shippingAddress);
        setPaymentMethod(orderData.paymentMethod);
        setShippingMethod(orderData.shippingMethod || 'Standard');
        setStatus(orderData.status);
        setItems(orderData.items);
        setNotes(orderData.notes || '');
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    try {
      const updatedOrder = {
        shippingAddress,
        paymentMethod,
        shippingMethod,
        status,
        items,
        notes
      };

      const response = await axios.put(`http://localhost:3001/api/v1/commandes/${id}`, updatedOrder);
      navigate('/RecentOrdersPage', { state: { orderUpdated: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la mise à jour de la commande");
    }
  };

const handleCancelOrder = async () => {
  try {
    // Restaurer le stock pour tous les articles avant de supprimer la commande
    await Promise.all(items.map(item => 
      axios.put(`http://localhost:3001/api/v1/products/${item.product.id}`, {
        stock: item.product.stock + item.quantity
      })
    ));

    // Supprimer la commande
    await axios.delete(`http://localhost:3001/api/v1/commandes/${id}`);
    navigate('/RecentOrdersPage', { state: { orderCancelled: true } });
  } catch (err) {
    setError(err.response?.data?.message || "Erreur lors de l'annulation de la commande");
  }
};

  const handleItemQuantityChange = async (itemId, newQuantity) => {
  try {
    const newQty = Math.max(1, newQuantity);
    const itemToUpdate = items.find(item => item.id === itemId);
    
    if (!itemToUpdate || itemToUpdate.quantity === newQty) return;

    // Calculer la différence de quantité
    const quantityDiff = itemToUpdate.quantity - newQty;
    
    if (quantityDiff > 0) {
      // Si la quantité est réduite, ajouter la différence au stock
      await axios.put(`http://localhost:3001/api/v1/products/${itemToUpdate.product.id}`, {
        stock: itemToUpdate.product.stock + quantityDiff
      });
    }

    // Mettre à jour la quantité dans la commande
    setItems(items.map(item => 
      item.id === itemId ? { ...item, quantity: newQty } : item
    ));
    
  } catch (err) {
    setError(err.response?.data?.message || "Erreur lors de la modification de la quantité");
  }
};

 const handleRemoveItem = async (itemId) => {
  try {
    // Trouver l'article à supprimer
    const itemToRemove = items.find(item => item.id === itemId);
    
    if (!itemToRemove) return;

    // Envoyer une requête pour mettre à jour le stock du produit
    await axios.put(`http://localhost:3001/api/v1/products/${itemToRemove.product.id}`, {
      stock: itemToRemove.product.stock + itemToRemove.quantity
    });

    // Supprimer l'article de la liste
    setItems(items.filter(item => item.id !== itemId));
    
  } catch (err) {
    setError(err.response?.data?.message || "Erreur lors de la suppression de l'article");
  }
};
  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const logout = () => {
    authService.logOut();
    navigate('/login');
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    switch(menu) {
      case 'ventes': navigate('/ventes', { replace: true }); break;
      case 'editcommande': navigate('/RecentOrdersPage', { replace: true }); break;
      case 'allcommandes': navigate('#', { replace: true }); break;
      case 'chatboot': navigate('#', { replace: true }); break;
      default: navigate('/Client', { replace: true });
    }
  };

  if (loading) return (
    <div className={`loading-screen ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="spinner"></div>
      <p>Chargement des détails de la commande...</p>
    </div>
  );

  if (error) return (
    <div className={`error-screen ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="error-icon">
        <FontAwesomeIcon icon={faInfoCircle} size="3x" />
      </div>
      <h2>Erreur</h2>
      <p>{error}</p>
      <button onClick={() => navigate('/RecentOrdersPage')} className="retry-btn">
        Retour aux commandes
      </button>
    </div>
  );

  if (!order) return (
    <div className={`not-found-screen ${isDarkMode ? 'dark-mode' : ''}`}>
      <h2>Commande non trouvée</h2>
      <p>La commande que vous essayez de modifier n'existe pas.</p>
      <button onClick={() => navigate('/RecentOrdersPage')} className="back-btn">
        Retour aux commandes
      </button>
    </div>
  );

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <div className="sidebar-toggle-container">
        <button 
          className="toggle-sidebar-btn" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
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
        
        <div className={`edit-order-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="edit-order-header">
            <button onClick={() => navigate('/RecentOrdersPage')} className="back-button">
              <FontAwesomeIcon icon={faArrowLeft} /> Retour
            </button>
            <h1>
              <FontAwesomeIcon icon={faEdit} className="header-icon" />
              Modifier la commande #{order.id}
            </h1>
            <div className="order-meta">
              <span className="order-date">Date: {formatDate(order.orderDate)}</span>
              <span className="order-total">Total: {calculateTotal()} dt</span>
            </div>
          </div>

          <form onSubmit={handleUpdateOrder} className="edit-order-form">
            <div className="form-sections-container">
              {/* Section Adresse */}
              <div className="form-section">
                <h2>
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> Adresse de livraison
                </h2>
                <div className="form-group">
                  <label>Adresse complète</label>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Section Paiement */}
              <div className="form-section">
                <h2>
                  <FontAwesomeIcon icon={faCreditCard} /> Paiement
                </h2>
                <div className="form-group">
                  <label>Méthode de paiement</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="COD">Paiement à la livraison</option>
                    <option value="CARD">Carte bancaire</option>
                    <option value="TRANSFER">Virement bancaire</option>
                  </select>
                </div>
              </div>

              {/* Section Livraison */}
              <div className="form-section">
                <h2>
                  <FontAwesomeIcon icon={faTruck} /> Livraison
                </h2>
                <div className="form-group">
                  <label>Méthode de livraison</label>
                  <select
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  >
                    <option value="Standard">Livraison standard</option>
                    <option value="Express">Livraison express</option>
                    <option value="Pickup">Retrait en magasin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Statut de la commande</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="En attente">En attente</option>
                    <option value="En cours">En cours de traitement</option>
                    <option value="Expédiée">Expédiée</option>
                    <option value="Livrée">Livrée</option>
                    <option value="Annulée">Annulée</option>
                  </select>
                </div>
              </div>

              {/* Section Articles */}
              <div className="form-section">
                <h2>
                  <FontAwesomeIcon icon={faBox} /> Articles ({items.length})
                </h2>
                {items.length === 0 ? (
                  <p className="no-items">Aucun article dans cette commande</p>
                ) : (
                  <div className="order-items-list">
                    {items.map(item => (
                      <div key={item.id} className="order-item">
                        <div className="item-image-container">
                          <img 
                            src={`data:image/jpeg;base64,${item.product.primaryImage}`} 
                            alt={item.product.name}
                          />
                        </div>
                        <div className="item-details">
                          <h3>{item.product.name}</h3>
                          <p className="item-price">{item.unitPrice} dt</p>
                          {item.product.variants && item.product.variants.length > 0 && (
                            <div className="item-variants">
                              <span>Options:</span>
                              <ul>
                                {item.product.variants.map((variant, index) => (
                                  <li key={index}>{variant}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="item-quantity-controls">
                          <button 
                            type="button" 
                            onClick={() => handleItemQuantityChange(item.id, item.quantity - 1)}
                            className="quantity-btn"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemQuantityChange(item.id, parseInt(e.target.value))}
                            min="1"
                          />
                          <button 
                            type="button" 
                            onClick={() => handleItemQuantityChange(item.id, item.quantity + 1)}
                            className="quantity-btn"
                          >
                            +
                          </button>
                        </div>
                        <div className="item-total">
                          {(item.unitPrice * item.quantity).toFixed(2)} dt
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="remove-item-btn"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section Notes */}
              <div className="form-section">
                <h2>Notes</h2>
                <div className="form-group">
                  <label>Instructions spéciales</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ajoutez des notes ou instructions pour cette commande..."
                  />
                </div>
              </div>
            </div>

            {/* Résumé et actions */}
            <div className="order-summary-actions">
              <div className="order-summary">
                <h3>Résumé de la commande</h3>
                <div className="summary-row">
                  <span>Sous-total:</span>
                  <span>{calculateTotal()} dt</span>
                </div>
                <div className="summary-row">
                  <span>Frais de livraison:</span>
                  <span>{order.shippingCost || 0} dt</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="summary-row discount">
                    <span>Réduction:</span>
                    <span>-{order.discountAmount} dt</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>{calculateTotal() + (order.shippingCost || 0) - (order.discountAmount || 0)} dt</span>
                </div>
              </div>

              <div className="order-actions">
                <button type="submit" className="save-btn">
                  <FontAwesomeIcon icon={faSave} /> Enregistrer les modifications
                </button>
                <button 
                  type="button" 
                  onClick={handleCancelOrder}
                  className="cancel-order-btn"
                >
                  <FontAwesomeIcon icon={faTrash} /> Annuler la commande
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditOrderPage;
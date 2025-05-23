import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClock, 
  faEdit, 
  faTrash, 
  faCheck,
  faBars,
  faBox,
  faTruck,
  faMapMarkerAlt,
  faCreditCard,
  faCalendarAlt,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Styles/RecentOrdersPage.css';
import { authService } from '../services/authService';
import Header from './Header';
import Sidebar from './SidebarClient';

const RecentOrdersPage = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();
  const userId = authService.getUserId();
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  
  // Fonction pour modifier une commande
  const updateOrder = async (orderId, updatedData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/v1/commandes/${orderId}`, updatedData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Fonction pour supprimer une commande
  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/commandes/${orderId}`);
    } catch (error) {
      throw error;
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.body.classList.toggle('dark-mode', newMode);
    localStorage.setItem('darkMode', newMode);
  };

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/commandes/user/${userId}`);
        const now = new Date();
        const recentOrders = response.data.filter(order => {
          const orderDate = new Date(order.orderDate);
          const diffHours = (now - orderDate) / (1000 * 60 * 60);
          return diffHours < 24 && order.paymentMethod === 'COD';
        });
        setOrders(recentOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, [userId]);

  const handleEditOrder = async (orderId, updatedData) => {
    try {
      const updatedOrder = await updateOrder(orderId, updatedData);
      setOrders(orders.map(order => 
        order.id === orderId ? updatedOrder : order
      ));
      return updatedOrder;
    } catch (err) {
      setError("Erreur lors de la modification de la commande");
      throw err;
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (err) {
      setError("Erreur lors de l'annulation de la commande");
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

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

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'en attente': return 'status-pending';
      case 'en cours': return 'status-processing';
      case 'expédiée': return 'status-shipped';
      case 'livrée': return 'status-delivered';
      case 'annulée': return 'status-cancelled';
      default: return 'status-default';
    }
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

  if (loading) return (
    <div className={`loading-screen ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="spinner"></div>
      <p>Chargement des commandes...</p>
    </div>
  );
  
  if (error) return (
    <div className={`error-screen ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="error-icon">
        <FontAwesomeIcon icon={faInfoCircle} size="3x" />
      </div>
      <h2>Erreur</h2>
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="retry-btn">
        Réessayer
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
        
        <div className={`client-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="recent-orders-container">
            <div className="page-header">
              <h1>
                <FontAwesomeIcon icon={faClock} className="header-icon" />
                Commandes Récentes
              </h1>
              <p className="page-subtitle">Commandes passées dans les dernières 24 heures (Paiement à la livraison)</p>
            </div>
            
            {orders.length === 0 ? (
              <div className="no-orders-container">
                <div className="no-orders-icon">
                  <FontAwesomeIcon icon={faBox} size="3x" />
                </div>
                <h3>Aucune commande récente à modifier</h3>
                <p>Les commandes apparaîtront ici si elles ont été passées dans les dernières 24 heures et sont payables à la livraison.</p>
                <button onClick={() => navigate('/')} className="shop-now-btn">
                  Faire des achats maintenant
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order.id} className={`order-card ${expandedOrder === order.id ? 'expanded' : ''}`}>
                    <div 
                      className="order-summary" 
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      <div className="order-id-status">
                        <span className="order-id">Commande #{order.id}</span>
                        <span className={`status ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="order-meta">
                        <div className="meta-item">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                          <span>{formatDate(order.orderDate)}</span>
                        </div>
                        <div className="meta-item">
                          <FontAwesomeIcon icon={faCreditCard} />
                          <span>{order.totalAmount} dt</span>
                        </div>
                        <div className="meta-item">
                          <FontAwesomeIcon icon={faBox} />
                          <span>{order.items.length} article(s)</span>
                        </div>
                      </div>
                      
                      <div className="order-toggle">
                        {expandedOrder === order.id ? 'Voir moins' : 'Voir plus'}
                      </div>
                    </div>
                    
                    {expandedOrder === order.id && (
                      <div className="order-details-expanded">
                        <div className="details-section">
                          <h4>
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                            Adresse de livraison
                          </h4>
                          <p>{order.shippingAddress}</p>
                        </div>
                        
                        <div className="details-section">
                          <h4>
                            <FontAwesomeIcon icon={faCreditCard} />
                            Paiement
                          </h4>
                          <p>Méthode: {order.paymentMethod}</p>
                          {order.paymentStatus && <p>Statut: {order.paymentStatus}</p>}
                        </div>
                        
                        <div className="details-section">
                          <h4>
                            <FontAwesomeIcon icon={faTruck} />
                            Livraison
                          </h4>
                          <p>Méthode: {order.shippingMethod || 'Standard'}</p>
                          {order.trackingNumber && (
                            <p>Numéro de suivi: {order.trackingNumber}</p>
                          )}
                          {order.estimatedDelivery && (
                            <p>Date estimée: {formatDate(order.estimatedDelivery)}</p>
                          )}
                        </div>
                        
                        <div className="order-items-section">
                          <h4>Articles commandés</h4>
                          <div className="items-grid">
                            {order.items.map(item => (
                              <div key={item.id} className="item-card">
                                <div className="item-image-container">
                                  <img 
                                    src={`data:image/jpeg;base64,${item.product.primaryImage}`} 
                                    alt={item.product.name}
                                    className="item-image"
                                  />
                                </div>
                                <div className="item-details">
                                  <h5>{item.product.name}</h5>
                                  <p className="item-price">{item.unitPrice} dt</p>
                                  <p className="item-quantity">Quantité: {item.quantity}</p>
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
                                  <p className="item-total">
                                    Total: {(item.unitPrice * item.quantity)} dt
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="order-summary-section">
                          <div className="summary-row">
                            <span>Sous-total:</span>
                            <span>{(order.totalAmount - (order.shippingCost || 0))} dt</span>
                          </div>
                          {order.shippingCost && (
                            <div className="summary-row">
                              <span>Frais de livraison:</span>
                              <span>{order.shippingCost} dt</span>
                            </div>
                          )}
                          {order.discountAmount && (
                            <div className="summary-row discount">
                              <span>Réduction:</span>
                              <span>-{order.discountAmount} dt</span>
                            </div>
                          )}
                          <div className="summary-row total">
                            <span>Total:</span>
                            <span>{order.totalAmount} dt</span>
                          </div>
                        </div>
                        
                        <div className="order-actions">
                          <button 
                            onClick={() => navigate(`/edit-order/${order.id}`)}
                            className="edit-btn action-btn"
                          >
                            <FontAwesomeIcon icon={faEdit} /> Modifier la commande
                          </button>
                          <button 
                            onClick={() => handleCancelOrder(order.id)}
                            className="cancel-btn action-btn"
                          >
                            <FontAwesomeIcon icon={faTrash} /> Annuler la commande
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentOrdersPage;
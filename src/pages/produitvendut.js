import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faCalendarAlt, faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { authService } from '../services/authService';
import './Styles/produitvendut.css';
import { useNavigate } from 'react-router-dom';
import { faBars, faIdCard, faShieldAlt, faUserTie } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
import Sidebar from './SidebarVendeur';
const SellerProductsDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const navigate = useNavigate();
   const [userData, setUserData] = useState({
      username: '',
      userRole: '',
      userid: null
    });
    const toggleDarkMode = () => {
       const newMode = !isDarkMode;
       setIsDarkMode(newMode);
       document.body.classList.toggle('dark-mode', newMode);
       localStorage.setItem('darkMode', newMode);
     };
   
     useEffect(() => {
       document.body.classList.toggle('dark-mode', isDarkMode);
     }, []);
   
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
      fetchSoldProducts(id);
    }
  }, [navigate]);

  // Effet secondaire pour recharger les produits si userid change
  useEffect(() => {
    if (userData.userid) {
        fetchSoldProducts(userData.userid);
    }
  }, [userData.userid]);
 
    const fetchSoldProducts = async (userid) => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/v1/commandes/seller/${userid}/products`);
        
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        
        let data = await response.json();
        
        data = data.map(item => ({
          ...item,
          product_price: parseFloat(item.product_price),
          product_discountedPrice: item.product_discountedPrice ? parseFloat(item.product_discountedPrice) : null,
          product_prixachat: item.product_prixachat ? parseFloat(item.product_prixachat) : 0,
          items_unitPrice: parseFloat(item.items_unitprice),
          items_quantity: parseInt(item.items_quantity),
          buyer_id: item.buyer
        }));
        
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
   const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return 'N/A';
    }
    return `${parseFloat(value).toFixed(2)} dt`;
  };
      const calculateProfit = (product) => {
    return (product.items_unitPrice - product.product_prixachat) * product.items_quantity;
  };
 // 6. Calcul des totaux (après la déclaration de calculateProfit)
  const totalSales = products.reduce((sum, p) => sum + p.items_quantity, 0);
  const totalRevenue = products.reduce((sum, p) => sum + (p.items_unitPrice * p.items_quantity), 0);
  const totalProfit = products.reduce((sum, p) => sum + calculateProfit(p), 0);



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
      <p className="font-bold">Error</p>
      <p>{error}</p>
    </div>
  );

  
   const logout = () => {
      authService.logOut();
      navigate('/login');
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
  
    return (
      <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
  
        {/* Bouton burger positionné en dessous du header */}
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
    
  
    <div className="container">
      {/* En-tête et sélecteur de vendeur */}
      <div className="header">
        <h1>
          <FontAwesomeIcon icon={faBox} />
          Produits Vendus
        </h1>
      </div>

      {/* Tableau des produits */}
      <div className="products-table">
        <div className="table-header">
          <div>Produit</div>
          <div>Date Commande</div>
          <div>Quantité</div>
          <div>Prix Unitaire</div>
          <div>Prix Achat</div>
          <div>Profit</div>
        </div>

        {products.length === 0 ? (
          <div className="empty-message">Aucun produit vendu</div>
        ) : (
          products.map((product) => (
            <div key={`${product.commande_id}-${product.product_id}`} className="product-row">
              <div>
                {product.product_name}
                <div className="buyer-info">
                  <FontAwesomeIcon icon={faUser} />
                  {`Client #${product.buyer_id}`}
                </div>
              </div>
              
              <div>
                <FontAwesomeIcon icon={faCalendarAlt} />
                {formatDate(product.commande_orderdate)}
              </div>
              
              <div>
                <FontAwesomeIcon icon={faShoppingCart} />
                {product.items_quantity}
              </div>
              
              <div>
                {formatCurrency(product.items_unitPrice)}
                {product.product_discountedPrice && (
                  <div className="original-price">
                    {formatCurrency(product.product_price)}
                  </div>
                )}
              </div>
              
              <div>
                {product.product_prixachat ? formatCurrency(product.product_prixachat) : 'N/A'}
              </div>
              
              <div className={calculateProfit(product) >= 0 ? 'profit-positive' : 'profit-negative'}>
                {formatCurrency(calculateProfit(product))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Récapitulatif */}
    <div className="summary-cards">
        <div>
          <div>Total Ventes</div>
          <div>{totalSales}</div>
        </div>
        <div>
          <div>Chiffre d'Affaires</div>
          <div>{formatCurrency(totalRevenue)}</div>
        </div>
        <div>
          <div>Profit Total</div>
          <div className={totalProfit >= 0 ? 'profit-positive' : 'profit-negative'}>
            {formatCurrency(totalProfit)}
          </div>
        </div>
      </div>
    </div>  </div>  </div>  </div>
  );
};


export default SellerProductsDashboard;
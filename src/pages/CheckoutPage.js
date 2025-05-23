import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faCreditCard, 
  faMoneyBillWave, 
  faMobileAlt,
  faTruck,
  faHome,
  faStore,
  faBars
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import './Styles/CheckoutPage.css';
import { authService } from "../services/authService";
import Header from './Header';
import Sidebar from './SidebarClient';

const CheckoutPage = () => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const location = useLocation();
    const navigate = useNavigate();
    const { cart, total, isDarkMode: propDarkMode } = location.state || {};
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [shippingAddress, setShippingAddress] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
    const [billingAddress, setBillingAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [shippingOption, setShippingOption] = useState('standard');

    useEffect(() => {
        if (!cart || cart.length === 0) {
            navigate('/client');
        }
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [cart, navigate, isDarkMode]);
const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const orderItems = cart.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                unitPrice: item.price
            }));

            const orderData = {
                userId: authService.getUserId(), // Vous devrez stocker l'ID utilisateur lors de la connexion
                paymentMethod,
                shippingAddress,
                billingAddress: billingAddress || shippingAddress,
                notes,
                items: orderItems
            };
              console.log("userid=", authService.getUserId(),orderData );
            const response = await fetch(`${API_BASE_URL}/api/v1/commandes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la commande');
            }

            const result = await response.json();
            navigate('/order-confirmation', { state: { orderId: result.id } });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    const shippingOptions = [
        { id: 'standard', name: 'Livraison standard', price: 5.99, icon: faTruck, days: '3-5 jours' },
        { id: 'express', name: 'Livraison express', price: 12.99, icon: faTruck, days: '1-2 jours' },
        { id: 'pickup', name: 'Retrait en magasin', price: 0, icon: faStore, days: 'Prêt en 24h' }
    ];

    const paymentMethods = [
        { id: 'COD', name: 'Paiement à la livraison', icon: faMoneyBillWave },
        { id: 'CIB', name: 'Carte bancaire (CIB)', icon: faCreditCard },
        { id: 'Flouci', name: 'Flouci', icon: faMobileAlt }
    ];

    const selectedShipping = shippingOptions.find(opt => opt.id === shippingOption);
    const grandTotal = total + (selectedShipping?.price || 0);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                when: "beforeChildren"
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };
     const [userRole, setUserRole] = useState('');
   
   const [activeMenu, setActiveMenu] = useState('dashboard');
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  
 
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
     const role = authService.getUserRole();
     const name = authService.getUserName();
    
     setUserRole(role);
   }, []);
 
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
 

    return (
         <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
       <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
 
       {/* Bouton burger positionné en dessous du header */}
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
        <motion.div 
            className={`checkout-container ${isDarkMode ? 'dark-mode' : ''}`}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.button 
                className="back-button"
                onClick={() => navigate(-1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variants={itemVariants}
            >
                <FontAwesomeIcon icon={faArrowLeft} /> Retour
            </motion.button>

            <motion.h1 variants={itemVariants}>Finaliser votre commande</motion.h1>
            
            <div className="checkout-grid">
                <motion.div 
                    className="order-summary"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                >
                    <h2>Récapitulatif</h2>
                    <ul className="order-items">
                        {cart?.map((item, index) => (
                            <motion.li 
                                key={item.id} 
                                className="order-item"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <span className="item-name">
                                    {item.name} <span className="quantity">x {item.quantity}</span>
                                </span>
                                <span className="item-price">{(item.price * item.quantity).toFixed(2)} dt</span>
                            </motion.li>
                        ))}
                    </ul>

                    <div className="shipping-summary">
                        <h3>Méthode de livraison</h3>
                        <div className="shipping-method">
                            <FontAwesomeIcon icon={selectedShipping?.icon} />
                            <span>{selectedShipping?.name} ({selectedShipping?.days})</span>
                            <span className="shipping-price">
                                {selectedShipping?.price > 0 ? `${selectedShipping.price.toFixed(2)} dt` : 'Gratuit'}
                            </span>
                        </div>
                    </div>

                    <div className="order-total">
                        <span>Total:</span>
                        <span className="total-amount">{grandTotal.toFixed(2)} dt</span>
                    </div>
                </motion.div>

                <motion.form 
                    onSubmit={handleSubmit} 
                    className="checkout-form"
                    variants={itemVariants}
                >
                    <motion.div 
                        className="form-section"
                        variants={itemVariants}
                    >
                        <h2><FontAwesomeIcon icon={faHome} /> Adresse de livraison</h2>
                        <textarea
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            placeholder="Entrez votre adresse complète"
                            required
                            className="animated-input"
                        />
                    </motion.div>

                    <motion.div 
                        className="form-section"
                        variants={itemVariants}
                    >
                        <h2>Options de livraison</h2>
                        <div className="shipping-options">
                            {shippingOptions.map((option) => (
                                <motion.label 
                                    key={option.id}
                                    className={`shipping-option ${shippingOption === option.id ? 'selected' : ''}`}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <input
                                        type="radio"
                                        name="shippingOption"
                                        value={option.id}
                                        checked={shippingOption === option.id}
                                        onChange={() => setShippingOption(option.id)}
                                    />
                                    <div className="option-content">
                                        <FontAwesomeIcon icon={option.icon} />
                                        <div>
                                            <span className="option-name">{option.name}</span>
                                            <span className="option-days">{option.days}</span>
                                        </div>
                                        <span className="option-price">
                                            {option.price > 0 ? `${option.price.toFixed(2)} dt` : 'Gratuit'}
                                        </span>
                                    </div>
                                </motion.label>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div 
                        className="form-section"
                        variants={itemVariants}
                    >
                        <h2><FontAwesomeIcon icon={faCreditCard} /> Méthode de paiement</h2>
                        <div className="payment-methods">
                            {paymentMethods.map((method) => (
                                <motion.label 
                                    key={method.id}
                                    className={`payment-method ${paymentMethod === method.id ? 'selected' : ''}`}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method.id}
                                        checked={paymentMethod === method.id}
                                        onChange={() => setPaymentMethod(method.id)}
                                    />
                                    <FontAwesomeIcon icon={method.icon} />
                                    <span>{method.name}</span>
                                </motion.label>
                            ))}
                        </div>
                    </motion.div>

                    {error && (
                        <motion.div 
                            className="error-message"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.button 
                        type="submit" 
                        className="submit-order"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isLoading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            `Payer ${grandTotal.toFixed(2)} dt`
                        )}
                    </motion.button>
                </motion.form>
            </div>
        </motion.div>
        </div></div></div>
    );
};

export default CheckoutPage;
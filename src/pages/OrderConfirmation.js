import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faClock,
  faBoxOpen,
  faChevronLeft
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import './Styles/OrderConfirmation.css';

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId } = location.state || {};
    const [orderDetails, setOrderDetails] = useState(null);
    const [canModify, setCanModify] = useState(true);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        // Simulation de récupération des détails de la commande
        const fetchOrderDetails = async () => {
            try {
                // Ici vous feriez un appel API pour récupérer les détails de la commande
                // const response = await fetch(`/api/orders/${orderId}`);
                // const data = await response.json();
                
                // Simulation de données
                const mockData = {
                    id: orderId,
                    date: new Date().toISOString(),
                    items: [],
                    total: 0,
                    status: 'confirmed'
                };
                
                setOrderDetails(mockData);
                calculateModificationTime(mockData.date);
            } catch (error) {
                console.error("Erreur lors de la récupération de la commande:", error);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        } else {
            navigate('/client');
        }
    }, [orderId, navigate]);
 localStorage.setItem('orderid', orderId);
    const calculateModificationTime = (orderDate) => {
        const orderDateTime = new Date(orderDate).getTime();
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - orderDateTime;
        const hoursDifference = timeDifference / (1000 * 60 * 60);
        
        // Temps restant pour modification (24 heures)
        const remainingHours = 24 - hoursDifference;
        
        if (remainingHours <= 0) {
            setCanModify(false);
        } else {
            setCanModify(true);
            // Mettre à jour le compte à rebours
            const hours = Math.floor(remainingHours);
            const minutes = Math.floor((remainingHours % 1) * 60);
            setTimeLeft(`${hours}h ${minutes}m`);
            
            // Mettre à jour toutes les minutes
            const timer = setInterval(() => {
                const updatedTime = remainingHours - (1/60);
                if (updatedTime <= 0) {
                    setCanModify(false);
                    clearInterval(timer);
                } else {
                    const hours = Math.floor(updatedTime);
                    const minutes = Math.floor((updatedTime % 1) * 60);
                    setTimeLeft(`${hours}h ${minutes}m`);
                }
            }, 60000);
            
            return () => clearInterval(timer);
        }
    };

    const handleModifyOrder = () => {
        if (canModify) {
            navigate('/checkout', { state: { orderId } });
        }
    };

    return (
        <div className="confirmation-container">
            <div className="confirmation-card">
                <div className="confirmation-header">
                    <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
                    <h1>Commande confirmée!</h1>
                    <p className="confirmation-message">Merci pour votre commande. Nous avons envoyé les détails à votre adresse email.</p>
                </div>

                <div className="order-details">
                    <div className="detail-item">
                        <span className="detail-label">Numéro de commande:</span>
                        <span className="detail-value">#{orderId}</span>
                    </div>
                    
                    {orderDetails && (
                        <div className="detail-item">
                            <span className="detail-label">Date:</span>
                            <span className="detail-value">
                                {new Date(orderDetails.date).toLocaleDateString()}
                            </span>
                        </div>
                    )}

                    <div className="modification-info">
                        <FontAwesomeIcon icon={faClock} />
                        {canModify ? (
                            <span>Vous pouvez modifier votre commande dans les <strong>{timeLeft}</strong></span>
                        ) : (
                            <span>Le délai de modification de 24 heures est expiré</span>
                        )}
                    </div>
                </div>

                <div className="action-buttons">
                    <button 
                        onClick={() => navigate('/client')} 
                        className="back-button"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} /> Retour à la boutique
                    </button>
                    
                    {canModify && (
                        <button 
                            onClick={handleModifyOrder}
                            className="modify-button"
                        >
                            <FontAwesomeIcon icon={faBoxOpen} /> Modifier la commande
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
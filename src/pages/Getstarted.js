import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';

import './Getstarted.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faInfoCircle, faSignInAlt, faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
const GetStarted = () => {
     const [isDarkMode, setIsDarkMode] = useState(() => {
    // Optionnel: Récupérer le thème depuis localStorage s'il existe
    return localStorage.getItem('darkMode') === 'true';
  });
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.body.classList.toggle('dark-mode', newMode);
    // Optionnel: Sauvegarder le choix dans localStorage
    localStorage.setItem('darkMode', newMode);
  };

  // Appliquer le mode sombre au chargement de la page
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, []);
    return (
        <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          
            {/* Main Content */}
            <div className="container frippe-main">
                <div className="row align-items-center">
                    <div className="col-lg-6 col-md-12">
                        <div className="welcome-card">
                            <h1 className="welcome-title">Bienvenue sur TUNSHOP</h1>
                            <p className="welcome-text">
                                Découvrez notre sélection de vêtements d'occasion de qualité à petits prix.
                                Faites un geste pour la planète tout en restant stylé !
                            </p>
                            
                            <div className="action-buttons">
                                <Link to="/login" className="btn login-btn">
                                    <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                                    Connexion
                                </Link>
                                <Link to="/boutique" className="btn shop-btn">
                                    <FontAwesomeIcon icon={faShoppingBasket} className="me-2" />
                                    Voir la boutique
                                </Link>
                            </div>
                            
                            <Link to="/about" className="about-link">
                                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                                En savoir plus sur nous
                            </Link>
                        </div>
                    </div>
                    
                    <div className="col-lg-6 col-md-12">
                        <div className="image-container">
                            <img src="https://www.entreprises-magazine.com/wp-content/uploads/2022/02/friperie-Tunisie.jpg" alt="Mode durable en Tunisie" className="main-image" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="frippe-footer">
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center">
                            <p>© 2023 TUNSHOP - Tous droits réservés</p>
                            <div className="social-links">
                                <a href="#facebook" aria-label="Facebook">FB</a>
                                <a href="#instagram" aria-label="Instagram">IG</a>
                                <a href="#twitter" aria-label="Twitter">TW</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default GetStarted;
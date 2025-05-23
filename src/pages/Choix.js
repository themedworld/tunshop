import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import './Styles/Choice.css'; // Fichier CSS pour les styles spécifiques
import Header from './Header';

const Choice = () => {

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
   
    const roles = [
        {
            title: "Client",
            path: "/register",
            description: "Achetez vos produits préférés",
            buttonClass: "btn-primary",
            icon: "🛒"
        },
        {
            title: "Vendeur Professionnel",
            path: "/registerr", 
            description: "Vendez vos produits sur notre plateforme",
            buttonClass: "btn-success",
            icon: "🏪"
        }
    ];

    return (
        <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <div className="choice-container">
            <div className="choice-card">
                <h1 className="choice-title">Choisissez votre profil</h1>
                <p className="choice-subtitle">Comment souhaitez-vous utiliser notre plateforme ?</p>
                
                <div className="role-options">
                    {roles.map((role, index) => (
                        <div key={index} className="role-option">
                            <span className="role-icon">{role.icon}</span>
                            <h3 className="role-title">{role.title}</h3>
                            <p className="role-description">{role.description}</p>
                            <Link 
                                to={role.path} 
                                className={`btn ${role.buttonClass} role-button`}
                            >
                                S'inscrire en tant que {role.title}
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="already-account">
                    <p>Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link></p>
                </div>
            </div>
        </div> </div>
    );
}

export default Choice;

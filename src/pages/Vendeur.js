import { useEffect, useState } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faIdCard, faShieldAlt, faUserTie } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
import Sidebar from './SidebarVendeur';
import './Recruteurs.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Vendeur = () => {
  const [username, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const navigate = useNavigate();

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
    setUserName(name);
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
      <h1 className="welcome-title h3 h1-md">
        <FontAwesomeIcon icon={faUserTie} className="me-3" />
        Bienvenue, {username || 'Vendeur'}
      </h1>
      <p className="role-badge lead">{userRole || 'ROLE_Vendeur'}</p>
    </div>
  </div>

<div className={`container ${isDarkMode ? 'dark-mode' : ''}`}>
  <div className="row justify-content-center">
    <div className="col-12 col-sm-10 col-md-10 col-lg-8">
      {/* Profil */}
      <div className="profile-card card shadow-sm mb-4">
        <div className="card-body">
          <h2 className={`card-title profile-title h5 ${isDarkMode ? 'text-light' : 'text-dark'}`}>
            <FontAwesomeIcon icon={faIdCard} className="me-2" />
            Profil Vendeur
          </h2>
          <div className="user-info">
            <div className="info-item d-flex flex-column flex-md-row mb-2">
              <span className={`info-label fw-bold me-md-2 ${isDarkMode ? 'text-light' : 'text-dark'}`}>
                Nom d'utilisateur:
              </span>
              <span className={`info-value ${isDarkMode ? 'text-light' : 'text-dark'}`}>
                {username}
              </span>
            </div>
            <div className="info-item d-flex flex-column flex-md-row">
              <span className={`info-label fw-bold me-md-2 ${isDarkMode ? 'text-light' : 'text-dark'}`}>
                Rôle:
              </span>
              <span className={`info-value role-value ${isDarkMode ? 'text-light' : 'text-dark'}`}>
                {userRole}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div className="permissions-card card shadow-sm mb-4">
        <div className="card-body">
          <h3 className={`permissions-title h5 mb-3 ${isDarkMode ? 'text-light' : 'text-dark'}`}>
            <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
            Permissions
          </h3>
          <ul className={`permissions-list list-unstyled ps-3 ${isDarkMode ? 'text-light' : 'text-dark'}`}>
            <li>✔ Gestion des produits</li>
            <li>✔ Suivi des ventes</li>
            <li>✔ Gestion des stocks</li>
            <li>✔ Analyse des statistiques commerciales</li>
          </ul>
        </div>
      </div>

      {/* Section artistique */}
      <div className={`art-section mt-4 p-3 rounded ${isDarkMode ? 'bg-dark' : 'bg-body-secondary'}`}>
        <div className="art-piece text-center">
          <div className={`art-title h5 mb-2 ${isDarkMode ? 'text-light' : 'text-dark'}`}>
            🎨 L'Art du Commerce
          </div>
          <div className={`art-description fst-italic ${isDarkMode ? 'text-light' : 'text-dark'}`}>
            "Le vendeur est comme un artiste, transformant les besoins en solutions,
            et chaque interaction en une opportunité de créer de la valeur."
          </div>
        </div>
      </div>
    </div>
  </div>
</div></div>

      </div>

  );
};

export default Vendeur;
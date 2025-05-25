// src/components/Sidebar.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserTie, faIdCard, faShieldAlt,
  faChartLine, faBell, faSignOutAlt,
  faPlusCircle, faShoppingCart
} from '@fortawesome/free-solid-svg-icons';
import './Styles/Sidebar.css';

const Sidebar = ({ activeMenu, handleMenuClick, logout, isOpen }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>

<div className="sidebar-container bg-dark text-white overflow-hidden" style={{minHeight: "100vh"}}>
  {/* Bouton de toggle pour mobile */}
  <button 
    className="navbar-toggler d-md-none position-absolute top-0 end-0 m-2" 
    type="button" 
    data-bs-toggle="collapse" 
    data-bs-target="#sidebarMenu"
    aria-controls="sidebarMenu"
    aria-expanded="false"
    aria-label="Toggle navigation"
  >
    <span className="navbar-toggler-icon"></span>
  </button>

  {/* Contenu du sidebar */}
  <div className="collapse d-md-block h-100" id="sidebarMenu">
    <div className="sidebar-header p-3 d-flex align-items-center">
      <h3 className="mb-0">Menu</h3>
    </div>
    
    <ul className="sidebar-menu nav flex-column px-2 pb-4" style={{overflowY: "auto", overflowX: "hidden"}}>
    

      <li className={`nav-item ${activeMenu === 'dashboard' ? 'active bg-primary rounded' : ''}`}>
        <a 
          className="nav-link text-white d-flex align-items-center py-3" 
          href="#" 
          onClick={(e) => {e.preventDefault(); handleMenuClick('dashboard')}}
        >
          <FontAwesomeIcon icon={faUserTie} className="me-3 fs-5" />
          <span className="d-none d-md-inline">Tableau de bord</span>
        </a>
      </li>
      
      <li className={`nav-item ${activeMenu === 'ventes' ? 'active bg-primary rounded' : ''}`}>
        <a 
          className="nav-link text-white d-flex align-items-center py-3" 
          href="#" 
          onClick={(e) => {e.preventDefault(); handleMenuClick('ventes')}}
        >
          <FontAwesomeIcon icon={faShoppingCart} className="me-3 fs-5" />
          <span className="d-none d-md-inline">Ventes</span>
        </a>
      </li>
      
      <li className={`nav-item ${activeMenu === 'statistiques' ? 'active bg-primary rounded' : ''}`}>
        <a 
          className="nav-link text-white d-flex align-items-center py-3" 
          href="#" 
          onClick={(e) => {e.preventDefault(); handleMenuClick('statistiques')}}
        >
          <FontAwesomeIcon icon={faChartLine} className="me-3 fs-5" />
          <span className="d-none d-md-inline">Statistiques</span>
        </a>
      </li>
      
      <li className={`nav-item ${activeMenu === 'alertes' ? 'active bg-primary rounded' : ''}`}>
        <a 
          className="nav-link text-white d-flex align-items-center py-3" 
          href="#" 
          onClick={(e) => {e.preventDefault(); handleMenuClick('alertes')}}
        >
          <FontAwesomeIcon icon={faBell} className="me-3 fs-5" />
          <span className="d-none d-md-inline">Alertes</span>
        </a>
      </li>
      
      <li className={`nav-item ${activeMenu === 'ajouterproduit' ? 'active bg-primary rounded' : ''}`}>
        <a 
          className="nav-link text-white d-flex align-items-center py-3" 
          href="#" 
          onClick={(e) => {e.preventDefault(); handleMenuClick('ajouterproduit')}}
        >
          <FontAwesomeIcon icon={faPlusCircle} className="me-3 fs-5" />
          <span className="d-none d-md-inline">Ajouter Produit</span>
        </a>
      </li>
      
      <li className="nav-item mt-auto">
        <a 
          className="nav-link text-white d-flex align-items-center py-3" 
          href="#" 
          onClick={(e) => {e.preventDefault(); logout()}}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="me-3 fs-5" />
          <span className="d-none d-md-inline">Déconnexion</span>
        </a>
      </li>
    </ul>
  </div>
</div>
    </div>
  );
};

export default Sidebar;


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
      <div className="sidebar-header">
        <h3>Menu</h3>
      </div>
      <ul className="sidebar-menu">
        <li className={activeMenu === 'dashboard' ? 'active' : ''} onClick={() => handleMenuClick('dashboard')}>
          <FontAwesomeIcon icon={faUserTie} className="me-2" /> Tableau de bord
        </li>
        <li className={activeMenu === 'ventes' ? 'active' : ''} onClick={() => handleMenuClick('ventes')}>
          <FontAwesomeIcon icon={faShoppingCart} className="me-2" /> Ventes
        </li>
        <li className={activeMenu === 'statistiques' ? 'active' : ''} onClick={() => handleMenuClick('statistiques')}>
          <FontAwesomeIcon icon={faChartLine} className="me-2" /> Statistiques
        </li>
        <li className={activeMenu === 'alertes' ? 'active' : ''} onClick={() => handleMenuClick('alertes')}>
          <FontAwesomeIcon icon={faBell} className="me-2" /> Alertes
        </li>
        <li className={activeMenu === 'ajouterproduit' ? 'active' : ''} onClick={() => handleMenuClick('ajouterproduit')}>
          <FontAwesomeIcon icon={faPlusCircle} className="me-2" /> Ajouter Produit
        </li>
        <li onClick={logout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Déconnexion
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;


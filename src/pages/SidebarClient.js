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
        <li className={activeMenu === 'Client' ? 'active' : ''} onClick={() => handleMenuClick('Client')}>
          <FontAwesomeIcon icon={faUserTie} className="me-2" /> Choping
        </li>
        <li className={activeMenu === 'editcommande' ? 'active' : ''} onClick={() => handleMenuClick('editcommande')}>
          <FontAwesomeIcon icon={faShoppingCart} className="me-2" /> modifier commande
        </li>
        <li className={activeMenu === 'recomandation' ? 'active' : ''} onClick={() => handleMenuClick('recomandation')}>
          <FontAwesomeIcon icon={faChartLine} className="me-2" /> pour vous
        </li>
        <li className={activeMenu === 'allcommandes' ? 'active' : ''} onClick={() => handleMenuClick('allcommandes')}>
          <FontAwesomeIcon icon={faBell} className="me-2" /> Vos commandes
        </li>
        <li className={activeMenu === 'chatboot' ? 'active' : ''} onClick={() => handleMenuClick('chatboot')}>
          <FontAwesomeIcon icon={faPlusCircle} className="me-2" /> ChatBoot
        </li>
        <li onClick={logout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Déconnexion
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;


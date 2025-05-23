import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import './header.css';

const Header = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <header className="simple-header">
      <div className="header-content">
        <h1 className="logo">TUNSHOP</h1>
        <button 
          className="mode-toggle"
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? "Passer en mode jour" : "Passer en mode nuit"}
        >
          <FontAwesomeIcon 
            icon={isDarkMode ? faSun : faMoon} 
            className="mode-icon"
          />
          <span className="mode-text">
            {isDarkMode ? 'Mode Jour' : 'Mode Nuit'}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
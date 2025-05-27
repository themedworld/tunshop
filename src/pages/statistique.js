import React, { useState, useEffect } from "react";

import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import './Styles/Stats.css';
import { authService } from "../services/authService";
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './SidebarVendeur';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faIdCard, faShieldAlt, faUserTie } from '@fortawesome/free-solid-svg-icons';
 const Statistique = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
      const navigate = useNavigate();
     const [userData, setUserData] = useState({
        username: '',
        userRole: '',
        userid: null
      });

 const [username, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const logout = () => {
    authService.logOut();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.body.classList.toggle('dark-mode', newMode);
    localStorage.setItem('darkMode', newMode);
  };

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, []);

        const fetchStats = async (userid) => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/commandes/profits/user/${userid}`);
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des statistiques');
                }
                const data = await response.json();
                setStats(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

  
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
      fetchStats(id);
    }
  }, [navigate]);
    // Préparer les données pour les graphiques
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
    const prepareChartData = () => {
        if (!stats) return {};

      const monthlyData = Object.entries(stats.monthlyTotals).map(([month, data]) => ({
  name: data.monthName,
  profit: data.totalProfit
}));

const dailyData = Object.entries(stats.dailyTotals).map(([date, data]) => ({
  name: date,
  profit: data.totalProfit
}));

const productsData = Object.values(stats.annualProducts).map(product => ({
  name: product.productName,
  value: product.totalProfit,
  quantity: product.totalQuantity
}));

        return { monthlyData, dailyData, productsData };
    };

    const { monthlyData, dailyData, productsData } = prepareChartData();

  

    if (loading) return <div className="loading">Chargement des statistiques...</div>;
    if (error) return <div className="error">Erreur: {error}</div>;
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
        <div className="stats-container">
            <h1>Statistiques de Profits</h1>
            
            {/* Section Totaux */}
            <div className="totals-section">
                <div className="total-card">
                    <h3>Profit Annuel</h3>
                    <p className="amount">{stats.annualTotal} €</p>
                </div>
                <div className="total-card">
                    <h3>Meilleur Produit</h3>
                    <p>{stats.bestSellingProduct.productName}</p>
                    <p className="amount">{stats.bestSellingProduct.totalProfit} €</p>
                </div>
                <div className="total-card">
                    <h3>Comparaison Mensuelle</h3>
                    <p className={stats.monthComparison.percentage >= 0 ? 'positive' : 'negative'}>
                        {stats.monthComparison.percentage >= 0 ? '+' : ''}
                        {stats.monthComparison.percentage}%
                    </p>
                </div>
            </div>

            {/* Graphique des profits mensuels */}
            <div className="chart-section">
                <h2>Profits par Mois</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} €`, 'Profit']} />
                        <Legend />
                        <Bar dataKey="profit" fill="#8884d8" name="Profit (€)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Graphique des profits quotidiens */}
            <div className="chart-section">
                <h2>Profits des 7 derniers jours</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} €`, 'Profit']} />
                        <Legend />
                        <Line type="monotone" dataKey="profit" stroke="#ff7300" name="Profit (€)" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Graphique des produits */}
            <div className="chart-section">
                <h2>Répartition des Profits par Produit</h2>
                <div className="pie-chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={productsData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {productsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} €`, 'Profit']} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tableau des produits */}
            <div className="table-section">
                <h2>Détails des Produits</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th>Quantité Vendue</th>
                            <th>Profit Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productsData.map((product, index) => (
                            <tr key={index}>
                                <td>{product.name}</td>
                                <td>{product.quantity}</td>
                                <td>{product.value} €</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div> </div> </div></div>
    );
};

export default Statistique;
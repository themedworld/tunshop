import React, { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import Header from './Header';
import './Styles/Login.css'; // Assurez-vous d'importer le fichier CSS pour le style
const LoginPage = () => {
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
    const [username, setUserName] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // État pour le chargement
    const navigate = useNavigate();
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    
  // Dans LoginPage.js
const submitForm = async(event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const userData = { username, password }
    
    try {
        const response = await authService.login(userData);
        if(response?.data?.accessToken){
            console.log("Login successful",response);
            const userId = response.data.user.id;
            localStorage.setItem('userid', userId);
            console.log("Login successful. User ID:", userId);
            authService.setToken(response?.data?.accessToken);
            // Récupérer le rôle de l'utilisateur après la connexion
            const role = authService.getUserRole();
            // Rediriger en fonction du rôle
            if (role === 'recruteur') {
                navigate('/Recruteur');
            } else if (role === 'demandeur') {
                navigate('/Demandeur');
            } else {
                // Si le rôle n'est pas défini, rediriger vers Welcome
                navigate('/Welcompage');
            }
        }
    } catch (error) {
        setError("Invalid username or password");
    } finally {
        setLoading(false);
    }
}

    return ( 
         <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <div className="login-page " style={{ minHeight: "100vh" }}>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card shadow-sm">
                            <div className="card-header  border-0 pt-4">
                                <h2 className="text-center text-primary mb-0">Welcome Back</h2>
                                <p className="text-center text-muted">Sign in to your account</p>
                            </div>
                            <div className="card-body px-5 py-4">
                                {error && (
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        {error}
                                        <button type="button" className="btn-close" onClick={() => setError("")}></button>
                                    </div>
                                )}
                                
                                <form onSubmit={submitForm}>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">Username</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="bi bi-person-fill"></i>
                                            </span>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="username"
                                                value={username}
                                                onChange={(e) => setUserName(e.target.value)}
                                                placeholder="Enter your username"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="bi bi-lock-fill"></i>
                                            </span>
                                            <input 
                                                type="password" 
                                                className="form-control" 
                                                id="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter your password"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mb-3 d-flex justify-content-between align-items-center">
                                        <div className="form-check">
                                            <input 
                                                type="checkbox" 
                                                className="form-check-input" 
                                                id="rememberMe" 
                                            />
                                            <label className="form-check-label" htmlFor="rememberMe">
                                                Remember me
                                            </label>
                                        </div>
                                        <Link to="/forgot-password" className="text-decoration-none">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary w-100 py-2"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Signing in...
                                            </>
                                        ) : "Sign In"}
                                    </button>
                                    
                                    <div className="text-center mt-3">
                                        <p className="text-muted">
                                            Don't have an account?{' '}
                                            <Link to="/Choix" className="text-primary text-decoration-none fw-bold">
                                                Register here
                                            </Link>
                                        </p>
                                    </div>
                                    
                                    <div className="text-center mt-4">
                                        <p className="text-muted">Or sign in with</p>
                                        <div className="d-flex justify-content-center gap-3">
                                            <button type="button" className="btn btn-outline-primary rounded-circle p-2">
                                                <i className="bi bi-google"></i>
                                            </button>
                                            <button type="button" className="btn btn-outline-primary rounded-circle p-2">
                                                <i className="bi bi-facebook"></i>
                                            </button>
                                            <button type="button" className="btn btn-outline-primary rounded-circle p-2">
                                                <i className="bi bi-twitter"></i>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Ajoutez ces styles pour personnaliser davantage */}
           
        </div></div>
    );
}

export default LoginPage;
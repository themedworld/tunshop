import { useEffect, useState } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Welcomepage = () => {
    const [username, setUserName] = useState();
    const [userRole, setUserRole] = useState();
    const navigate = useNavigate();

    useEffect(() => { 
        const role = authService.getUserRole();
        setUserRole(role);
       
        const username = authService.getUserName();
        setUserName(username);

        // Rediriger automatiquement si le rôle est connu
        if (role === 'Vendeur') {
            navigate('/Vendeur');
        } else if (role === 'Client') {
            navigate('/Client');
        }
    }, [navigate]);

    const logout = () => {
        authService.logOut();
        navigate('/login');
    }

    // Si l'utilisateur n'a pas de rôle défini (peu probable), afficher la page Welcome
    return (
        <div className="container mt-5">
    
        </div>
    );
}

export default Welcomepage;


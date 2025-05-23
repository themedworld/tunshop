// routes/RecruteurRoute.js
import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

export const RecruteurRoute = ({children}) => {
  if (!authService.isLoggedIn()) {
    return <Navigate to="/login" />;
  }
  
  return authService.getUserRole() === 'Vendeur' 
    ? children 
    : <Navigate to="/Vendeur" />;
};
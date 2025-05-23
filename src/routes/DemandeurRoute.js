// routes/DemandeurRoute.js
import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

export const DemandeurRoute = ({children}) => {
  if (!authService.isLoggedIn()) {
    return <Navigate to="/login" />;
  }
  
  return authService.getUserRole() === 'Client' 
    ? children 
    : <Navigate to="/Client" />;
};
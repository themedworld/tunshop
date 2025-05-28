import './App.css';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Welcomepage from './pages/Welcompage';
import Register from './pages/Register'; // Importer Register
import Registerr from './pages/Registerr'; // Importer Registerr
import { WelcomepageRoute } from './routes/WelcomepageRoute';
import { RecruteurRoute } from './routes/RecruteurRoute';
import { DemandeurRoute } from './routes/DemandeurRoute';
import Choix from './pages/Choix';
import Vendeur from './pages/Vendeur';
import Client from './pages/Client';
import GetStarted from './pages/Getstarted';
import Header from './pages/Header';
import ProductForm from './pages/ajouterproduit';
import ProductManagement from './pages/VentesforV';
import  EditProductForm from './pages/editproduct';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmation from './pages/OrderConfirmation';
import RecentOrdersPage from './pages/RecentOrdersPage';
import EditOrderPage from './pages/editCommande';
import Statistique from './pages/statistique';
import SellerProductsDashboard from './pages/produitvendut';
function App() {
  return (
    <Routes>
      <Route path='/' element={<GetStarted />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<Register />} /> 
      <Route path='/Choix' element={<Choix />} /> 
      <Route path='/registerr' element={<Registerr />} /> {/* Utiliser le composant Registerr */}
      <Route path='/Welcompage' element={<WelcomepageRoute><Welcomepage /></WelcomepageRoute>} />
      <Route path='/Vendeur' element={<WelcomepageRoute><RecruteurRoute><Vendeur /></RecruteurRoute></WelcomepageRoute>} />
      <Route path='/Client' element={<WelcomepageRoute><DemandeurRoute><Client /></DemandeurRoute></WelcomepageRoute>} />
      <Route path='/Client' element={<WelcomepageRoute><DemandeurRoute><Client /></DemandeurRoute></WelcomepageRoute>} />
      <Route path='/ajouterproduit' element={<WelcomepageRoute><RecruteurRoute><ProductForm /></RecruteurRoute></WelcomepageRoute>} />
      <Route path='/statistiques' element={<WelcomepageRoute><RecruteurRoute><Statistique /></RecruteurRoute></WelcomepageRoute>} />
      <Route path='/ventes' element={<WelcomepageRoute><RecruteurRoute><ProductManagement /></RecruteurRoute></WelcomepageRoute>} />
      <Route path='/order-confirmation' element={<WelcomepageRoute><DemandeurRoute><OrderConfirmation /></DemandeurRoute></WelcomepageRoute>} />
      <Route path='/checkout' element={<WelcomepageRoute><DemandeurRoute><CheckoutPage /></DemandeurRoute></WelcomepageRoute>} />
<Route path='/RecentOrdersPage' element={<WelcomepageRoute><DemandeurRoute><RecentOrdersPage /></DemandeurRoute></WelcomepageRoute>} />
      <Route path='/editproduct' element={<WelcomepageRoute><RecruteurRoute><EditProductForm/></RecruteurRoute></WelcomepageRoute>} />
      <Route path='/alertes' element={<WelcomepageRoute><RecruteurRoute><SellerProductsDashboard/></RecruteurRoute></WelcomepageRoute>} />
     <Route 
  path='/edit-order/:id' 
  element={
    <WelcomepageRoute>
      <DemandeurRoute>
        <EditOrderPage />
      </DemandeurRoute>
    </WelcomepageRoute>
  } 
/>
      <Route path='/*' element={<LoginPage />} /> {/* Rediriger vers LoginPage si aucun chemin ne correspond */}
    </Routes>
  );
}

export default App;


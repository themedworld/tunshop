import { useEffect, useState } from "react";
import { authService } from "../services/authService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart,
  faSearch,
  faFilter,
  faPlus,
  faMinus,
  faTimes,
  faBars
} from '@fortawesome/free-solid-svg-icons';
import './Styles/Client.css';
import Header from './Header';
import ProductModal from "./ModalProductC";
import { useNavigate } from 'react-router-dom';
import Sidebar from './SidebarClient';

const Client = () => {
    const [username, setUserName] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
    const [searchTerm, setSearchTerm] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const navigate = useNavigate();

    useEffect(() => { 
        const username = authService.getUserName();
        setUserName(username);
        fetchProducts();
    }, []);

    useEffect(() => {
        calculateTotal();
    }, [cart]);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/products`);
            const data = await response.json();
            setProducts(data);
            setFilteredProducts(data);
            const uniqueCategories = [...new Set(data.map(p => p.category))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error("Erreur lors de la récupération des produits:", error);
        } finally {
            setLoading(false);
        }
    };

    const searchProducts = async (keyword) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/v1/products/search/${encodeURIComponent(keyword)}`);
            const data = await response.json();
            setFilteredProducts(data);
        } catch (error) {
            console.error("Erreur lors de la recherche:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterByCategory = async (category) => {
        try {
            setLoading(true);
            if (category === "all") {
                const response = await fetch(`${API_BASE_URL}/api/v1/products`);
                const data = await response.json();
                setFilteredProducts(data);
            } else {
                const response = await fetch(`${API_BASE_URL}/api/v1/products/category/${encodeURIComponent(category)}`);
                const data = await response.json();
                setFilteredProducts(data);
            }
        } catch (error) {
            console.error("Erreur lors du filtrage par catégorie:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm.length >= 3) {
                searchProducts(searchTerm);
            } else if (searchTerm.length === 0 && selectedCategory !== "all") {
                filterByCategory(selectedCategory);
            } else if (searchTerm.length === 0) {
                filterByCategory("all");
            }
        }, 500); // Délai de 500ms pour éviter les requêtes à chaque frappe

        return () => clearTimeout(timer);
    }, [searchTerm, selectedCategory]);

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        filterByCategory(category);
    };

    const addToCart = (product, quantity = 1) => {
        if (quantity > product.stock) {
            alert(`Désolé, nous n'avons que ${product.stock} unité(s) disponible(s) pour ce produit.`);
            return;
        }
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > product.stock) {
                alert(`Vous ne pouvez pas ajouter plus que ${product.stock} unité(s) de ce produit.`);
                return;
            }
            
            setCart(cart.map(item =>
                item.id === product.id 
                    ? { ...item, quantity: newQuantity } 
                    : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: quantity }]);
        }
    };

    const updateQuantity = (productId, newQuantity) => {
        const product = products.find(p => p.id === productId);
        
        if (!product) return;
        
        if (newQuantity > product.stock) {
            alert(`Désolé, nous n'avons que ${product.stock} unité(s) disponible(s) pour ce produit.`);
            return;
        }
        
        if (newQuantity < 1) return;
        
        setCart(cart.map(item =>
            item.id === productId 
                ? { ...item, quantity: newQuantity } 
                : item
        ));
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.id !== productId));
    };
  
    
    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        document.body.classList.toggle('dark-mode', newMode);
        localStorage.setItem('darkMode', newMode);
    };

    const calculateTotal = () => {
        const sum = cart.reduce((acc, item) => acc + (item.discountedPrice * item.quantity), 0);
        setTotal(sum);
    };

    const getProductImage = (product) => {
        if (product.primaryImage) {
            return `data:image/jpeg;base64,${product.primaryImage}`;
        }
        return "https://via.placeholder.com/150";
    };

    const openProductModal = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    const [userRole, setUserRole] = useState('');
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    useEffect(() => {
        const role = authService.getUserRole();
        const name = authService.getUserName();
        setUserName(name);
        setUserRole(role);
    }, []);

    const logout = () => {
        authService.logOut();
        navigate('/login');
    };

    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
        switch(menu) {
            case 'ventes': navigate('/ventes', { replace: true }); break;
            case 'editcommande': navigate('/RecentOrdersPage', { replace: true }); break;
            case 'allcommandes': navigate('#', { replace: true }); break;
            case 'chatboot': navigate('#', { replace: true }); break;
            default: navigate('/Client', { replace: true });
        }
    };

    return (
        <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

            <div className="sidebar-toggle-container">
                <button 
                    className="toggle-sidebar-btn" 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    aria-label={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
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
                
                <div className={`client-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                    <div className="client-container">
                        <div className="welcome-section">
                            <h1>Bienvenue {username}</h1>
                            <p>Découvrez nos produits et consultez votre panier</p>
                        </div>

                        <div className="search-filters">
                            <div className="search-bar">
                                <FontAwesomeIcon icon={faSearch} />
                                <input 
                                    type="text" 
                                    placeholder="Rechercher par nom, catégorie ou marque..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <div className="filter-section">
                                <FontAwesomeIcon icon={faFilter} />
                                <select 
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                >
                                    <option value="all">Toutes catégories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="client-content">
                            <div className="products-section">
                                <h2>Nos Produits ({filteredProducts.length})</h2>
                                
                                {loading ? (
                                    <div className="loading">Chargement des produits...</div>
                                ) : filteredProducts.length === 0 ? (
                                    <div className="no-products">Aucun produit ne correspond à votre recherche</div>
                                ) : (
                                    <div className="products-grid">
                                        {filteredProducts.map(product => (
                                            <div key={product.id} className="product-card compact">
                                                <div className="product-image-container" onClick={() => openProductModal(product)}>
                                                    <img src={getProductImage(product)} alt={product.name} className="product-image" />
                                                    {product.discountedPrice < product.price && (
                                                        <span className="discount-badge compact">
                                                            -{Math.round((1 - product.discountedPrice/product.price) * 100)}%
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="product-info compact">
                                                    <h3 className="product-title" onClick={() => openProductModal(product)}>
                                                        {product.name}
                                                        {product.stock <= 0 && <span className="stock-label">Épuisé</span>}
                                                    </h3>
                                                    <div className="price-section compact">
                                                        {product.discountedPrice < product.price ? (
                                                            <div className="price-container">
                                                                <span className="old-price">{product.price} dt</span>
                                                                <span className="current-price">{product.discountedPrice} dt</span>
                                                            </div>
                                                        ) : (
                                                            <span className="standard-price">{product.price} dt</span>
                                                        )}
                                                    </div>
                                                    <button 
                                                        className={`add-to-cart-btn compact ${product.stock <= 0 ? 'out-of-stock' : ''}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (product.stock > 0) {
                                                                addToCart(product, 1);
                                                            }
                                                        }}
                                                        disabled={product.stock <= 0}
                                                    >
                                                        {product.stock <= 0 ? (
                                                            'Indisponible'
                                                        ) : (
                                                            <>
                                                                <FontAwesomeIcon icon={faShoppingCart} />
                                                                {product.stock < 5 && <span className="low-stock">({product.stock} restants)</span>}
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="cart-section">
                                <div className="cart-header">
                                    <FontAwesomeIcon icon={faShoppingCart} />
                                    <h2>Votre Panier ({cart.length})</h2>
                                </div>
                                
                                <div className="cart-items">
                                    {cart.length === 0 ? (
                                        <p className="empty-cart">Votre panier est vide</p>
                                    ) : (
                                        <ul className="cart-list">
                                            {cart.map(item => {
                                                const product = products.find(p => p.id === item.id) || item;
                                                return (
                                                    <li key={item.id} className="cart-item">
                                                        <div className="item-image">
                                                            <img src={getProductImage(product)} alt={item.name} />
                                                        </div>
                                                        <div className="item-details">
                                                            <h4>{item.name}</h4>
                                                            <div className="item-meta">
                                                                <div className="quantity-controls">
                                                                    <button 
                                                                        className="quantity-btn"
                                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    >
                                                                        <FontAwesomeIcon icon={faMinus} />
                                                                    </button>
                                                                    <span className="quantity">{item.quantity}</span>
                                                                    <button 
                                                                        className="quantity-btn"
                                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                        disabled={item.quantity >= product.stock}
                                                                    >
                                                                        <FontAwesomeIcon icon={faPlus} />
                                                                    </button>
                                                                </div>
                                                                <span className="item-subtotal">{(item.discountedPrice * item.quantity)} dt</span>
                                                            </div>
                                                            {product.variants && (
                                                                <div className="item-variants">
                                                                    {product.variants.join(", ")}
                                                                </div>
                                                            )}
                                                            <button 
                                                                className="remove-item-btn"
                                                                onClick={() => removeFromCart(item.id)}
                                                            >
                                                                <FontAwesomeIcon icon={faTimes} /> Supprimer
                                                            </button>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>

                                <div className="cart-summary">
                                    <div className="total-section">
                                        <span>Total:</span>
                                        <span className="total-amount">{total} dt</span>
                                    </div>
                                    
                                    <button 
                                        className="checkout-btn" 
                                        disabled={cart.length === 0}
                                        onClick={() => navigate('/checkout', { state: { cart, total } })}
                                    >
                                        Passer la commande
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && selectedProduct && (
                <ProductModal
                    selectedProduct={{
                        id: selectedProduct.id,
                        name: selectedProduct.name,
                        discountedPrice: selectedProduct.discountedPrice,
                        price: selectedProduct.price,
                        primaryImage: selectedProduct.primaryImage || getProductImage(selectedProduct),
                        brand: selectedProduct.brand,
                        description: selectedProduct.description,
                        stock: selectedProduct.stock,
                        category: selectedProduct.category,
                        sku: selectedProduct.sku,
                        discounteddiscountedPrice: selectedProduct.discounteddiscountedPrice,
                        secondaryImages: selectedProduct.secondaryImages,
                        variants: selectedProduct.variants
                    }}
                    closeModal={closeModal}
                    addToCart={(productWithQuantity) => {
                        addToCart(productWithQuantity);
                    }}
                    isDarkMode={isDarkMode}
                />
            )}
        </div>
    );
};

export default Client;
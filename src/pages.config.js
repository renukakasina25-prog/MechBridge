/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AdminLogoGen from './pages/AdminLogoGen.jsx';
import AdminOrders from './pages/AdminOrders.jsx';
import Cart from './pages/Cart.jsx';
import Catalog from './pages/Catalog.jsx';
import Checkout from './pages/Checkout.jsx';
import Deals from './pages/Deals.jsx';
import Home from './pages/Home.jsx';
import LocationFinder from './pages/LocationFinder.jsx';
import MyOrders from './pages/MyOrders.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import Profile from './pages/Profile.jsx';
import QRGenerator from './pages/QRGenerator.jsx';
import Scanner from './pages/Scanner.jsx';
import Wishlist from './pages/Wishlist.jsx';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AdminLogoGen": AdminLogoGen,
    "AdminOrders": AdminOrders,
    "Cart": Cart,
    "Catalog": Catalog,
    "Checkout": Checkout,
    "Deals": Deals,
    "Home": Home,
    "LocationFinder": LocationFinder,
    "MyOrders": MyOrders,
    "OrderConfirmation": OrderConfirmation,
    "Profile": Profile,
    "QRGenerator": QRGenerator,
    "Scanner": Scanner,
    "Wishlist": Wishlist,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
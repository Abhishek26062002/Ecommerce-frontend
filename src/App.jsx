import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MachineryBasketSidebar from './components/MachineryBasketSidebar';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Machinery from './pages/Machinery';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Account from './pages/Account';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import RefundPolicy from './pages/RefundPolicy';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import { useEffect, useState } from 'react';
import GoogleCallback from './pages/GoogleCallback';
import Orders from './pages/Orders';
import Machines from './pages/Machines';
import IntroScreen from './pages/Introscreen';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);

  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // hide intro after video/gif duration
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3500); // change to your gif/video exact duration

    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Header openLogin={openLogin} />
        <main className="flex-1">
          <Routes>
            <Route path="*" element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/callback" element={<GoogleCallback />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/machinery" element={<Machinery />} />
            <Route path="/machines" element={<Machines />} />
            <Route path="/cart" element={<Cart openLogin={openLogin}/>} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/account" element={<Account />} />
            <Route path="/orders" element={<Orders openLogin={openLogin} />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failed" element={<PaymentFailed />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms-and-conditions" element={<Terms />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
          </Routes>
        </main>
        <Footer />
        <MachineryBasketSidebar />
        {showLogin && <Login onClose={() => setShowLogin(false)} />}

        {showIntro && <IntroScreen />}
      </div>
    </Router>
  );
}

export default App;
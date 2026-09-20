import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import InfoPage from './pages/InfoPage';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="flex flex-col h-full" style={{ minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:category" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<Admin />} />
            {/* Informational Pages */}
            <Route path="/about" element={<InfoPage title="About Us" />} />
            <Route path="/contact" element={<InfoPage title="Contact Us" />} />
            <Route path="/faq" element={<InfoPage title="FAQ" />} />
            <Route path="/shipping" element={<InfoPage title="Shipping Policy" />} />
            <Route path="/returns" element={<InfoPage title="Return & Refund Policy" />} />
            <Route path="/privacy" element={<InfoPage title="Privacy Policy" />} />
            <Route path="/terms" element={<InfoPage title="Terms & Conditions" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

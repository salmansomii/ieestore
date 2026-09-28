import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loading pages
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const InfoPage = lazy(() => import('./pages/InfoPage'));
const Admin = lazy(() => import('./pages/Admin'));
const Account = lazy(() => import('./pages/Account'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Simple loading fallback
const PageLoader = () => (
  <div className="flex justify-center items-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
  </div>
);

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="flex flex-col h-full min-h-screen">
          <Header />
          <main className="flex-1">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:category" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/account" element={<Account />} />
                
                {/* Informational Pages */}
                <Route path="/about" element={<InfoPage title="About Us" />} />
                <Route path="/contact" element={<InfoPage title="Contact Us" />} />
                <Route path="/faq" element={<InfoPage title="FAQ" />} />
                <Route path="/shipping" element={<InfoPage title="Shipping Policy" />} />
                <Route path="/returns" element={<InfoPage title="Return & Refund Policy" />} />
                <Route path="/privacy" element={<InfoPage title="Privacy Policy" />} />
                <Route path="/terms" element={<InfoPage title="Terms & Conditions" />} />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;

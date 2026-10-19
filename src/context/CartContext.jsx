import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('taicon_cart') || localStorage.getItem('trendkids_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  useEffect(() => {
    try {
      localStorage.setItem('taicon_cart', JSON.stringify(cart));
    } catch {
      // storage unavailable or full
    }
  }, [cart]);

  const addToCart = (product, quantity = 1, variation = null) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.product.id === product.id && JSON.stringify(item.variation) === JSON.stringify(variation)
      );

      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        return [...prevCart, { product, quantity, variation }];
      }
    });
    showToast(`Added "${product.name}" to your cart!`);
  };

  const removeFromCart = (productId, variation = null) => {
    setCart(prevCart => 
      prevCart.filter(item => !(item.product.id === productId && JSON.stringify(item.variation) === JSON.stringify(variation)))
    );
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId, variation, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product.id === productId && JSON.stringify(item.variation) === JSON.stringify(variation)) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartSubtotal,
      toast,
      showToast
    }}>
      {children}
      {toast && (
        <div className="app-toast">
          <span>✓</span>
          <span>{toast.message}</span>
        </div>
      )}
    </CartContext.Provider>
  );
};

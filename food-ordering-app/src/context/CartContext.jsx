import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (err) {
        console.error('Failed to load cart data:', err);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item, toastCallback) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === item.id);
      if (existing) {
        if (toastCallback) toastCallback(`Increased ${item.name} quantity in cart!`, 'success');
        return prevItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      if (toastCallback) toastCallback(`${item.name} added to cart!`, 'success');
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta, toastCallback) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((i) => i.id === id);
      if (!item) return prevItems;

      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        if (toastCallback) toastCallback(`${item.name} removed from cart.`, 'info');
        return prevItems.filter((i) => i.id !== id);
      }
      return prevItems.map((i) => (i.id === id ? { ...i, quantity: newQty } : i));
    });
  };

  const removeFromCart = (id, toastCallback) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((i) => i.id === id);
      if (item && toastCallback) {
        toastCallback(`${item.name} removed from cart.`, 'info');
      }
      return prevItems.filter((i) => i.id !== id);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 40.00 : 0;
  const totalAmount = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartItemsCount,
        subtotal,
        deliveryFee,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

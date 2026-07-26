// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [currentRestaurant, setCurrentRestaurant] = useState(null);

  // Restore cart state from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('food_app_cart');
    const savedRestaurant = localStorage.getItem('food_app_cart_restaurant');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (err) {
        console.error('Failed to parse cart items:', err);
      }
    }
    if (savedRestaurant) {
      try {
        setCurrentRestaurant(JSON.parse(savedRestaurant));
      } catch (err) {
        console.error('Failed to parse restaurant info:', err);
      }
    }
  }, []);

  // Save cart state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('food_app_cart', JSON.stringify(cartItems));
    if (currentRestaurant) {
      localStorage.setItem('food_app_cart_restaurant', JSON.stringify(currentRestaurant));
    } else {
      localStorage.removeItem('food_app_cart_restaurant');
    }
  }, [cartItems, currentRestaurant]);

  const addToCart = (item, restaurantInfo = null) => {
    // Single restaurant restriction check
    if (cartItems.length > 0 && currentRestaurant && restaurantInfo && currentRestaurant.id !== restaurantInfo.id) {
      const confirmReplace = window.confirm(
        `Your cart contains items from "${currentRestaurant.name}". Would you like to clear your cart and add items from "${restaurantInfo.name}"?`
      );
      if (!confirmReplace) return false;
      
      // Clear previous items and start fresh with new restaurant
      setCartItems([{ ...item, quantity: 1 }]);
      setCurrentRestaurant(restaurantInfo);
      return true;
    }

    if (restaurantInfo && (!currentRestaurant || cartItems.length === 0)) {
      setCurrentRestaurant(restaurantInfo);
    }

    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === item.id);
      if (existing) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
    return true;
  };

  const updateQuantity = (itemId, delta) => {
    setCartItems((prevItems) => {
      const updated = prevItems
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);

      if (updated.length === 0) {
        setCurrentRestaurant(null);
      }
      return updated;
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => {
      const updated = prevItems.filter((i) => i.id !== itemId);
      if (updated.length === 0) {
        setCurrentRestaurant(null);
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setCurrentRestaurant(null);
    localStorage.removeItem('food_app_cart');
    localStorage.removeItem('food_app_cart_restaurant');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (Number(item.price) || 0) * item.quantity, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        currentRestaurant,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getItemCount,
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

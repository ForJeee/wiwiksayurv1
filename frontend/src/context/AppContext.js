import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([
    { id: 1, name: 'Bayam Segar', price: 5000, unit: 'ikat', category: 'Sayuran', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500', stock: 20 },
    { id: 2, name: 'Wortel Berastagi', price: 12000, unit: 'kg', category: 'Sayuran', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500', stock: 50 },
    { id: 3, name: 'Apel Fuji', price: 35000, unit: 'kg', category: 'Buah-buahan', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?w=500', stock: 30 },
  ]);
  const [categories, setCategories] = useState(['Semua', 'Sayuran', 'Buah-buahan', 'Bumbu Dapur', 'Rempah', 'Organik']);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    // Mock user session load
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        products,
        categories,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

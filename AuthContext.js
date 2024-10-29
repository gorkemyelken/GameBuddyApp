import React, { createContext, useContext, useState } from 'react';

// Auth bağlamını oluştur
const AuthContext = createContext();

// Auth sağlayıcısı
export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null); // Başlangıçta kullanıcı verisi yok

  return (
    <AuthContext.Provider value={{ userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

// Auth bağlamını kullanmak için özel bir hook
export const useAuth = () => {
  return useContext(AuthContext);
};

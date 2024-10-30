import React, { createContext, useContext, useState } from 'react';

// Auth bağlamını oluştur
const AuthContext = createContext();

// Auth sağlayıcısı
export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null); // Başlangıçta kullanıcı verisi yok

  const updateUserData = (newData) => {
    setUserData((prevData) => ({ ...prevData, ...newData })); // Kullanıcı verilerini güncelle
  };

  const logout = () => {
    setUserData(null); // Kullanıcıyı çıkış yaptır
  };

  return (
    <AuthContext.Provider value={{ userData, updateUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Auth bağlamını kullanmak için özel bir hook
export const useAuth = () => {
  return useContext(AuthContext);
};

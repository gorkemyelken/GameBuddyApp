import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null); 

  const updateUserData = (newData) => {
    setUserData((prevData) => ({ ...prevData, ...newData })); 
  };

  const logout = () => {
    setUserData(null); 
  };

  return (
    <AuthContext.Provider value={{ userData, updateUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

import React, { createContext, useContext } from 'react';
import { useAuth as useFirebaseAuth } from '../hooks/useAuth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const auth = useFirebaseAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
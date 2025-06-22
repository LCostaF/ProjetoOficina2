import { createContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const getToken = useCallback(async (firebaseUser) => {
    if (!firebaseUser) {
      setToken(null);
      return null;
    }

    try {
      const idToken = await firebaseUser.getIdToken();
      setToken(idToken);
      return idToken;
    } catch (error) {
      setToken(null);
      setError(error);
      return null;
    }
  }, []);

  const refreshToken = useCallback(async () => {
    if (user) {
      try {
        const idToken = await user.getIdToken(true);
        setToken(idToken);
        return idToken;
      } catch (error) {
        setError(error);
        return null;
      }
    }
    return null;
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await getToken(firebaseUser);
      } else {
        setUser(null);
        setToken(null);
      }

      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [getToken]);

  const authContextValue = {
    user,
    loading,
    token,
    refreshToken,
    isAuthenticated: !!user,
    error
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}
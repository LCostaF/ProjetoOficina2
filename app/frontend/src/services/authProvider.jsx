import { createContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";
import logger from "@/utils/logger";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const getFirebaseToken = useCallback(async (firebaseUser) => {
    if (!firebaseUser) {
      setToken(null);
      logger.auth("getFirebaseToken: Nenhum usuário Firebase. Token limpo.");
      return null;
    }

    try {
      logger.auth("getFirebaseToken: Tentando obter ID Token...");
      const idToken = await firebaseUser.getIdToken();
      setToken(idToken);
      logger.auth(`getFirebaseToken: ID Token obtido e salvo: ${idToken.substring(0, 10)}...`);
      return idToken;
    } catch (error) {
      setToken(null);
      setError(error);
      logger.error("getFirebaseToken: Erro ao obter ID Token:", error);
      return null;
    }
  }, []);

  const refreshToken = useCallback(async () => {
    if (user) {
      try {
        logger.auth("refreshToken: Tentando refrescar token...");
        const idToken = await user.getIdToken(true);
        setToken(idToken);
        logger.auth(`refreshToken: Token refrescado com sucesso: ${idToken.substring(0, 10)}...`);
        return idToken;
      } catch (error) {
        setError(error);
        logger.error("refreshToken: Erro ao refrescar token:", error);
        setUser(null);
        setToken(null);
        return null;
      }
    }
    logger.auth("refreshToken: Nenhum usuário logado para refrescar token.");
    return null;
  }, [user]);

  useEffect(() => {
    logger.auth("AuthProvider useEffect: onAuthStateChanged listener ativado.");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      logger.auth("onAuthStateChanged: Callback disparado.", { firebaseUser: !!firebaseUser });
      if (firebaseUser) {
        setUser(firebaseUser);
        setError(null); 

        await getFirebaseToken(firebaseUser);
      } else {
        setUser(null);
        setToken(null);
        setError(null);
        logger.auth("onAuthStateChanged: Nenhum usuário logado.");
      }
      setLoading(false);
      logger.auth("onAuthStateChanged: Carregamento de autenticação concluído (setLoading(false)).", { loading: false });
    });

    return () => {
      unsubscribe();
      logger.auth("AuthProvider useEffect: onAuthStateChanged listener desativado.");
    };
  }, [getFirebaseToken]);

  const authContextValue = {
    user,
    loading,
    token,
    refreshToken,
    isAuthenticated: !!user,
    error
  };

  logger.debug("AuthProvider: Renderizando com estado", {
    user: authContextValue.user?.uid || 'null',
    loading: authContextValue.loading,
    token: authContextValue.token ? `${authContextValue.token.substring(0, 10)}...` : 'null',
    isAuthenticated: authContextValue.isAuthenticated
  });

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}
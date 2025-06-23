// app\frontend\src\services\authProvider.jsx
import { createContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";
import logger from "@/utils/logger"; // Importar o logger

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Indica se o estado de autenticação está sendo carregado
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  // Função para obter o token JWT do Firebase User
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

  // Função para refrescar o token (usada pelo apiService)
  const refreshToken = useCallback(async () => {
    if (user) {
      try {
        logger.auth("refreshToken: Tentando refrescar token...");
        const idToken = await user.getIdToken(true); // Força um refresh do token
        setToken(idToken);
        logger.auth(`refreshToken: Token refrescado com sucesso: ${idToken.substring(0, 10)}...`);
        return idToken;
      } catch (error) {
        setError(error);
        logger.error("refreshToken: Erro ao refrescar token:", error);
        // Em caso de erro ao refrescar, desloga o usuário
        setUser(null);
        setToken(null);
        return null;
      }
    }
    logger.auth("refreshToken: Nenhum usuário logado para refrescar token.");
    return null;
  }, [user]);

  // Efeito principal para monitorar o estado de autenticação do Firebase
  useEffect(() => {
    logger.auth("AuthProvider useEffect: onAuthStateChanged listener ativado.");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      logger.auth("onAuthStateChanged: Callback disparado.", { firebaseUser: !!firebaseUser });
      if (firebaseUser) {
        setUser(firebaseUser);
        setError(null); // Limpar erros anteriores
        // Tenta obter o token imediatamente. Se falhar, o token será null.
        await getFirebaseToken(firebaseUser);
      } else {
        setUser(null);
        setToken(null); // Garante que o token é null se não houver usuário
        setError(null);
        logger.auth("onAuthStateChanged: Nenhum usuário logado.");
      }
      setLoading(false); // A autenticação foi resolvida, independentemente do resultado
      logger.auth("onAuthStateChanged: Carregamento de autenticação concluído (setLoading(false)).", { loading: false });
    });

    // Função de limpeza para desinscrever o listener
    return () => {
      unsubscribe();
      logger.auth("AuthProvider useEffect: onAuthStateChanged listener desativado.");
    };
  }, [getFirebaseToken]); // Depende apenas de getFirebaseToken

  const authContextValue = {
    user,
    loading, // Estado de carregamento da autenticação
    token, // Token JWT para requisições autenticadas
    refreshToken, // Função para refrescar o token
    isAuthenticated: !!user, // Booleano para fácil verificação de autenticação
    error // Erro de autenticação, se houver
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
import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import logger from "@/utils/logger";

const ApiContext = createContext({});

export const useApi = () => {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error("useApi deve ser usado dentro de um ApiProvider");
  }
  return {
    api: context.apiClient,
    isLoading: context.isLoading,
    error: context.error,
    isInitialized: context.isInitialized,
    isReady: context.isReady,
  };
};

export function ApiProvider({ children }) {
  const { user, token, refreshToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiClient, setApiClient] = useState(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.ellp-exemplo.com/api";

  const createApiClient = useCallback(() => {
    const internalFetchWithAuth = async (endpoint, options = {}) => {
      setIsLoading(true);
      setError(null);

      const headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
        logger.api(`Cliente API: Adicionando token de autenticação: ${token.substring(0, 10)}...`);
      } else {
        logger.api("Cliente API: Sem token disponível.");
      }

      const url = `${apiBaseUrl}${endpoint}`;
      logger.api(`Cliente API: Requisição para ${url}`, { method: options.method || 'GET' });

      let response;
      try {
        response = await fetch(url, {
          ...options,
          headers,
        });

        if (response.status === 401 && refreshToken) {
          logger.warn("Cliente API: Token expirado/inválido. Tentando refresh...");
          const newToken = await refreshToken();
          if (newToken) {
            headers.Authorization = `Bearer ${newToken}`;
            logger.info("Cliente API: Token atualizado. Retentando requisição...");
            response = await fetch(url, {
              ...options,
              headers,
            });
          } else {
            logger.error("Cliente API: Falha ao atualizar token. Redirecionando para login.");
            throw new Error("Sessão expirada. Por favor, faça login novamente.");
          }
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || errorData.message || `Request failed with status ${response.status}`);
        }

        if (response.status === 204 || options.method === "DELETE") {
          return {};
        }

        return response.json();
      } catch (err) {
        setError(err.message);
        logger.error("Cliente API: Falha na requisição", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    };

    return {
      oficinas: {
        getAll: () => internalFetchWithAuth("/oficinas"),
        getById: (id) => internalFetchWithAuth(`/oficinas/${id}`),
        create: (data) => internalFetchWithAuth("/oficinas", {
          method: "POST",
          body: JSON.stringify(data),
        }),
        listarOficinas: (filters = {}) => {
          const params = new URLSearchParams();
          if (filters.dataInicio) params.append('data_inicio', filters.dataInicio);
          if (filters.dataFim) params.append('data_fim', filters.dataFim);
          if (filters.apenasMinha) params.append('apenas_minhas', 'true');
          const queryString = params.toString() ? `?${params.toString()}` : '';
          return internalFetchWithAuth(`/oficinas${queryString}`, { method: 'GET' });
        },
        obterOficina: (oficinaId) => internalFetchWithAuth(`/oficinas/${oficinaId}`, { method: 'GET' }),
        update: (id, data) => internalFetchWithAuth(`/oficinas/${id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        }),
        delete: (id) => internalFetchWithAuth(`/oficinas/${id}`, {
          method: "DELETE",
        }),
        criarOficina: (oficinaData) => internalFetchWithAuth('/oficinas/', {
          method: 'POST',
          body: JSON.stringify(oficinaData),
        }),
      },
      
      participantes: {
        getAll: () => internalFetchWithAuth("/participantes"),
        getById: (id) => internalFetchWithAuth(`/participantes/${id}`),
        create: (data) => internalFetchWithAuth("/participantes", {
          method: "POST",
          body: JSON.stringify(data),
        }),
        update: (id, data) => internalFetchWithAuth(`/participantes/${id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        }),
        delete: (id) => internalFetchWithAuth(`/participantes/${id}`, {
          method: "DELETE",
        }),
      },

      presenca: {
        getByOficina: (oficinaId) => internalFetchWithAuth(`/presenca/oficina/${oficinaId}`),
        registrar: (oficinaId, participanteId, presente) => internalFetchWithAuth("/presenca", {
          method: "POST",
          body: JSON.stringify({ oficinaId, participanteId, presente }),
        }),
      },

      relatorios: {
        presencaPorOficina: (oficinaId) => internalFetchWithAuth(`/relatorios/presenca/${oficinaId}`),
        participantesPorPeriodo: (dataInicio, dataFim) => internalFetchWithAuth(`/relatorios/participantes?inicio=${dataInicio}&fim=${dataFim}`),
      },
    };
  }, [token, refreshToken, apiBaseUrl]);

  useEffect(() => {
    if (token || user === null) {
      const client = createApiClient();
      setApiClient(client);
    }
  }, [token, user, createApiClient]);

  const contextValue = useMemo(() => ({
    apiClient,
    isLoading,
    error,
    isInitialized: true,
    isReady: !!apiClient,
  }), [apiClient, isLoading, error]);

  logger.debug("ApiProvider: Renderizando com estado", {
    inicializado: contextValue.isInitialized,
    carregando: contextValue.isLoading,
    temErro: !!contextValue.error,
    pronto: contextValue.isReady
  });

  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
}
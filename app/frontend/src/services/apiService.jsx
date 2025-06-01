import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";

const ApiContext = createContext({});

export const useApi = () => {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error("useApi deve ser usado dentro de um ApiProvider");
  }

  return context;
};

export function ApiProvider({ children }) {

  const auth = useAuth();
  const { token, refreshToken, user } = auth;

  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiClient, setApiClient] = useState(null);

  //URL for API requests
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.ellp-exemplo.com/api";

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (token) {
      console.log("Bearer token: ", token);
      const client = createApiClient(token, refreshToken, apiBaseUrl);
      setApiClient(client);
    } else {
      setApiClient(null);
    }
  }, [token, refreshToken, apiBaseUrl]);

  // Fetch wrapper with authentication
  const fetchWithAuth = async (endpoint, options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      // Add authorization header if user is logged in
      const headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
      }

      const url = `${apiBaseUrl}${endpoint}`;

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  //API methods
  const api = {
    oficinas: {
      getAll: () => fetchWithAuth("/oficinas"),
      getById: (id) => fetchWithAuth(`/oficinas/${id}`),
      create: (data) => fetchWithAuth("/oficinas", {
        method: "POST",
        body: JSON.stringify(data),
      }),
      update: (id, data) => fetchWithAuth(`/oficinas/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
      delete: (id) => fetchWithAuth(`/oficinas/${id}`, {
        method: "DELETE",
      }),
    },

    // Participantes
    participantes: {
      getAll: () => fetchWithAuth("/participantes"),
      getById: (id) => fetchWithAuth(`/participantes/${id}`),
      create: (data) => fetchWithAuth("/participantes", {
        method: "POST",
        body: JSON.stringify(data),
      }),
      update: (id, data) => fetchWithAuth(`/participantes/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
      delete: (id) => fetchWithAuth(`/participantes/${id}`, {
        method: "DELETE",
      }),
    },

    // Presença
    presenca: {
      getByOficina: (oficinaId) => fetchWithAuth(`/presenca/oficina/${oficinaId}`),
      registrar: (oficinaId, participanteId, presente) => fetchWithAuth("/presenca", {
        method: "POST",
        body: JSON.stringify({ oficinaId, participanteId, presente }),
      }),
    },

    // Relatórios
    relatorios: {
      presencaPorOficina: (oficinaId) => fetchWithAuth(`/relatorios/presenca/${oficinaId}`),
      participantesPorPeriodo: (dataInicio, dataFim) => fetchWithAuth(`/relatorios/participantes?inicio=${dataInicio}&fim=${dataFim}`),
    },
  };

  const contextValue = useMemo(() => ({
    api,
    apiClient, 
    isLoading,
    error,
    isInitialized,
    isReady: !!apiClient && !!token,
  }), [api, apiClient, isLoading, error, isInitialized, token]);

  console.log("ApiProvider: Renderizando com estado", { 
    inicializado: isInitialized, 
    carregando: isLoading, 
    temErro: !!error, 
    pronto: !!apiClient && !!token 
  });

  return <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>;
}

function createApiClient(token, refreshToken, baseUrl) {

  const fetchWithAuth = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      console.log("Cliente API: Adicionando token de autenticação");
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.log("Cliente API: Sem token disponível");
    }

    const fetchOptions = {
      ...options,
      headers,
    };

    try {
      const url = `${baseUrl}${endpoint}`;
      console.log(`Cliente API: Requisição para ${url}`, { method: options.method || 'GET' });
      const response = await fetch(url, fetchOptions);

      if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          headers.Authorization = `Bearer ${newToken}`;
          return fetch(url, {
            ...options,
            headers,
          });
        } else {
          console.warn("Cliente API: Falha ao atualizar token");
        }
      }

      return response;
    } catch (error) {
      console.error("Cliente API: Falha na requisição", error);
      throw error;
    }
  };

  const oficinasApi = {
    listarOficinas: async (filters = {}) => {
      const params = new URLSearchParams();

      if (filters.dataInicio) {
        params.append('data_inicio', filters.dataInicio);
      }

      if (filters.dataFim) {
        params.append('data_fim', filters.dataFim);
      }

      if (filters.apenasMinha) {
        params.append('apenas_minhas', 'true');
      }

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await fetchWithAuth(`/oficinas${queryString}`, {
        method: 'GET',
      });

      return response.json();
    },

    criarOficina: async (oficinaData) => {
      const response = await fetchWithAuth('/oficinas/', {
        method: 'POST',
        body: JSON.stringify(oficinaData),
      });

      return response.json();
    },

    obterOficina: async (oficinaId) => {
      const response = await fetchWithAuth(`/oficinas/${oficinaId}`, {
        method: 'GET',
      });
      
      return response.json();
    },
  };


  return {
    oficinas: oficinasApi,
  };
}

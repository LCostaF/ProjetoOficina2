import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";

// Create API context
const ApiContext = createContext({});

export function ApiProvider({ children }) {
  const { token, refreshToken, user } = useAuth();
  const [apiClient, setApiClient] = useState(null);

  // Create API client when token becomes available
  useEffect(() => {
    console.log("ApiProvider: Token changed", !!token);
    
    if (token) {
      console.log("Bearer token:", token); // This line prints the token
      const client = createApiClient(token, refreshToken);
      setApiClient(client);
    } else {
      setApiClient(null);
    }
  }, [token, refreshToken]);

  // Create a memoized value to avoid unnecessary renders
  const contextValue = useMemo(() => ({
    apiClient,
    isReady: !!apiClient && !!token,
  }), [apiClient, token]);

  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  return useContext(ApiContext);
}

// Create an API client with authorization headers
function createApiClient(token, refreshToken) {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  // Function to handle API requests with automatic token refreshing
  const fetchWithAuth = async (endpoint, options = {}) => {
  // Set default headers with authorization token
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Only add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions = {
    ...options,
    headers,
  };

  try {
    console.log(`API Request: ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
    
    // Handle token expiration (401 Unauthorized)
    if (response.status === 401) {
      console.log("Token expired, attempting refresh");
      // Try to refresh the token
      const newToken = await refreshToken();
      if (newToken) {
        console.log("Token refreshed, retrying request");
        // Retry with new token
        headers.Authorization = `Bearer ${newToken}`;
        return fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
        });
      } else {
        console.log("Token refresh failed");
        // You might want to redirect to login here
      }
    }
    
    return response;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
  };

  // API methods for oficinas (workshops)
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
    
    adicionarInstrutor: async (oficinaId, instrutorId) => {
      const response = await fetchWithAuth(`/oficinas/${oficinaId}/instrutores`, {
        method: 'PUT',
        body: JSON.stringify({ instrutor_id: instrutorId }),
      });
      
      return response.json();
    },
    
    removerInstrutor: async (oficinaId, instrutorId) => {
      const response = await fetchWithAuth(`/oficinas/${oficinaId}/instrutores/${instrutorId}`, {
        method: 'DELETE',
      });
      
      return response.json();
    },
    
    excluirOficina: async (oficinaId) => {
      const response = await fetchWithAuth(`/oficinas/${oficinaId}`, {
        method: 'DELETE',
      });
      
      return response.json();
    },
  };

  // Return all API methods
  return {
    oficinas: oficinasApi,
    // Add other API modules here as needed
  };
}
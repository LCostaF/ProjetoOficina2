import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import logger from "@/utils/logger";

const ApiContext = createContext({});

export const useApi = () => {
  const context = useContext(ApiContext);

  if (!context) {
    console.error("ApiContext não encontrado. Verifique se ApiProvider está envolvendo seu componente.");
    throw new Error("useApi deve ser usado dentro de um ApiProvider");
  }
  return {
    api: context.apiClient,
    isLoading: context.isLoading,
    error: context.error,
    isReady: context.isReady,
    loadingApi: context.loadingApi,
  };
};

export function ApiProvider({ children }) {
  const { user, token, loading: authLoading, refreshToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiClient, setApiClient] = useState(null);
  const [loadingApi, setLoadingApi] = useState(true);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const createApiClient = useCallback(() => {
    logger.debug("createApiClient: Construindo ou reconstruindo cliente API.", {
      tokenPresent: !!token,
      userPresent: !!user,
      authLoadingState: authLoading
    });

    const internalFetchWithAuth = async (endpoint, options = {}) => {
      setIsLoading(true);
      setError(null);

      const headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      if (token) {
        logger.api(`[API FETCH] Usando token: ${token.substring(0, 10)}...`);
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        logger.api("[API FETCH] Sem token disponível para esta requisição.");
      }

      const url = `${apiBaseUrl}${endpoint}`;
      logger.api(`[API FETCH] Iniciando requisição para ${url}`, { method: options.method || 'GET' });

      let response;
      try {
        response = await fetch(url, {
          ...options,
          headers,
        });

        if (response.status === 401 && refreshToken && user) {
          logger.warn("[API FETCH] Token expirado/inválido. Tentando refresh.");
          const newToken = await refreshToken();
          if (newToken) {
            headers.Authorization = `Bearer ${newToken}`;
            logger.info("[API FETCH] Token refrescado. Retentando requisição.");
            response = await fetch(url, {
              ...options,
              headers,
            });
          } else {
            logger.error("[API FETCH] Falha ao refrescar token. Sessão expirada.");
            throw new Error("Sessão expirada. Por favor, faça login novamente.");
          }
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.detail || errorData.message || `Request failed with status ${response.status}`;
          logger.error(`[API FETCH] Erro na resposta: ${errorMessage}`, errorData);
          throw new Error(errorMessage);
        }

        if (response.status === 204 || options.method === "DELETE") {
          logger.api(`[API FETCH] Requisição ${options.method} para ${url} concluída com 204.`);
          return {};
        }

        const data = await response.json();
        logger.api(`[API FETCH] Requisição para ${url} concluída com sucesso.`, data);
        return data;
      } catch (err) {
        setError(err.message);
        logger.error("[API FETCH] Erro na execução da requisição:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    };

    return {
      oficinas: {
        getAll: () => internalFetchWithAuth("/oficinas"),
        getById: (id) => internalFetchWithAuth(`/oficinas/${id}`),
        create: (data) => internalFetchWithAuth("/oficinas", { method: "POST", body: JSON.stringify(data) }),
        listarOficinas: (filters = {}) => {
          const params = new URLSearchParams();
          if (filters.dataInicio) params.append('data_inicio', filters.dataInicio);
          if (filters.dataFim) params.append('data_fim', filters.dataFim);
          if (filters.apenasMinha) params.append('apenas_minhas', 'true');
          const queryString = params.toString() ? `?${params.toString()}` : '';
          return internalFetchWithAuth(`/oficinas${queryString}`, { method: 'GET' });
        },
        obterOficina: (oficinaId) => internalFetchWithAuth(`/oficinas/${oficinaId}`, { method: 'GET' }),
        update: (id, data) => internalFetchWithAuth(`/oficinas/${id}`, { method: "PUT", body: JSON.stringify(data) }),
        delete: (id) => internalFetchWithAuth(`/oficinas/${id}`, { method: "DELETE" }),
        criarOficina: (oficinaData) => internalFetchWithAuth('/oficinas/', { method: 'POST', body: JSON.stringify(oficinaData) }),
      },

      participantes: {
        getAll: () => internalFetchWithAuth("/participantes"),
        getById: (id) => internalFetchWithAuth(`/participantes/${id}`),
        create: (data) => internalFetchWithAuth("/participantes", { method: "POST", body: JSON.stringify(data) }),
        update: (id, data) => internalFetchWithAuth(`/participantes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
        delete: (id) => internalFetchWithAuth(`/participantes/${id}`, { method: "DELETE" }),
      },

      inscricoes: {
        inscrever: (oficinaId, participanteId) => internalFetchWithAuth("/inscricoes/", {
          method: "POST",
          body: JSON.stringify({ oficina_id: oficinaId, participante_id: participanteId }),
        }),
        listarParticipantesInscritos: (oficinaId) => internalFetchWithAuth(`/inscricoes/oficina/${oficinaId}/participantes`),
        listarOficinasInscritas: (participanteId) => internalFetchWithAuth(`/inscricoes/participante/${participanteId}/oficinas`),
        removerInscricao: (inscricaoId) => internalFetchWithAuth(`/inscricoes/${inscricaoId}`, {
          method: "DELETE",
        }),
      },

      presencas: {
        registrar: (oficinaId, data, participantesIds) =>
          internalFetchWithAuth("/presencas", {
            method: "POST",
            body: JSON.stringify({
              oficina_id: oficinaId,
              data,
              participantes_presentes: participantesIds
            })
          }),
        listarPorOficina: (oficinaId) =>
          internalFetchWithAuth(`/presencas/oficina/${oficinaId}`),
        // NOVA FUNÇÃO AQUI
        obterPorOficinaEData: (oficinaId, data) =>
          internalFetchWithAuth(`/presencas/oficina/${oficinaId}/data/${data}`)
      }
    };
  }, [token, refreshToken, apiBaseUrl, user]);

  useEffect(() => {
    logger.debug("ApiProvider useEffect de inicialização: Estado de autenticação mudou.", {
      authLoading,
      user: user ? user.uid : 'null',
      token: token ? `${token.substring(0, 10)}...` : 'null',
    });

    setLoadingApi(true);

    if (authLoading) {
      setApiClient(null);
      return;
    }

    if (user === null) {
      logger.info("ApiProvider: Usuário não logado. Criando apiClient para acesso público.");
      setApiClient(createApiClient());
      setLoadingApi(false);
    } else if (user && token) {
      logger.info("ApiProvider: Usuário logado e token disponível. Criando apiClient autenticado.");
      setApiClient(createApiClient());
      setLoadingApi(false);
    } else {
      logger.warn("ApiProvider: Usuário logado, mas token indisponível. Mantendo apiClient nulo e API em loading.");
      setApiClient(null);
    }

  }, [authLoading, user, token, createApiClient]);

  const contextValue = useMemo(() => ({
    apiClient,
    isLoading,
    error,
    isReady: !loadingApi && !!apiClient,
    loadingApi: loadingApi
  }), [apiClient, isLoading, error, loadingApi]);

  logger.debug("ApiProvider: Renderizando com estado final do contexto.", {
    carregandoApi: contextValue.loadingApi,
    carregandoRequisicao: contextValue.isLoading,
    temErro: !!contextValue.error,
    prontoParaUso: contextValue.isReady,
    apiClientDefined: !!contextValue.apiClient
  });

  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
}
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUserPlus, FiTrash2, FiSearch } from "react-icons/fi";
import { useApi } from "@/services/apiService";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import "@/styles/global.css";
import "@/styles/gerenciarInscricoes.css"; // Novo arquivo de estilo

const MySwal = withReactContent(Swal);

export default function GerenciarInscricoes() {
  const navigate = useNavigate();
  const { api, isLoading: apiLoading, isReady } = useApi();

  const [oficinas, setOficinas] = useState([]);
  const [participantesDisponiveis, setParticipantesDisponiveis] = useState([]);
  const [participantesInscritos, setParticipantesInscritos] = useState([]); // Participantes já inscritos na oficina selecionada

  const [selectedOficinaId, setSelectedOficinaId] = useState("");
  const [selectedParticipanteToAdd, setSelectedParticipanteToAdd] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingContent, setLoadingContent] = useState(false);
  const [searchTermParticipante, setSearchTermParticipante] = useState("");

  // 1. Carregar todas as oficinas
  useEffect(() => {
    const fetchOficinas = async () => {
      setErrorMessage("");
      if (!isReady || !api.oficinas) return;
      try {
        const data = await api.oficinas.listarOficinas();
        setOficinas(data);
      } catch (err) {
        console.error("Erro ao carregar oficinas:", err);
        setErrorMessage("Erro ao carregar oficinas. Tente novamente.");
      }
    };
    fetchOficinas();
  }, [api, isReady]);

  // 2. Carregar todos os participantes
  useEffect(() => {
    const fetchParticipantes = async () => {
      setErrorMessage("");
      if (!isReady || !api.participantes) return;
      try {
        const data = await api.participantes.getAll();
        setParticipantesDisponiveis(data);
      } catch (err) {
        console.error("Erro ao carregar participantes:", err);
        setErrorMessage("Erro ao carregar participantes. Tente novamente.");
      }
    };
    fetchParticipantes();
  }, [api, isReady]);

  // 3. Carregar participantes inscritos quando uma oficina é selecionada
  useEffect(() => {
    const fetchParticipantesInscritos = async () => {
      if (!selectedOficinaId || !isReady || !api.inscricoes) {
        setParticipantesInscritos([]);
        return;
      }
      setLoadingContent(true);
      setErrorMessage("");
      try {
        // Este endpoint agora retorna os dados completos dos participantes E o ID da inscrição
        const data = await api.inscricoes.listarParticipantesInscritos(selectedOficinaId);
        setParticipantesInscritos(data);
      } catch (err) {
        console.error("Erro ao carregar participantes inscritos:", err);
        setErrorMessage("Erro ao carregar participantes inscritos. Selecione a oficina novamente.");
      } finally {
        setLoadingContent(false);
      }
    };
    fetchParticipantesInscritos();
  }, [selectedOficinaId, api, isReady]);

  const handleInscreverParticipante = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!selectedOficinaId || !selectedParticipanteToAdd) {
      setErrorMessage("Por favor, selecione uma oficina e um participante.");
      return;
    }
    if (!isReady || !api.inscricoes) {
      setErrorMessage("API ainda não está pronta. Tente novamente.");
      return;
    }

    try {
      await api.inscricoes.inscrever(selectedOficinaId, selectedParticipanteToAdd);
      setSuccessMessage("Participante inscrito com sucesso!");
      // Atualizar a lista de inscritos após a inscrição
      const updatedInscritos = await api.inscricoes.listarParticipantesInscritos(selectedOficinaId);
      setParticipantesInscritos(updatedInscritos);
      setSelectedParticipanteToAdd(""); // Limpar o select após a inscrição
    } catch (err) {
      console.error("Erro ao inscrever participante:", err);
      const msg = err.message || "Erro ao inscrever participante. Tente novamente.";
      setErrorMessage(msg);
    }
  };

  const handleRemoverInscricao = async (participanteId, inscricaoId) => { // Agora recebemos inscricaoId
    MySwal.fire({
      title: 'Tem certeza?',
      text: `Remover a inscrição de ${participantesDisponiveis.find(p => p.id === participanteId)?.nome} desta oficina?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, remover!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setErrorMessage("");
        setSuccessMessage("");
        if (!isReady || !api.inscricoes) {
            setErrorMessage("API ainda não está pronta.");
            return;
        }
        try {
          await api.inscricoes.removerInscricao(inscricaoId); // Use a ID da inscrição aqui
          setSuccessMessage("Inscrição removida com sucesso!");
          // Atualizar a lista de inscritos
          const updatedInscritos = await api.inscricoes.listarParticipantesInscritos(selectedOficinaId);
          setParticipantesInscritos(updatedInscritos);
        } catch (err) {
          console.error("Erro ao remover inscrição:", err);
          setErrorMessage(err.message || "Erro ao remover inscrição. Tente novamente.");
        }
      }
    });
  };

  const filteredParticipantesDisponiveis = useMemo(() => {
    const inscritosIds = new Set(participantesInscritos.map(p => p.id));
    return participantesDisponiveis.filter(p =>
      !inscritosIds.has(p.id) && // Não mostrar quem já está inscrito
      (p.nome.toLowerCase().includes(searchTermParticipante.toLowerCase()) ||
       (p.cpf && p.cpf.includes(searchTermParticipante)))
    );
  }, [participantesDisponiveis, participantesInscritos, searchTermParticipante]);

  // --- Renderização ---
  if (apiLoading && !isReady) {
    return (
      <div className="gerenciar-inscricoes-container loading-state">
        <div className="spinner-container">
          <span className="spinner"></span>
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gerenciar-inscricoes-container">
      <header className="gerenciar-inscricoes-header">
        <div className="header-left">
          <button onClick={() => navigate("/")} className="back-button">
            <FiArrowLeft size={20} /> Voltar
          </button>
          <h2>Gerenciar Inscrições</h2>
        </div>
      </header>

      <main className="gerenciar-inscricoes-content">
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="inscricao-section">
          <h3>Inscriba Participantes em Oficinas</h3>
          <div className="form-group">
            <label htmlFor="oficinaSelect">Selecionar Oficina</label>
            <select
              id="oficinaSelect"
              value={selectedOficinaId}
              onChange={(e) => setSelectedOficinaId(e.target.value)}
              disabled={apiLoading || loadingContent}
              className="select-oficina"
            >
              <option value="">-- Selecione uma Oficina --</option>
              {oficinas.map((oficina) => (
                <option key={oficina.id} value={oficina.id}>
                  {oficina.titulo} - {oficina.data}
                </option>
              ))}
            </select>
          </div>

          {selectedOficinaId && (
            <>
              <div className="form-group">
                <label htmlFor="participanteSelect">Adicionar Participante</label>
                <div className="search-and-select-group">
                  <input
                    type="text"
                    placeholder="Buscar participante para adicionar..."
                    value={searchTermParticipante}
                    onChange={(e) => setSearchTermParticipante(e.target.value)}
                    className="search-input"
                    disabled={loadingContent}
                  />
                  <select
                    id="participanteSelect"
                    value={selectedParticipanteToAdd}
                    onChange={(e) => setSelectedParticipanteToAdd(e.target.value)}
                    disabled={loadingContent}
                    className="select-participante"
                  >
                    <option value="">-- Selecione um Participante --</option>
                    {filteredParticipantesDisponiveis.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome} ({p.cpf})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleInscreverParticipante}
                    disabled={loadingContent || !selectedOficinaId || !selectedParticipanteToAdd}
                    className="add-button"
                  >
                    <FiUserPlus /> Inserir
                  </button>
                </div>
              </div>

              <h4 className="section-title">Participantes Inscritos nesta Oficina</h4>
              {loadingContent ? (
                <div className="loading-indicator">
                  <span className="spinner"></span>
                  <p>Carregando participantes inscritos...</p>
                </div>
              ) : participantesInscritos.length === 0 ? (
                <p className="no-data-message">Nenhum participante inscrito nesta oficina ainda.</p>
              ) : (
                <div className="inscritos-list">
                  {participantesInscritos.map((inscrito) => (
                    <div key={inscrito.id} className="inscrito-item">
                      <span>{inscrito.nome} ({inscrito.cpf})</span>
                      <button
                        type="button"
                        onClick={() => handleRemoverInscricao(inscrito.id, inscrito.inscricao_id)} // Passa a ID do participante E o ID da inscrição
                        className="remove-button"
                        disabled={loadingContent}
                      >
                        <FiTrash2 /> Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
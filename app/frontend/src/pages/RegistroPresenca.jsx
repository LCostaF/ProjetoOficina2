// app/frontend/src/pages/RegistroPresenca.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/services/apiService";
import { FiArrowLeft, FiCheck, FiX, FiSearch, FiCalendar } from "react-icons/fi";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import "@/styles/registroPresenca.css";
import "@/styles/global.css";

const MySwal = withReactContent(Swal);

export default function RegistroPresenca() {
    const navigate = useNavigate();
    const { api, isLoading: apiLoading, isReady } = useApi();

    const [oficinas, setOficinas] = useState([]);
    const [selectedOficinaId, setSelectedOficinaId] = useState("");
    const [participantesInscritos, setParticipantesInscritos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

    // Carregar oficinas (sem alterações aqui)
    useEffect(() => {
        const fetchOficinas = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await api.oficinas.listarOficinas();
                setOficinas(data);
            } catch (err) {
                console.error("Erro ao carregar oficinas:", err);
                setError("Erro ao carregar oficinas. Tente novamente.");
            } finally {
                setLoading(false);
            }
        };

        if (isReady) {
            fetchOficinas();
        }
    }, [api, isReady]);

    // LÓGICA ATUALIZADA AQUI: Carregar participantes E presenças existentes
    useEffect(() => {
        const fetchDadosDaOficina = async () => {
            if (!selectedOficinaId) {
                setParticipantesInscritos([]);
                return;
            }

            setLoading(true);
            setError("");
            setSuccess(""); // Limpa a mensagem de sucesso ao trocar de oficina/data

            try {
                // 1. Busca a lista de todos os participantes inscritos na oficina
                const promiseInscritos = api.inscricoes.listarParticipantesInscritos(selectedOficinaId);
                
                // 2. Busca o registro de presença para a data selecionada
                const promisePresenca = api.presencas.obterPorOficinaEData(selectedOficinaId, currentDate);

                // Executa as duas buscas em paralelo
                const [listaDeInscritos, dadosPresencaExistente] = await Promise.all([promiseInscritos, promisePresenca]);

                // 3. Cria um Set com os IDs dos participantes presentes para busca rápida
                const presentesIds = new Set(dadosPresencaExistente?.participantes_presentes || []);

                // 4. Combina as informações: marca como presente quem estiver na lista
                const participantesComPresenca = listaDeInscritos.map(participante => ({
                    ...participante,
                    presente: presentesIds.has(participante.id) // Verifica se o ID está no Set
                }));

                setParticipantesInscritos(participantesComPresenca);

            } catch (err) {
                console.error("Erro ao carregar dados da oficina:", err);
                setError("Erro ao carregar participantes ou presenças. Tente novamente.");
                setParticipantesInscritos([]); // Limpa em caso de erro
            } finally {
                setLoading(false);
            }
        };

        if (isReady && selectedOficinaId) {
            fetchDadosDaOficina();
        }
    // Adicionamos 'currentDate' para que a busca seja refeita quando a data mudar
    }, [api, isReady, selectedOficinaId, currentDate]);

    // Filtrar participantes (sem alterações aqui)
    const filteredParticipantes = useMemo(() => {
        if (!searchTerm) return participantesInscritos;
        return participantesInscritos.filter(p =>
            p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.cpf && p.cpf.includes(searchTerm))
        );
    }, [participantesInscritos, searchTerm]);

    // Alternar presença (sem alterações aqui)
    const togglePresenca = (participanteId) => {
        setParticipantesInscritos(prev =>
            prev.map(p =>
                p.id === participanteId ? { ...p, presente: !p.presente } : p
            )
        );
    };

    // Registrar presenças (pequena alteração na mensagem de sucesso)
    const registrarPresencas = async () => {
        if (!selectedOficinaId) {
            setError("Selecione uma oficina antes de registrar presenças.");
            return;
        }

        const participantesPresentes = participantesInscritos
            .filter(p => p.presente)
            .map(p => p.id);

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await api.presencas.registrar(selectedOficinaId, currentDate, participantesPresentes);

            setSuccess(response.message); // Usa a mensagem da API (Registrada ou Atualizada)

            MySwal.fire({
                title: 'Sucesso!',
                text: response.message,
                icon: 'success',
                confirmButtonText: 'OK'
            });
            
            // Não limpamos mais a seleção, pois o estado agora reflete o que foi salvo.
            // Apenas para garantir que o loading pare.

        } catch (err) {
            console.error("Erro ao registrar presenças:", err);
            setError(err.message || "Erro ao registrar presenças. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };
    
    // O resto do componente JSX permanece o mesmo...
    return (
        <div className="registro-presenca-container">
            <div className="registro-presenca-card">
                <div className="registro-presenca-header">
                    <h2>Registrar Presença</h2>
                    <p>Selecione uma oficina e marque os participantes presentes</p>
                </div>
                <div className="registro-presenca-form">
                    <div className="form-group">
                        <label htmlFor="oficinaSelect">Selecionar Oficina</label>
                        <select
                            id="oficinaSelect"
                            value={selectedOficinaId}
                            onChange={(e) => setSelectedOficinaId(e.target.value)}
                            disabled={loading || apiLoading}
                            className="select-oficina"
                        >
                            <option value="">-- Selecione uma Oficina --</option>
                            {oficinas.map((oficina) => (
                                <option key={oficina.id} value={oficina.id}>
                                    {oficina.titulo} - {new Date(oficina.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedOficinaId && (
                        <>
                            <div className="form-group">
                                <label htmlFor="dataPresenca">Data da Presença</label>
                                <div className="date-input-wrapper">
                                    <input
                                        id="dataPresenca"
                                        type="date"
                                        value={currentDate}
                                        onChange={(e) => setCurrentDate(e.target.value)}
                                        className="date-input"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="search-bar">
                                <FiSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Buscar participante..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            {loading ? (
                                <div className="loading-indicator">
                                    <span className="spinner"></span>
                                    <p>Carregando dados...</p>
                                </div>
                            ) : participantesInscritos.length === 0 ? (
                                <p className="no-participantes-message">
                                    Nenhum participante inscrito nesta oficina.
                                </p>
                            ) : (
                                <div className="participantes-table-container">
                                    <table className="participantes-table">
                                        <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>CPF</th>
                                                <th>Instituição</th>
                                                <th>Presença</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredParticipantes.map((participante) => (
                                                <tr key={participante.id}>
                                                    <td>{participante.nome}</td>
                                                    <td>{participante.cpf}</td>
                                                    <td>{participante.instituicao}</td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className={`presenca-button ${participante.presente ? 'presente' : 'ausente'}`}
                                                            onClick={() => togglePresenca(participante.id)}
                                                            disabled={loading}
                                                        >
                                                            {participante.presente ? <FiCheck /> : <FiX />}
                                                            {participante.presente ? ' Presente' : ' Ausente'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {error && <div className="error-message">{error}</div>}
                            {success && <div className="success-message">{success}</div>}

                            <div className="actions">
                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="back-button"
                                    disabled={loading}
                                >
                                    <FiArrowLeft /> Voltar
                                </button>
                                <button
                                    type="button"
                                    onClick={registrarPresencas}
                                    className="submit-button"
                                    disabled={loading || apiLoading}
                                >
                                    {loading ? (
                                        <span className="spinner"></span>
                                    ) : (
                                        'Salvar Presenças' // Texto alterado para mais clareza
                                    )}
                                </button>
                            </div>
                        </>
                    )}

                    {!selectedOficinaId && (
                        <p className="no-oficina-selected-message">
                            Selecione uma oficina para visualizar os participantes inscritos.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
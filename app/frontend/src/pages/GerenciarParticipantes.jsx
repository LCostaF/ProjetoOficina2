import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/services/apiService";
import { FiPlus, FiEdit, FiTrash2, FiArrowLeft, FiUser, FiCreditCard, FiBriefcase, FiGift } from "react-icons/fi";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import "@/styles/global.css";
import "@/styles/gerenciarParticipantes.css";

const MySwal = withReactContent(Swal);

export default function GerenciarParticipantes() {
    const navigate = useNavigate();
    const { api } = useApi();
    const [participantes, setParticipantes] = useState([]);
    const [loadingParticipantes, setLoadingParticipantes] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchParticipantes = async () => {
        setLoadingParticipantes(true);
        setErrorMessage("");
        try {
            const data = await api.participantes.getAll();
            setParticipantes(data);
        } catch (err) {
            console.error("Erro ao carregar participantes:", err);
            setErrorMessage("Erro ao carregar participantes. Tente novamente mais tarde.");
        } finally {
            setLoadingParticipantes(false);
        }
    };

    useEffect(() => {
        if (api && api.participantes) {
            fetchParticipantes();
        }
    }, [api]);

    const handleDelete = async (participanteId) => {
        MySwal.fire({
            title: 'Tem certeza?',
            html: `Você realmente quer excluir este participante? <b>Esta ação é irreversível!</b>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.participantes.delete(participanteId);
                    setParticipantes(participantes.filter((p) => p.id !== participanteId));
                    MySwal.fire(
                        'Excluído!',
                        'O participante foi excluído com sucesso.',
                        'success'
                    );
                } catch (err) {
                    console.error("Erro ao excluir participante:", err);
                    MySwal.fire(
                        'Erro!',
                        `Falha ao excluir o participante: ${err.message}`,
                        'error'
                    );
                }
            }
        });
    };

    const handleEdit = (participanteId) => {
        navigate(`/participantes/editar/${participanteId}`);
    };

    if (loadingParticipantes) {
        return (
            <div className="gerenciar-participantes-container loading-state">
                <div className="spinner-container">
                    <span className="spinner"></span>
                    <p>Carregando participantes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="gerenciar-participantes-container">
            <header className="gerenciar-participantes-header">
                <div className="header-left">
                    <button onClick={() => navigate("/")} className="back-button">
                        <FiArrowLeft size={20} />
                        Voltar
                    </button>
                    <h2>Gerenciar Participantes</h2>
                </div>
                <button onClick={() => navigate("/participantes/cadastro")} className="create-button">
                    <FiPlus size={20} />
                    Criar Novo Participante
                </button>
            </header>

            <main className="gerenciar-participantes-content">
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {participantes.length === 0 && !loadingParticipantes && !errorMessage && (
                    <p className="no-participantes-message">Nenhum participante cadastrado ainda.</p>
                )}

                <div className="participantes-grid">
                    {participantes.map((participante) => (
                        <div key={participante.id} className="participante-card">
                            <div className="participante-card-content">
                                <h3 className="participante-card-title"><FiUser /> {participante.nome}</h3>
                                <div className="participante-card-details">
                                    <span><FiCreditCard size={14} /> CPF: {participante.cpf}</span>
                                    <span><FiGift size={14} /> Nasc: {new Date(participante.data_nascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                                    <span><FiBriefcase size={14} /> Instituição: {participante.instituicao}</span>
                                </div>
                                <div className="participante-card-actions">
                                    <button onClick={() => handleEdit(participante.id)} className="action-button edit-button">
                                        <FiEdit size={16} /> Editar
                                    </button>
                                    <button onClick={() => handleDelete(participante.id)} className="action-button delete-button">
                                        <FiTrash2 size={16} /> Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useApi } from "@/services/apiService";
import "@/styles/registro.css"; // Reutilizando estilos existentes
import "@/styles/global.css";

export default function EditarParticipante() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { api, isLoading: apiLoading } = useApi();

    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [instituicao, setInstituicao] = useState("");
    const [erros, setErros] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [isFormLoading, setIsFormLoading] = useState(true);

    useEffect(() => {
        const fetchParticipante = async () => {
            setIsFormLoading(true);
            try {
                const data = await api.participantes.getById(id);
                setNome(data.nome || "");
                setCpf(data.cpf || "");
                // A API retorna data no formato YYYY-MM-DD, que é o que o input type="date" espera
                setDataNascimento(data.data_nascimento || "");
                setInstituicao(data.instituicao || "");
            } catch (err) {
                console.error("Erro ao carregar dados do participante:", err);
                setErros({ geral: "Erro ao carregar dados. Por favor, tente novamente." });
            } finally {
                setIsFormLoading(false);
            }
        };

        if (api && id) {
            fetchParticipante();
        }
    }, [api, id]);

    const validateForm = () => {
        const newErrors = {};
        if (!nome.trim()) newErrors.nome = "O nome é obrigatório.";
        if (!cpf.trim()) newErrors.cpf = "O CPF é obrigatório.";
        if (!dataNascimento) newErrors.dataNascimento = "A data de nascimento é obrigatória.";
        if (!instituicao.trim()) newErrors.instituicao = "A instituição é obrigatória.";

        if (cpf.trim() && !/^\d{11}$/.test(cpf.replace(/[.-]/g, ''))) {
            newErrors.cpf = "CPF inválido. Deve conter 11 dígitos.";
        }

        setErros(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErros({});
        setSuccessMessage("");

        if (!validateForm()) {
            return;
        }

        const participanteData = {
            nome,
            cpf: cpf.replace(/[.-]/g, ''),
            data_nascimento: dataNascimento,
            instituicao,
        };

        try {
            await api.participantes.update(id, participanteData);
            setSuccessMessage("Participante atualizado com sucesso!");
            setTimeout(() => {
                navigate("/participantes");
            }, 2000);
        } catch (err) {
            console.error("Erro ao atualizar participante:", err);
            setErros({ geral: err.message || "Erro ao atualizar. Tente novamente." });
        }
    };

    if (isFormLoading) {
        return (
            <div className="registro-container">
                <div className="registro-card">
                    <div className="login-header"><h2>Carregando dados...</h2></div>
                    <div className="loading-indicator"><span className="spinner"></span></div>
                </div>
            </div>
        );
    }

    return (
        <div className="registro-container">
            <div className="registro-card">
                <div className="registro-header">
                    <h2>Editar Participante</h2>
                    <p>Atualize os dados do participante</p>
                </div>

                <form onSubmit={handleSubmit} className="registro-form">
                    <div className="form-group">
                        <label htmlFor="nome">Nome Completo</label>
                        <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} className={erros.nome ? "error" : ""} disabled={apiLoading} />
                        {erros.nome && <div className="error-message">{erros.nome}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="cpf">CPF</label>
                        <input id="cpf" type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} className={erros.cpf ? "error" : ""} disabled={apiLoading} maxLength="14" />
                        {erros.cpf && <div className="error-message">{erros.cpf}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="dataNascimento">Data de Nascimento</label>
                        <input id="dataNascimento" type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} className={erros.dataNascimento ? "error" : ""} disabled={apiLoading} />
                        {erros.dataNascimento && <div className="error-message">{erros.dataNascimento}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="instituicao">Instituição</label>
                        <input id="instituicao" type="text" value={instituicao} onChange={(e) => setInstituicao(e.target.value)} className={erros.instituicao ? "error" : ""} disabled={apiLoading} />
                        {erros.instituicao && <div className="error-message">{erros.instituicao}</div>}
                    </div>

                    {erros.geral && <div className="error-message">{erros.geral}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}

                    <button type="submit" className="registro-button" disabled={apiLoading}>
                        {apiLoading ? <span className="spinner"></span> : <><FiSave /> Salvar Alterações</>}
                    </button>
                </form>

                <div className="registro-footer">
                    <p style={{ marginTop: "20px" }}>
                        <a onClick={() => navigate("/participantes")} style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                            <FiArrowLeft /> Voltar para Gerenciar Participantes
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
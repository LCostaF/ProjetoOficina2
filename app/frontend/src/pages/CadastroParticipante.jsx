import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPlusCircle } from "react-icons/fi";
import { useApi } from "@/services/apiService";
import "@/styles/registro.css"; // Reutilizando estilos existentes
import "@/styles/global.css";

export default function CadastroParticipante() {
    const navigate = useNavigate();
    const { api, isLoading: apiLoading } = useApi();

    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [instituicao, setInstituicao] = useState("");
    const [erros, setErros] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const validateForm = () => {
        const newErrors = {};
        if (!nome.trim()) newErrors.nome = "O nome é obrigatório.";
        if (!cpf.trim()) newErrors.cpf = "O CPF é obrigatório.";
        if (!dataNascimento) newErrors.dataNascimento = "A data de nascimento é obrigatória.";
        if (!instituicao.trim()) newErrors.instituicao = "A instituição é obrigatória.";

        // Validação simples de CPF (11 dígitos)
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
            cpf: cpf.replace(/[.-]/g, ''), // Envia apenas os números
            data_nascimento: dataNascimento,
            instituicao,
        };

        try {
            await api.participantes.create(participanteData);
            setSuccessMessage("Participante cadastrado com sucesso!");

            setTimeout(() => {
                navigate("/participantes");
            }, 2000);

        } catch (err) {
            console.error("Erro ao cadastrar participante:", err);
            const errorMessage = err.message || "Erro ao cadastrar participante. Tente novamente.";
            setErros({ geral: errorMessage });
        }
    };

    return (
        <div className="registro-container">
            <div className="registro-card">
                <div className="registro-header">
                    <h2>Cadastrar Novo Participante</h2>
                    <p>Preencha os dados do participante</p>
                </div>

                <form onSubmit={handleSubmit} className="registro-form">
                    <div className="form-group">
                        <label htmlFor="nome">Nome Completo</label>
                        <input
                            id="nome" type="text" value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className={erros.nome ? "error" : ""}
                            disabled={apiLoading}
                            placeholder="Nome completo do participante"
                        />
                        {erros.nome && <div className="error-message">{erros.nome}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="cpf">CPF</label>
                        <input
                            id="cpf" type="text" value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            className={erros.cpf ? "error" : ""}
                            disabled={apiLoading}
                            placeholder="000.000.000-00"
                            maxLength="14"
                        />
                        {erros.cpf && <div className="error-message">{erros.cpf}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="dataNascimento">Data de Nascimento</label>
                        <input
                            id="dataNascimento" type="date" value={dataNascimento}
                            onChange={(e) => setDataNascimento(e.target.value)}
                            className={erros.dataNascimento ? "error" : ""}
                            disabled={apiLoading}
                        />
                        {erros.dataNascimento && <div className="error-message">{erros.dataNascimento}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="instituicao">Instituição</label>
                        <input
                            id="instituicao" type="text" value={instituicao}
                            onChange={(e) => setInstituicao(e.target.value)}
                            className={erros.instituicao ? "error" : ""}
                            disabled={apiLoading}
                            placeholder="Ex: UTFPR, Colégio Estadual, etc."
                        />
                        {erros.instituicao && <div className="error-message">{erros.instituicao}</div>}
                    </div>

                    {erros.geral && <div className="error-message">{erros.geral}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}

                    <button type="submit" className="registro-button" disabled={apiLoading}>
                        {apiLoading ? <span className="spinner"></span> : <><FiPlusCircle /> Cadastrar Participante</>}
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
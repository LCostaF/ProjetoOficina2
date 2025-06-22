import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/services/apiService";
import { FiPlus, FiEdit, FiTrash2, FiArrowLeft, FiCalendar } from "react-icons/fi";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import "@/styles/global.css";
import "@/styles/gerenciarOficinas.css";

const MySwal = withReactContent(Swal);

export default function GerenciarOficinas() {
  const navigate = useNavigate();
  const { api, isLoading, error } = useApi();
  const [oficinas, setOficinas] = useState([]);
  const [loadingOficinas, setLoadingOficinas] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchOficinas = async () => {
    setLoadingOficinas(true);
    setErrorMessage("");
    try {
      const data = await api.oficinas.listarOficinas();
      setOficinas(data);
    } catch (err) {
      console.error("Erro ao carregar oficinas:", err);
      setErrorMessage("Erro ao carregar oficinas. Tente novamente mais tarde.");
    } finally {
      setLoadingOficinas(false);
    }
  };

  useEffect(() => {
    if (api && api.oficinas) {
      fetchOficinas();
    }
  }, [api]);

  const handleDelete = async (oficinaId) => {
    MySwal.fire({
      title: 'Tem certeza?',
      html: `Você realmente quer excluir esta oficina? <b>Esta ação é irreversível!</b>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.oficinas.delete(oficinaId);
          setOficinas(oficinas.filter((oficina) => oficina.id !== oficinaId));
          MySwal.fire(
            'Excluído!',
            'A oficina foi excluída com sucesso.',
            'success'
          );
        } catch (err) {
          console.error("Erro ao excluir oficina:", err);
          let errorDetail = err.message || "Ocorreu um erro inesperado.";
          if (errorDetail.includes("registros de presença associados")) {
               errorDetail = "Existem registros de presença associados a esta oficina. Remova-os primeiro.";
          }
          MySwal.fire(
            'Erro!',
            `Falha ao excluir a oficina: ${errorDetail}`,
            'error'
          );
        }
      }
    });
  };

  const handleEdit = (oficinaId) => {
    navigate(`/oficinas/editar/${oficinaId}`);
  };

  if (loadingOficinas) {
    return (
      <div className="gerenciar-oficinas-container loading-state">
        <div className="spinner-container">
          <span className="spinner"></span>
          <p>Carregando oficinas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gerenciar-oficinas-container">
      <header className="gerenciar-oficinas-header">
        <div className="header-left">
          <button onClick={() => navigate("/")} className="back-button">
            <FiArrowLeft size={20} />
            Voltar
          </button>
          <h2>Gerenciar Oficinas</h2>
        </div>
        <button onClick={() => navigate("/oficinas/cadastro")} className="create-button">
          <FiPlus size={20} />
          Criar Nova Oficina
        </button>
      </header>

      <main className="gerenciar-oficinas-content">
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {oficinas.length === 0 && !loadingOficinas && !errorMessage && (
          <p className="no-oficinas-message">Nenhuma oficina cadastrada ainda.</p>
        )}

        <div className="oficinas-grid">
          {oficinas.map((oficina) => (
            <div key={oficina.id} className="oficina-card">
              <img
                src={oficina.imagem_url || "https://via.placeholder.com/300x200?text=Oficina"}
                alt={`Imagem da oficina ${oficina.titulo}`}
                className="oficina-card-image"
              />
              <div className="oficina-card-content">
                <h3 className="oficina-card-title">{oficina.titulo}</h3>
                <p className="oficina-card-description">{oficina.descricao}</p>
                <div className="oficina-card-details">
                  <span><FiCalendar size={14} /> {oficina.data}</span>
                  <span>{oficina.hora_inicio} - {oficina.hora_fim}</span>
                  <span>Local: {oficina.local}</span>
                </div>
                <div className="oficina-card-actions">
                  <button onClick={() => handleEdit(oficina.id)} className="action-button edit-button">
                    <FiEdit size={16} /> Editar
                  </button>
                  <button onClick={() => handleDelete(oficina.id)} className="action-button delete-button">
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
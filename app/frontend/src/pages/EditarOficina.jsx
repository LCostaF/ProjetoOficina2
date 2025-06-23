import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiSave, FiUploadCloud } from "react-icons/fi";
import { useApi } from "@/services/apiService";
import { useImageUpload } from "@/hooks/useImageUpload";
import "@/styles/registro.css";
import "@/styles/global.css";

export default function EditarOficina() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api, isLoading: apiLoading, error: apiError } = useApi();
  const {
    uploadImage, uploadProgress, isUploading, uploadError, downloadURL,
    setDownloadURL, setUploadError, setUploadProgress
  } = useImageUpload();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [local, setLocal] = useState("");
  const [imagemAtualUrl, setImagemAtualUrl] = useState("");
  const [imagemFile, setImagemFile] = useState(null);
  const [erros, setErros] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isFormLoading, setIsFormLoading] = useState(true);

  useEffect(() => {
    const fetchOficina = async () => {
      setIsFormLoading(true);
      try {
        const oficinaData = await api.oficinas.obterOficina(id);
        setTitulo(oficinaData.titulo || "");
        setDescricao(oficinaData.descricao || "");
        setData(oficinaData.data || "");
        setHoraInicio(oficinaData.hora_inicio || "");
        setHoraFim(oficinaData.hora_fim || "");
        setLocal(oficinaData.local || "");
        setImagemAtualUrl(oficinaData.imagem_url || "");
      } catch (err) {
        console.error("Erro ao carregar dados da oficina:", err);
        setErros({ geral: "Erro ao carregar dados da oficina. Por favor, tente novamente." });
      } finally {
        setIsFormLoading(false);
      }
    };

    if (api && id) {
      fetchOficina();
    }
  }, [api, id]);

  useEffect(() => {
    if (downloadURL && !isUploading && !uploadError) {
      atualizarOficinaBackend(downloadURL);
    } else if (uploadError) {
      setErros(prev => ({ ...prev, geral: uploadError }));
    }
  }, [downloadURL, isUploading, uploadError]);

  const validateForm = () => {
    const newErrors = {};
    if (!titulo.trim()) newErrors.titulo = "O título é obrigatório.";
    if (!descricao.trim()) newErrors.descricao = "A descrição é obrigatória.";
    else if (descricao.trim().length < 10) newErrors.descricao = "A descrição deve ter pelo menos 10 caracteres.";
    if (!data) newErrors.data = "A data é obrigatória.";
    if (!horaInicio) newErrors.horaInicio = "A hora de início é obrigatória.";
    if (!horaFim) newErrors.horaFim = "A hora de término é obrigatória.";
    if (!local.trim()) newErrors.local = "O local é obrigatório.";

    setErros(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const atualizarOficinaBackend = useCallback(async (imageUrl) => {
    setSuccessMessage("");

    const oficinaData = {
      titulo,
      descricao,
      data,
      hora_inicio: horaInicio,
      hora_fim: horaFim,
      local,
      imagem_url: imageUrl,
    };

    try {
      const response = await api.oficinas.update(id, oficinaData);
      console.log("Oficina atualizada com sucesso:", response);
      setSuccessMessage("Oficina atualizada com sucesso!");

      if (imagemFile) {
        setDownloadURL(null);
        setUploadError(null);
        setUploadProgress(0);
        setImagemFile(null);
      }


      setTimeout(() => {
        navigate("/oficinas");
      }, 2000);
    } catch (err) {
      console.error("Erro ao atualizar oficina no backend:", err);
      const errorMessage = err.message || "Erro ao atualizar oficina. Tente novamente.";
      if (errorMessage.includes("already exists")) {
         setErros({ geral: "Já existe outra oficina com este título e data." });
      } else {
        setErros({ geral: errorMessage });
      }
    }
  }, [api, id, navigate, setDownloadURL, setUploadError, setUploadProgress, titulo, descricao, data, horaInicio, horaFim, local, imagemFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErros({});
    setSuccessMessage("");
    setUploadError(null);

    if (!validateForm()) {
      return;
    }

    if (imagemFile) {
      await uploadImage(imagemFile);
    } else {
      atualizarOficinaBackend(imagemAtualUrl);
    }
  };

  if (isFormLoading) {
    return (
      <div className="registro-container">
        <div className="registro-card">
          <div className="login-header">
            <h2>Carregando dados da oficina...</h2>
          </div>
          <div className="loading-indicator">
            <span className="spinner"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="registro-container">
      <div className="registro-card">
        <div className="registro-header">
          <h2>Editar Oficina</h2>
          <p>Atualize os detalhes da oficina</p>
        </div>

        <form onSubmit={handleSubmit} className="registro-form">
          <div className="form-group">
            <label htmlFor="titulo">Título da Oficina</label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className={erros.titulo ? "error" : ""}
              disabled={apiLoading || isUploading}
              placeholder="Ex: Introdução à Programação"
            />
            {erros.titulo && <div className="error-message">{erros.titulo}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className={erros.descricao ? "error" : ""}
              disabled={apiLoading || isUploading}
              placeholder="Descreva brevemente o conteúdo da oficina."
              rows="4"
            ></textarea>
            {erros.descricao && <div className="error-message">{erros.descricao}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="data">Data</label>
            <input
              id="data"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className={erros.data ? "error" : ""}
              disabled={apiLoading || isUploading}
            />
            {erros.data && <div className="error-message">{erros.data}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="horaInicio">Hora de Início</label>
            <input
              id="horaInicio"
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              className={erros.horaInicio ? "error" : ""}
              disabled={apiLoading || isUploading}
            />
            {erros.horaInicio && <div className="error-message">{erros.horaInicio}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="horaFim">Hora de Término</label>
            <input
              id="horaFim"
              type="time"
              value={horaFim}
              onChange={(e) => setHoraFim(e.target.value)}
              className={erros.horaFim ? "error" : ""}
              disabled={apiLoading || isUploading}
            />
            {erros.horaFim && <div className="error-message">{erros.horaFim}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="local">Local</label>
            <input
              id="local"
              type="text"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              className={erros.local ? "error" : ""}
              disabled={apiLoading || isUploading}
              placeholder="Ex: Sala A101, Bloco D"
            />
            {erros.local && <div className="error-message">{erros.local}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="imagem">Imagem da Oficina (Opcional)</label>
            {imagemAtualUrl && !imagemFile && (
              <div className="current-image-preview">
                <p>Imagem atual:</p>
                <img src={imagemAtualUrl} alt="Imagem da Oficina Atual" style={{ maxWidth: "200px", height: "auto", borderRadius: "8px", marginTop: "10px" }} />
                <button
                  type="button"
                  onClick={() => setImagemAtualUrl("")}
                  style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '0.8rem', marginTop: '5px' }}
                >
                  Remover imagem atual
                </button>
              </div>
            )}
            <input
              id="imagem"
              type="file"
              accept="image/*"
              onChange={(e) => setImagemFile(e.target.files[0])}
              disabled={apiLoading || isUploading}
              className={erros.imagemFile ? "error" : ""}
            />
            {erros.imagemFile && <div className="error-message">{erros.imagemFile}</div>}
            {isUploading && (
              <div className="upload-progress">
                <p>Enviando imagem: {uploadProgress.toFixed(2)}%</p>
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            )}
            {downloadURL && !isUploading && !uploadError && (
              <p className="success-message">Nova imagem enviada! <a href={downloadURL} target="_blank" rel="noopener noreferrer">Ver imagem</a></p>
            )}
          </div>

          {apiError && !erros.geral && <div className="error-message">{apiError.message || apiError}</div>}
          {erros.geral && <div className="error-message">{erros.geral}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <button
            type="submit"
            className="registro-button"
            disabled={apiLoading || isUploading}
          >
            {apiLoading || isUploading ? (
              <span className="spinner"></span>
            ) : (
              <><FiSave /> Salvar Alterações</>
            )}
          </button>
        </form>

        <div className="registro-footer">
          <p style={{ marginTop: "20px" }}>
            <a onClick={() => navigate("/oficinas")} style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <FiArrowLeft /> Voltar para Gerenciar Oficinas
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
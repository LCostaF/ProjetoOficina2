import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "@/services/firebase";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import "@/styles/registro.css";
import "@/styles/global.css";

export default function Registro() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [erros, setErros] = useState({});

  const validateEmail = (email) => {
    //email termina com alunos.utfpr.edu.br
    const emailRegex = /^[\w.%+-]+@alunos\.utfpr\.edu\.br$/i;
    return emailRegex.test(email);
  };

  const validateMatricula = (matricula) => {
    const matriculaRegex = /^[a-zA-Z]\d{7}$/;
    return matriculaRegex.test(matricula);
  };

  const validateSenha = (senha) => {
    return senha.length >= 8 && /\d/.test(senha) && /[a-zA-Z]/.test(senha);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors = {};
    setErros(newErrors);

    if (!nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!validateEmail(email)) {
      newErrors.email = "Use seu email institucional (@alunos.utfpr.edu.br)";
    }

    if (!matricula.trim()) {
      newErrors.matricula = "Matrícula é obrigatória";
    } else if (!validateMatricula(matricula)) {
      newErrors.matricula = "Matrícula inválida (uma letra seguida de 7 números)";
    }

    if (!senha) {
      newErrors.senha = "Senha é obrigatória";
    } else if (!validateSenha(senha)) {
      newErrors.senha = "Senha deve ter pelo menos 8 caracteres com números e letras";
    }

    if (senha !== confirmSenha) {
      newErrors.confirmSenha = "As senhas não coincidem";
    }

    if (Object.keys(newErrors).length > 0) {
      setErros(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);

      await updateProfile(userCredential.user, { displayName: nome });

      navigate("/");
    } catch (error) {
      console.error("Erro no cadastro:", error);

      if (error.code === "auth/email-already-in-use") {
        setErros({ ...newErrors, email: "Este email já está em uso" });
      } else {
        setErros({ ...newErrors, geral: "Erro ao criar conta. Tente novamente." });
      }

      setIsLoading(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <div className="registro-header">
          <h2>Criar Conta</h2>
          <p>Preencha seus dados para se cadastrar</p>
        </div>

        <form onSubmit={handleSubmit} className="registro-form">
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={erros.nome ? "error" : ""}
              disabled={isLoading}
              placeholder="Seu nome completo"
            />
            {erros.nome && <div className="error-message">{erros.nome}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Institucional</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={erros.email ? "error" : ""}
              disabled={isLoading}
              placeholder="seu.nome@alunos.utfpr.edu.br"
            />
            {erros.email && <div className="error-message">{erros.email}</div>}
            <div className="help-text">Use seu email institucional da UTFPR</div>
          </div>

          <div className="form-group">
            <label htmlFor="matricula">Matrícula UTFPR</label>
            <input
              id="matricula"
              type="text"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              className={erros.matricula ? "error" : ""}
              disabled={isLoading}
              placeholder="a1234567"
              maxLength={8}
            />
            {erros.matricula && <div className="error-message">{erros.matricula}</div>}
            <div className="help-text">Uma letra seguida de 7 números (ex: a1234567)</div>
          </div>

          <div className="form-group password-group">
            <label htmlFor="senha">Senha</label>
            <div className="password-input-wrapper">
              <input
                id="senha"
                type={showPassword ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className={erros.senha ? "error" : ""}
                disabled={isLoading}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {erros.senha && <div className="error-message">{erros.senha}</div>}
            <div className="help-text">Mínimo 8 caracteres com letras e números</div>
          </div>

          <div className="form-group password-group">
            <label htmlFor="confirm-senha">Confirmar Senha</label>
            <div className="password-input-wrapper">
              <input
                id="confirm-senha"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmSenha}
                onChange={(e) => setConfirmSenha(e.target.value)}
                className={erros.confirmSenha ? "error" : ""}
                disabled={isLoading}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {erros.confirmSenha && <div className="error-message">{erros.confirmSenha}</div>}
          </div>

          {erros.geral && <div className="error-message">{erros.geral}</div>}

          <button type="submit" className="registro-button" disabled={isLoading}>
            {isLoading ? <span className="spinner"></span> : "Criar Conta"}
          </button>
        </form>

        <div className="registro-footer">
          <p>
            Já tem uma conta? <a href="/login">Faça login</a>
          </p>
          <p style={{ marginTop: "20px" }}>
            <a href="/welcome" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <FiArrowLeft /> Voltar para a página inicial
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth } from "@/services/firebase";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth"; // Import useAuth to track authentication status
import "@/styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth(); // Use auth context to check login status
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErro("");
    
    try {
      // Sign in with Firebase
      await signInWithEmailAndPassword(auth, email, senha);
      // Note: We don't navigate here. The useEffect will handle redirect when auth state changes
    } catch (err) {
      console.error("Login error:", err);
      
      // Provide more specific error messages based on Firebase error codes
      if (err.code === 'auth/invalid-credential' || 
          err.code === 'auth/user-not-found' || 
          err.code === 'auth/wrong-password') {
        setErro("Email ou senha inválidos");
      } else if (err.code === 'auth/too-many-requests') {
        setErro("Muitas tentativas de login. Tente novamente mais tarde.");
      } else {
        setErro("Erro ao fazer login. Por favor, tente novamente.");
      }
      setIsLoading(false);
    }
  };

  // If authentication is in process from Firebase, prevent form interaction
  if (authLoading) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Carregando...</h2>
          </div>
          <div className="loading-indicator">
            <span className="spinner"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Bem-vindo</h2>
          <p>Faça login para acessar sua conta</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group password-group">
            <label htmlFor="senha">Senha</label>
            <div className="password-input-wrapper">
              <input
                id="senha"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                disabled={isLoading}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          
          {erro && <div className="error-message">{erro}</div>}
          
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              "Entrar"
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            Não tem uma conta? <a href="/registro">Cadastre-se</a>
          </p>
          <a href="/esqueci-senha" className="forgot-password">
            Esqueci minha senha
          </a>
        </div>
      </div>
    </div>
  );
}
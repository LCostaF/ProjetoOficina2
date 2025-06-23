import { useNavigate } from "react-router-dom";
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import "@/styles/welcome.css";
import "@/styles/global.css";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <img 
          src="/src/assets/logo.svg" 
          alt="ELLP Logo" 
          className="welcome-logo" 
        />
        <h1 className="welcome-title">Registro de Presença ELLP</h1>
        <p className="welcome-subtitle">Sistema de gerenciamento para o projeto de extensão</p>

        <p className="welcome-description">
          Bem-vindo ao sistema de registro de presença do ELLP (Ensino Lúdico de Lógica e Programação). 
          Esta plataforma foi desenvolvida para facilitar o controle de frequência dos alunos participantes 
          nas oficinas do projeto.
        </p>

        <div className="welcome-buttons">
          <button 
            className="welcome-button primary" 
            onClick={() => navigate("/login")}
          >
            <FiLogIn size={18} />
            Entrar
          </button>

          <button 
            className="welcome-button secondary" 
            onClick={() => navigate("/registro")}
          >
            <FiUserPlus size={18} />
            Cadastrar
          </button>
        </div>
      </div>

      <svg className="wave-background" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#0ca3d2" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,133.3C672,117,768,107,864,122.7C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </div>
  );
}

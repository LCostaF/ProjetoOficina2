import { auth } from "@/services/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { FiLogOut, FiUsers, FiCalendar, FiClipboard, FiChevronRight } from "react-icons/fi";
import "@/styles/home.css";
import "@/styles/global.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [userInitials, setUserInitials] = useState("");

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);

      const names = user.displayName.split(" ");
      if (names.length >= 2) {
        setUserInitials(`${names[0][0]}${names[names.length - 1][0]}`);
      } else if (names.length === 1) {
        setUserInitials(names[0][0]);
      }
    } else if (user?.email) {
      const emailPrefix = user.email.split("@")[0];
      setDisplayName(emailPrefix);
      setUserInitials(emailPrefix[0]);
    }
  }, [user]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-logo">
          <h1>Sistema de Registro de Presença</h1>
        </div>

        <div className="dashboard-actions">
          <div className="dashboard-user">
            <div className="user-avatar">
              {userInitials}
            </div>
            <div className="user-info">
              <span className="user-name">{displayName}</span>
              <span className="user-role">Voluntário</span>
            </div>
          </div>

          <button onClick={handleLogout} className="logout-button">
            <FiLogOut size={16} />
            Sair
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-welcome">
          <h2>Bem-vindo, {displayName.split(" ")[0]}!</h2>
          <p>
            Este é o painel de controle do Sistema de Registro de Presença do projeto ELLP. 
            Aqui você pode gerenciar oficinas, participantes e registros de presença.
          </p>
        </section>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="card-icon">
              <FiCalendar />
            </div>
            <h3 className="card-title">Oficinas</h3>
            <p className="card-description">
              Crie e gerencie oficinas e eventos do projeto ELLP.
            </p>
            <a href="#" className="card-link">
              Gerenciar oficinas <FiChevronRight size={14} />
            </a>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">
              <FiUsers />
            </div>
            <h3 className="card-title">Participantes</h3>
            <p className="card-description">
              Cadastre e gerencie os participantes das oficinas.
            </p>
            <a href="#" className="card-link">
              Gerenciar participantes <FiChevronRight size={14} />
            </a>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">
              <FiClipboard />
            </div>
            <h3 className="card-title">Registro de Presença</h3>
            <p className="card-description">
              Registre a presença dos participantes nas oficinas.
            </p>
            <a href="#" className="card-link">
              Registrar presença <FiChevronRight size={14} />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
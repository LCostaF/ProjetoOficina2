import { auth } from "@/services/firebase";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Home - Página Protegida</h1>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}
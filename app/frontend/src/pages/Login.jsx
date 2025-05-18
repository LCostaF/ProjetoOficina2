import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "@/services/firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate("/");
    } catch (err) {
      setErro("Email ou senha inválidos");
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ padding: 32 }}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      /><br />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
      /><br />
      <button type="submit">Entrar</button>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </form>
  );
}
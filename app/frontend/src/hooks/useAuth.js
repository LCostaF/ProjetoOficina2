import { useContext } from "react";
import { AuthContext } from "@/services/authProvider";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    console.error("authContext não encontrado");
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "@/services/authProvider.jsx";
import { ApiProvider } from "@/services/apiService.jsx";
import "@/styles/global.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <AuthProvider>
          <ApiProvider>
            <App />
          </ApiProvider>
        </AuthProvider>
      </React.StrictMode>
    );
    console.log("Aplicação renderizada com sucesso");
  } catch (error) {
    console.error("Erro ao renderizar aplicação:", error);
  }
}
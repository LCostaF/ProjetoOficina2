import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Welcome from "@/pages/Welcome";
import Registro from "@/pages/Registro";
import { useAuth } from "@/hooks/useAuth";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;

  return user ? children : <Navigate to="/login" />;
}

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;

  return user ? <Navigate to="/" /> : children;
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/registro"
          element={
            <PublicOnlyRoute>
              <Registro />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/welcome" />} />
      </Routes>
    </BrowserRouter>
  );
}
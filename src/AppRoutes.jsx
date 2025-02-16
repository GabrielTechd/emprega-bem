import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { useParams } from "react-router-dom";

// Pages
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignupPage from "./pages/auth/signup/SignupPage";
import JobDetailsPage from "./pages/jobDetails/JobDetailsPage";
import AboutPage from "./pages/sobre/AboutPage";
import CompanyProfile from "./pages/profile/CompanyProfile";
import CandidateProfile from "./pages/profile/CandidateProfile";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/" />;
};

const ProfileRoute = ({ children }) => {
  const { user, userType } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/sobre" element={<AboutPage />} />
      <Route path="/vagas" element={<HomePage />} />
      <Route path="/vagas/:id" element={<JobDetailsPage />} />
      <Route path="/empresas" element={<HomePage />} />
      
      {/* Rotas de autenticação */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        } 
      />

      {/* Rotas de perfil */}
      <Route
        path="/profile/:id"
        element={
          <ProfileRoute>
            <ProfileRedirect />
          </ProfileRoute>
        }
      />

      {/* Rota 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

// Componente para redirecionar baseado no tipo de usuário
const ProfileRedirect = () => {
  const { userType, user } = useAuth();
  const { id } = useParams();

  // Se não houver ID na URL, usa o ID do usuário logado
  const profileId = id || user?.id;

  // Se não houver ID do usuário, retorna para login
  if (!profileId) {
    return <Navigate to="/login" />;
  }

  // Renderiza o componente apropriado baseado no tipo de usuário
  if (userType === 'company') {
    return <CompanyProfile />;
  }
  
  return <CandidateProfile />;
};

export default AppRoutes;

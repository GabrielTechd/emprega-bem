import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Register from './pages/auth/signup/SignupPage';
import Login from './pages/auth/login/LoginPage';
import HomePage from './pages/home/HomePage';
import CandidateProfile from './pages/profile/CandidateProfile';
import CompanyProfile from './pages/profile/CompanyProfile';
import NewJob from './pages/jobs/NewJob';
import PrivateRoute from './components/PrivateRoute';
import AboutPage from "./pages/sobre/AboutPage";

import './styles/App.css';

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="app fade-in">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/profile/:id" element={
            <PrivateRoute>
              <ProfileRedirect />
            </PrivateRoute>
          } />
          <Route path="/empresa/perfil/:id" element={
            <PrivateRoute>
              <CompanyProfile />
            </PrivateRoute>
          } />
          <Route path="/candidato/perfil/:id" element={
            <PrivateRoute>
              <CandidateProfile />
            </PrivateRoute>
          } />
          <Route path="/empresa/vagas/nova" element={
            <PrivateRoute>
              <NewJob />
            </PrivateRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

// Componente para redirecionar com base no tipo de usuário
const ProfileRedirect = () => {
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const profileId = id || user?.id;
    
    if (!profileId) {
      navigate('/login');
      return;
    }

    if (userType === 'company') {
      navigate(`/empresa/perfil/${profileId}`);
    } else {
      navigate(`/candidato/perfil/${profileId}`);
    }
  }, [user, userType, id, navigate]);

  return <div>Redirecionando...</div>;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;

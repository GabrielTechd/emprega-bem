import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, profiles, supabase } from '../config/supabase';
import { showError, showSuccess } from '../utils/alerts';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null); // 'candidate' ou 'company'

  const loadUserProfile = async (userId) => {
    console.log('AuthContext - Carregando perfil do usuário:', userId);
    try {
      // Tenta carregar o perfil da empresa primeiro
      const { data: companyProfile, error: companyError } = await profiles.getCompanyProfile(userId);
      console.log('AuthContext - Resultado perfil empresa:', { companyProfile, companyError });
      
      if (companyProfile) {
        setUserProfile(companyProfile);
        setUserType('company');
        console.log('AuthContext - Perfil de empresa definido');
        return;
      }

      // Se não encontrou perfil de empresa, tenta carregar perfil de candidato
      const { data: candidateProfile, error: candidateError } = await profiles.getCandidateProfile(userId);
      console.log('AuthContext - Resultado perfil candidato:', { candidateProfile, candidateError });
      
      if (candidateProfile) {
        setUserProfile(candidateProfile);
        setUserType('candidate');
        console.log('AuthContext - Perfil de candidato definido');
        return;
      }

      // Se não encontrou nenhum perfil, verifica se há um tipo definido no metadata
      const userMetadataType = user?.user_metadata?.type;
      console.log('AuthContext - Tipo do usuário no metadata:', userMetadataType);
      if (userMetadataType) {
        setUserType(userMetadataType);
      }

    } catch (error) {
      console.error('AuthContext - Erro ao carregar perfil:', error);
    }
  };

  const checkUser = async () => {
    console.log('AuthContext - Verificando usuário');
    try {
      const { data: { session }, error } = await auth.getCurrentSession();
      console.log('AuthContext - Sessão atual:', { session, error });

      if (error) {
        console.error('AuthContext - Erro ao verificar sessão:', error);
        throw error;
      }

      if (session?.user) {
        const userData = session.user;
        console.log('AuthContext - Usuário encontrado:', userData);
        setUser(userData);
        await loadUserProfile(userData.id);
      } else {
        console.log('AuthContext - Nenhum usuário encontrado');
        setUser(null);
        setUserProfile(null);
        setUserType(null);
      }
    } catch (error) {
      console.error('AuthContext - Erro ao verificar usuário:', error);
      setUser(null);
      setUserProfile(null);
      setUserType(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('AuthContext - Inicializando provider');
    let mounted = true;

    const initialize = async () => {
      if (!mounted) return;
      await checkUser();
      
      const { data: authListener } = auth.onAuthStateChange(async (event, session) => {
        console.log('AuthContext - Mudança de estado:', { event, session });
        if (!mounted) return;

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            console.log('AuthContext - Usuário logado:', session.user);
            setUser(session.user);
            await loadUserProfile(session.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('AuthContext - Usuário deslogado');
          setUser(null);
          setUserProfile(null);
          setUserType(null);
        }
        setLoading(false);
      });

      return () => {
        mounted = false;
        authListener?.subscription?.unsubscribe?.();
      };
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  console.log('AuthContext - Estado atual:', { user, userProfile, userType, loading });

  const signUp = async ({ email, password, userType, profileData }) => {
    try {
      setLoading(true);
      
      // Registra o usuário e cria o perfil
      const { data: authData, error } = await auth.signUp({
        email,
        password,
        userType,
        ...profileData
      });

      if (error) throw error;

      // Se o registro foi bem sucedido, atualiza o estado
      if (authData?.user) {
        setUser(authData.user);
        await loadUserProfile(authData.user.id);
      }

      return { data: authData, error: null };
    } catch (error) {
      showError('Erro no cadastro', error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async ({ email, password }) => {
    try {
      setLoading(true);
      const { data: authData, error: signInError } = await auth.signIn({ email, password });
      
      if (signInError) throw signInError;
      
      if (authData?.user) {
        setUser(authData.user);
        await loadUserProfile(authData.user.id);
      }
      
      return { data: authData, error: null };
    } catch (error) {
      showError('Erro no login', error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setUserProfile(null);
      setUserType(null);
      showSuccess('Sucesso', 'Logout realizado com sucesso!');
    } catch (error) {
      showError('Erro no logout', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data) => {
    try {
      if (!user) return { error: 'Usuário não autenticado' };

      let result;
      if (userType === 'company') {
        result = await profiles.updateCompanyProfile(user.id, data);
      } else {
        result = await profiles.updateCandidateProfile(user.id, data);
      }

      if (result.error) throw result.error;

      setUserProfile(prev => ({
        ...prev,
        ...data
      }));

      return { data: result.data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { data: null, error };
    }
  };

  const value = {
    user,
    userProfile,
    userType,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    setUserType
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth }; 
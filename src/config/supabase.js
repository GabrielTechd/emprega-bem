import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Funções de autenticação
export const auth = {
  getCurrentSession: async () => {
    try {
      return await supabase.auth.getSession();
    } catch (error) {
      console.error('Erro ao obter sessão:', error);
      return { data: { session: null }, error };
    }
  },

  getCurrentUser: async () => {
    try {
      return await supabase.auth.getUser();
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      return { data: { user: null }, error };
    }
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  signUp: async ({ email, password, userType, ...profileData }) => {
    try {
      // Registra o usuário com o tipo nos metadados
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType
          },
          emailRedirectTo: undefined // Desativa o redirecionamento de email
        }
      });

      if (error) throw error;

      // Se o registro foi bem sucedido, cria o perfil imediatamente
      if (data?.user) {
        let profileError;
        if (userType === 'company') {
          // Deleta qualquer perfil existente para evitar duplicatas
          await supabase
            .from('company_profiles')
            .delete()
            .eq('user_id', data.user.id);

          const { error: createError } = await supabase
            .from('company_profiles')
            .insert([{
              user_id: data.user.id,
              email,
              ...profileData
            }])
            .select()
            .single();
          profileError = createError;
        } else {
          // Deleta qualquer perfil existente para evitar duplicatas
          await supabase
            .from('candidate_profiles')
            .delete()
            .eq('user_id', data.user.id);

          const { error: createError } = await supabase
            .from('candidate_profiles')
            .insert([{
              user_id: data.user.id,
              email,
              nome: profileData.nome,
              ...profileData
            }])
            .select()
            .single();
          profileError = createError;
        }

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
          throw profileError;
        }

        // Faz login automaticamente após o registro
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;

        return { data: signInData, error: null };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return { data: null, error };
    }
  },

  signIn: async ({ email, password }) => {
    try {
      return await supabase.auth.signInWithPassword({
        email,
        password
      });
    } catch (error) {
      console.error('Erro no login:', error);
      return { data: null, error };
    }
  },

  signOut: async () => {
    try {
      return await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro no logout:', error);
      return { error };
    }
  }
};

// Funções de perfil
export const profiles = {
  getCandidateProfile: async (userId) => {
    try {
      // Primeiro, tenta encontrar o perfil mais recente
      const { data, error } = await supabase
        .from('candidate_profiles')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  createCandidateProfile: async (profileData) => {
    try {
      // Primeiro, deleta qualquer perfil existente para evitar duplicatas
      await supabase
        .from('candidate_profiles')
        .delete()
        .eq('user_id', profileData.user_id);

      // Então cria o novo perfil
      const { data, error } = await supabase
        .from('candidate_profiles')
        .insert([profileData])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  updateCandidateProfile: async (userId, profileData) => {
    try {
      const { data, error } = await supabase
        .from('candidate_profiles')
        .update(profileData)
        .eq('user_id', userId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  getCompanyProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao obter perfil da empresa:', error);
      return { data: null, error };
    }
  },

  updateCompanyProfile: async (userId, data) => {
    try {
      const { error } = await supabase
        .from('company_profiles')
        .update(data)
        .eq('user_id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Erro ao atualizar perfil da empresa:', error);
      return { error };
    }
  },

  createCompanyProfile: async (profileData) => {
    try {
      const { data, error } = await supabase
        .from('company_profiles')
        .insert([profileData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar perfil da empresa:', error);
      return { data: null, error };
    }
  },

  getApplications: async (candidateId) => {
    try {
      if (!candidateId) {
        throw new Error('ID do candidato é obrigatório');
      }

      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          id,
          status,
          feedback,
          created_at,
          updated_at,
          job:jobs (
            id,
            titulo,
            descricao,
            requisitos,
            salario,
            tipo_contrato,
            local,
            status,
            company:company_profiles (
              id,
              nome_empresa,
              foto_url,
              industria
            )
          )
        `)
        .eq('candidate_id', candidateId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar candidaturas:', error);
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar candidaturas:', error);
      return { data: null, error };
    }
  },

  getSavedJobs: async (candidateId) => {
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select(`
          id,
          created_at,
          job:jobs (
            id,
            titulo,
            descricao,
            requisitos,
            salario,
            tipo_contrato,
            local,
            status,
            company:company_profiles (
              id,
              nome_empresa,
              foto_url,
              industria
            )
          )
        `)
        .eq('candidate_id', candidateId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar vagas salvas:', error);
      return { data: null, error };
    }
  },

  saveJob: async (jobId, candidateId) => {
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .insert({
          job_id: jobId,
          candidate_id: candidateId
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao salvar vaga:', error);
      return { data: null, error };
    }
  },

  unsaveJob: async (jobId, candidateId) => {
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .match({
          job_id: jobId,
          candidate_id: candidateId
        });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Erro ao remover vaga salva:', error);
      return { error };
    }
  }
};

// Funções de Vagas
export const jobs = {
  // Criar nova vaga
  createJob: async (jobData) => {
    return await supabase
      .from('jobs')
      .insert([jobData]);
  },

  // Buscar vagas da empresa
  getCompanyJobs: async (companyId) => {
    return await supabase
      .from('jobs')
      .select('*')
      .eq('company_id', companyId);
  },

  // Buscar vaga específica
  getJob: async (jobId) => {
    return await supabase
      .from('jobs')
      .select(`
        *,
        company:company_profiles(*)
      `)
      .eq('id', jobId)
      .single();
  },

  // Atualizar vaga
  updateJob: async (jobId, data) => {
    return await supabase
      .from('jobs')
      .update(data)
      .eq('id', jobId);
  },

  // Buscar candidatos de uma vaga
  getJobCandidates: async (jobId) => {
    return await supabase
      .from('job_applications')
      .select(`
        *,
        candidate:candidate_profiles(*)
      `)
      .eq('job_id', jobId);
  }
};

// Funções de Candidaturas
export const applications = {
  // Candidatar-se a uma vaga
  applyToJob: async (jobId, candidateId, data) => {
    return await supabase
      .from('job_applications')
      .insert([{
        job_id: jobId,
        candidate_id: candidateId,
        ...data
      }]);
  },

  // Buscar candidaturas do candidato
  getCandidateApplications: async (candidateId) => {
    return await supabase
      .from('job_applications')
      .select(`
        *,
        job:jobs(*),
        company:jobs(company_profiles(*))
      `)
      .eq('candidate_id', candidateId);
  },

  // Atualizar status da candidatura
  updateApplicationStatus: async (applicationId, status, feedback) => {
    return await supabase
      .from('job_applications')
      .update({
        status,
        feedback,
        updated_at: new Date()
      })
      .eq('id', applicationId);
  }
};

// Funções de Vagas Salvas
export const savedJobs = {
  // Salvar vaga
  saveJob: async (jobId, candidateId) => {
    return await supabase
      .from('saved_jobs')
      .insert([{
        job_id: jobId,
        candidate_id: candidateId
      }]);
  },

  // Remover vaga salva
  unsaveJob: async (jobId, candidateId) => {
    return await supabase
      .from('saved_jobs')
      .delete()
      .match({
        job_id: jobId,
        candidate_id: candidateId
      });
  },

  // Buscar vagas salvas do candidato
  getSavedJobs: async (candidateId) => {
    return await supabase
      .from('saved_jobs')
      .select(`
        *,
        job:jobs(*),
        company:jobs(company_profiles(*))
      `)
      .eq('candidate_id', candidateId);
  }
}; 
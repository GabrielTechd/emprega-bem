import { supabase } from '../config/supabase';

// Funções para perfil da empresa
export const getCompanyProfile = async (userId) => {
  try {
    console.log('Buscando perfil da empresa para userId:', userId);
    const { data, error } = await supabase
      .from('company_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil da empresa:', error);
      throw error;
    }

    console.log('Perfil encontrado:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Erro na função getCompanyProfile:', error);
    return { data: null, error };
  }
};

export const getPublicCompanyProfile = async (companyId) => {
  try {
    const { data, error } = await supabase
      .from('company_profiles')
      .select(`
        id,
        nome_empresa,
        descricao,
        foto_url,
        industria,
        tamanho,
        site,
        endereco
      `)
      .eq('id', companyId)
      .single();

    return { data, error };
  } catch (error) {
    console.error('Erro ao buscar perfil público da empresa:', error);
    return { data: null, error };
  }
};

export const updateCompanyProfile = async (userId, profileData) => {
  try {
    console.log('Atualizando perfil da empresa:', { userId, profileData });
    const { data, error } = await supabase
      .from('company_profiles')
      .update(profileData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar perfil da empresa:', error);
      throw error;
    }

    console.log('Perfil atualizado:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Erro na função updateCompanyProfile:', error);
    return { data: null, error };
  }
};

export const createCompanyProfile = async (profileData) => {
  try {
    console.log('Criando perfil da empresa com dados:', profileData);
    const { data, error } = await supabase
      .from('company_profiles')
      .insert([profileData])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar perfil da empresa:', error);
      throw error;
    }

    console.log('Perfil criado:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Erro na função createCompanyProfile:', error);
    return { data: null, error };
  }
};

// Funções para vagas
export const getCompanyJobs = async (companyId) => {
  try {
    console.log('Buscando vagas da empresa:', companyId);
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar vagas da empresa:', error);
      throw error;
    }

    console.log('Vagas encontradas:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Erro na função getCompanyJobs:', error);
    return { data: null, error };
  }
};

export const getPublicCompanyJobs = async (companyId) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        id,
        titulo,
        descricao,
        requisitos,
        salario,
        tipo_contrato,
        local,
        created_at
      `)
      .eq('company_id', companyId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    return { data, error };
  } catch (error) {
    console.error('Erro ao buscar vagas públicas:', error);
    return { data: null, error };
  }
};

export const createJob = async (jobData) => {
  try {
    console.log('Criando nova vaga:', jobData);
    const { data, error } = await supabase
      .from('jobs')
      .insert([jobData])
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao criar vaga:', error);
      throw error;
    }

    console.log('Vaga criada:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao criar vaga:', error);
    return { data: null, error };
  }
};

export const updateJob = async (jobId, updateData) => {
  try {
    console.log('Atualizando vaga:', { jobId, updateData });
    const { data, error } = await supabase
      .from('jobs')
      .update(updateData)
      .eq('id', jobId)
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao atualizar vaga:', error);
      throw error;
    }

    console.log('Vaga atualizada:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao atualizar vaga:', error);
    return { data: null, error };
  }
};

export const getJob = async (jobId) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        company:company_id (
          id,
          nome_empresa,
          foto_url,
          industria
        )
      `)
      .eq('id', jobId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao buscar vaga:', error);
    return { data: null, error };
  }
};

export const searchJobs = async (searchParams = {}) => {
  try {
    let query = supabase
      .from('jobs')
      .select(`
        *,
        company:company_id (
          id,
          nome_empresa,
          foto_url,
          industria
        )
      `)
      .eq('status', 'active');

    // Adiciona filtros se fornecidos
    if (searchParams.titulo) {
      query = query.ilike('titulo', `%${searchParams.titulo}%`);
    }
    if (searchParams.local) {
      query = query.ilike('local', `%${searchParams.local}%`);
    }
    if (searchParams.tipo_contrato) {
      query = query.eq('tipo_contrato', searchParams.tipo_contrato);
    }
    if (searchParams.salario_min) {
      query = query.gte('salario', searchParams.salario_min);
    }
    if (searchParams.salario_max) {
      query = query.lte('salario', searchParams.salario_max);
    }

    // Ordenação e paginação
    query = query
      .order('created_at', { ascending: false })
      .range(
        (searchParams.page - 1) * searchParams.per_page,
        searchParams.page * searchParams.per_page - 1
      );

    const { data, error, count } = await query;

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Erro ao buscar vagas:', error);
    return { data: null, count: 0, error };
  }
};

// Funções para candidaturas
export const getJobApplications = async (companyId) => {
  try {
    console.log('Buscando candidaturas para a empresa:', companyId);
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        job:jobs(*),
        candidate:candidate_profiles(*)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar candidaturas:', error);
      throw error;
    }

    console.log('Candidaturas encontradas:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Erro na função getJobApplications:', error);
    return { data: null, error };
  }
};

export const updateJobApplication = async (applicationId, updateData) => {
  try {
    console.log('Atualizando candidatura:', { applicationId, updateData });
    const { data, error } = await supabase
      .from('job_applications')
      .update(updateData)
      .eq('id', applicationId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar candidatura:', error);
      throw error;
    }

    console.log('Candidatura atualizada:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Erro na função updateJobApplication:', error);
    return { data: null, error };
  }
};

// Função para upload de arquivos
export const uploadFile = async (file, path) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}${Date.now()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('files')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('files')
      .getPublicUrl(filePath);

    return { 
      data: {
        path: filePath,
        url: publicUrl
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Erro ao fazer upload do arquivo:', error);
    return { data: null, error };
  }
}; 
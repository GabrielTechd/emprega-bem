import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBuilding, FaEdit, FaBriefcase, FaUsers, FaCog, FaPlus, FaUser, FaDownload } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import * as supabaseService from '../../services/supabaseService';
import { uploadImage, deleteImage } from '../../utils/imageUpload';
import { showSuccess, showError, showLoading, closeLoading } from '../../utils/alerts';
import './CompanyProfile.css';

const CompanyProfile = () => {
  console.log('CompanyProfile - Componente renderizado');
  
  const { id } = useParams();
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [companyProfile, setCompanyProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  // Usando useMemo para calcular isOwnProfile
  const isOwnProfile = useMemo(() => {
    if (!user || !companyProfile) return false;
    return user.id === companyProfile.user_id;
  }, [user, companyProfile]);

  // Estado do formulário
  const [profileForm, setProfileForm] = useState({
    nome_empresa: '',
    email: '',
    telefone: '',
    cnpj: '',
    descricao: '',
    industria: '',
    tamanho: '',
    site: '',
    endereco: ''
  });

  // Estado para criação/edição de vaga
  const [jobForm, setJobForm] = useState({
    titulo: '',
    descricao: '',
    requisitos: '',
    salario: '',
    tipo_contrato: '',
    local: ''
  });

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!user) {
        console.log('CompanyProfile - Usuário não autenticado');
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);
        const profileId = id || user.id;

        const { data: profile, error: profileError } = await supabaseService.getCompanyProfile(profileId);

        if (profileError) {
          console.error('CompanyProfile - Erro ao carregar perfil:', profileError);
          setError('Erro ao carregar perfil da empresa');
          return;
        }

        if (!profile) {
          if (user.id === profileId) {
            const initialData = {
              user_id: profileId,
              nome_empresa: userProfile?.nome_empresa || user?.user_metadata?.name || '',
              email: user.email,
              telefone: '',
              cnpj: '',
              descricao: '',
              industria: '',
              tamanho: '',
              site: '',
              endereco: ''
            };

            const { data: newProfile, error: createError } = await supabaseService.createCompanyProfile(initialData);

            if (createError) {
              setError('Erro ao criar perfil da empresa');
              return;
            }

            if (isMounted) {
              setCompanyProfile(newProfile);
              setProfileForm(newProfile);
            }
          } else {
            setError('Perfil não encontrado');
          }
        } else {
          if (isMounted) {
            setCompanyProfile(profile);
            setProfileForm(profile);

            // Carrega dados adicionais apenas se for o próprio perfil
            if (user.id === profile.user_id) {
              const [jobsResponse, applicationsResponse] = await Promise.all([
                supabaseService.getCompanyJobs(profile.id),
                supabaseService.getJobApplications(profile.id)
              ]);

              if (!jobsResponse.error && isMounted) {
                setJobs(jobsResponse.data || []);
              }

              if (!applicationsResponse.error && isMounted) {
                setApplications(applicationsResponse.data || []);
              }
            }
          }
        }
      } catch (error) {
        console.error('CompanyProfile - Erro geral:', error);
        if (isMounted) {
          setError('Erro ao carregar dados do perfil');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [id, user, userProfile, navigate]);

  console.log('CompanyProfile - Estado atual', { isLoading, error, companyProfile });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageUrl = await uploadImage(file, 'company-profiles');
        setProfileForm(prev => ({
          ...prev,
          foto_url: imageUrl
        }));
        await handleProfileSubmit(null, { foto_url: imageUrl });
      } catch (error) {
        showError('Erro', 'Erro ao fazer upload da imagem');
      }
    }
  };

  const handleProfileSubmit = async (e, additionalData = {}) => {
    if (e) e.preventDefault();
    
    if (!isOwnProfile) return;

    try {
      const updateData = e ? profileForm : { ...profileForm, ...additionalData };
      const { data, error } = await supabaseService.updateCompanyProfile(user.id, updateData);

      if (error) throw error;

      setCompanyProfile(data);
      setProfileForm(data);
      setEditMode(false);
      if (e) await showSuccess('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      showError('Erro', 'Erro ao atualizar perfil');
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    
    if (!isOwnProfile) return;

    try {
      const { data, error } = await supabaseService.createJob({
        ...jobForm,
        company_id: companyProfile.id,
        status: 'active'
      });

      if (error) throw error;

      setJobs([data[0], ...jobs]);
      setJobForm({
        titulo: '',
        descricao: '',
        requisitos: '',
        salario: '',
        tipo_contrato: '',
        local: ''
      });
      await showSuccess('Sucesso', 'Vaga criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar vaga:', error);
      showError('Erro', 'Erro ao criar vaga');
    }
  };

  const handleUpdateJob = async (jobId, updateData) => {
    if (!isOwnProfile) return;

    try {
      const { data, error } = await supabaseService.updateJob(jobId, updateData);

      if (error) throw error;

      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, ...updateData } : job
      ));
      await showSuccess('Sucesso', 'Vaga atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar vaga:', error);
      showError('Erro', 'Erro ao atualizar vaga');
    }
  };

  const handleUpdateApplication = async (applicationId, newStatus, feedback) => {
    if (!isOwnProfile) return;

    try {
      const { data, error } = await supabaseService.updateJobApplication(applicationId, {
        status: newStatus,
        feedback
      });

      if (error) throw error;

      setApplications(applications.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus, feedback } 
          : app
      ));
      await showSuccess('Sucesso', 'Status da candidatura atualizado!');
    } catch (error) {
      console.error('Erro ao atualizar candidatura:', error);
      showError('Erro', 'Erro ao atualizar candidatura');
    }
  };

  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="loading">Carregando perfil...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!companyProfile) {
    return (
      <div className="profile-container">
        <div className="error">Perfil não encontrado</div>
      </div>
    );
  }

  const renderProfileContent = () => (
    <>
      <div className="profile-header">
        <div className="profile-avatar">
          <label htmlFor="avatar-input" className="avatar-label">
            {companyProfile.foto_url ? (
              <img src={companyProfile.foto_url} alt={companyProfile.nome_empresa} />
            ) : (
              <FaBuilding size={40} />
            )}
            {isOwnProfile && <div className="change-photo">Alterar foto</div>}
          </label>
          {isOwnProfile && (
            <input
              type="file"
              id="avatar-input"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          )}
        </div>
        <div className="profile-info">
          <h1>{companyProfile.nome_empresa}</h1>
          <p className="profile-username">@{companyProfile.email}</p>
          {isOwnProfile && (
            <button className="edit-button" onClick={() => setEditMode(!editMode)}>
              <FaEdit /> {editMode ? 'Cancelar' : 'Editar Perfil'}
            </button>
          )}
        </div>
      </div>

      {editMode ? (
        <form className="profile-form" onSubmit={handleProfileSubmit}>
          <div className="settings-section">
            <h2>Informações da Empresa</h2>
            <div className="settings-field">
              <label>Nome da Empresa</label>
              <input
                type="text"
                name="nome_empresa"
                value={profileForm.nome_empresa}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="settings-field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="settings-field">
              <label>Telefone</label>
              <input
                type="tel"
                name="telefone"
                value={profileForm.telefone}
                onChange={handleInputChange}
              />
            </div>
            <div className="settings-field">
              <label>CNPJ</label>
              <input
                type="text"
                name="cnpj"
                value={profileForm.cnpj}
                onChange={handleInputChange}
              />
            </div>
            <div className="settings-field">
              <label>Descrição</label>
              <textarea
                name="descricao"
                value={profileForm.descricao}
                onChange={handleInputChange}
              />
            </div>
            <div className="settings-field">
              <label>Indústria</label>
              <input
                type="text"
                name="industria"
                value={profileForm.industria}
                onChange={handleInputChange}
              />
            </div>
            <div className="settings-field">
              <label>Tamanho da Empresa</label>
              <select
                name="tamanho"
                value={profileForm.tamanho}
                onChange={handleInputChange}
              >
                <option value="">Selecione...</option>
                <option value="1-10">1-10 funcionários</option>
                <option value="11-50">11-50 funcionários</option>
                <option value="51-200">51-200 funcionários</option>
                <option value="201-500">201-500 funcionários</option>
                <option value="501+">501+ funcionários</option>
              </select>
            </div>
            <div className="settings-field">
              <label>Site</label>
              <input
                type="url"
                name="site"
                value={profileForm.site}
                onChange={handleInputChange}
              />
            </div>
            <div className="settings-field">
              <label>Endereço</label>
              <input
                type="text"
                name="endereco"
                value={profileForm.endereco}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="save-button">
              Salvar Alterações
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-sections">
          <section className="profile-section">
            <h2>SOBRE</h2>
            <p>{companyProfile.descricao || 'Nenhuma descrição disponível.'}</p>
          </section>

          <section className="profile-section">
            <h2>INFORMAÇÕES</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Email</label>
                <p>{companyProfile.email}</p>
              </div>
              <div className="info-item">
                <label>Telefone</label>
                <p>{companyProfile.telefone || 'Não informado'}</p>
              </div>
              <div className="info-item">
                <label>CNPJ</label>
                <p>{companyProfile.cnpj || 'Não informado'}</p>
              </div>
              <div className="info-item">
                <label>Indústria</label>
                <p>{companyProfile.industria || 'Não informado'}</p>
              </div>
              <div className="info-item">
                <label>Tamanho</label>
                <p>{companyProfile.tamanho || 'Não informado'}</p>
              </div>
              <div className="info-item">
                <label>Site</label>
                <p>{companyProfile.site ? (
                  <a href={companyProfile.site} target="_blank" rel="noopener noreferrer">
                    {companyProfile.site}
                  </a>
                ) : 'Não informado'}</p>
              </div>
              <div className="info-item">
                <label>Endereço</label>
                <p>{companyProfile.endereco || 'Não informado'}</p>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );

  const renderJobsContent = () => (
    <div className="profile-sections">
      <section className="profile-section">
        <div className="section-header">
          <h2>MINHAS VAGAS</h2>
          <button className="new-job-button" onClick={() => navigate('/empresa/vagas/nova')}>
            <FaPlus /> Nova Vaga
          </button>
        </div>

        <div className="jobs-list">
          {jobs.map(job => (
            <div key={job.id} className="job-card">
              <h3>{job.titulo}</h3>
              <div className="job-details">
                <span>{job.tipo_contrato}</span>
                <span>{job.local}</span>
                <span>R$ {job.salario}</span>
              </div>
              <p>{job.descricao}</p>
              <div className="job-actions">
                <button onClick={() => navigate(`/empresa/vagas/editar/${job.id}`)}>
                  <FaEdit /> Editar
                </button>
                <button onClick={() => handleUpdateJob(job.id, { 
                  status: job.status === 'active' ? 'inactive' : 'active' 
                })}>
                  {job.status === 'active' ? 'Desativar' : 'Ativar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderApplicationsContent = () => (
    <div className="profile-sections">
      <section className="profile-section">
        <h2>CANDIDATURAS RECEBIDAS</h2>
        <div className="applications-list">
          {applications.map(application => (
            <div key={application.id} className="application-card">
              <div className="application-header">
                <h3>{application.job?.titulo}</h3>
                <span className={`status ${application.status}`}>
                  {application.status}
                </span>
              </div>
              <div className="candidate-info">
                <p><strong>Candidato:</strong> {application.candidate?.nome}</p>
                <p><strong>Email:</strong> {application.candidate?.email}</p>
                {application.candidate?.curriculo_url && (
                  <a 
                    href={application.candidate.curriculo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-resume-button"
                  >
                    <FaDownload /> Baixar Currículo
                  </a>
                )}
              </div>
              <div className="application-actions">
                <select
                  value={application.status}
                  onChange={(e) => handleUpdateApplication(
                    application.id,
                    e.target.value,
                    application.feedback
                  )}
                >
                  <option value="pending">Pendente</option>
                  <option value="reviewing">Em Análise</option>
                  <option value="approved">Aprovado</option>
                  <option value="rejected">Rejeitado</option>
                </select>
                <textarea
                  placeholder="Feedback para o candidato"
                  value={application.feedback || ''}
                  onChange={(e) => handleUpdateApplication(
                    application.id,
                    application.status,
                    e.target.value
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderSettingsContent = () => (
    <div className="profile-sections">
      <section className="profile-section">
        <h2>CONFIGURAÇÕES</h2>
        <div className="settings-section">
          <div className="settings-field">
            <label>Notificações por Email</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => {}}
                />
                Novas candidaturas
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => {}}
                />
                Atualizações de candidaturas
              </label>
            </div>
          </div>
          <div className="settings-field">
            <label>Privacidade</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => {}}
                />
                Perfil público
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => {}}
                />
                Mostrar informações de contato
              </label>
            </div>
          </div>
          <button className="delete-button">
            Excluir Conta
          </button>
        </div>
      </section>
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="profile-nav">
          <div
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser /> Perfil da Empresa
          </div>
          {isOwnProfile && (
            <>
              <div
                className={`nav-item ${activeTab === 'jobs' ? 'active' : ''}`}
                onClick={() => setActiveTab('jobs')}
              >
                <FaBriefcase /> Minhas Vagas
              </div>
              <div
                className={`nav-item ${activeTab === 'applications' ? 'active' : ''}`}
                onClick={() => setActiveTab('applications')}
              >
                <FaUsers /> Candidaturas
              </div>
              <div
                className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <FaCog /> Configurações
              </div>
            </>
          )}
        </div>
      </div>

      <div className="profile-main">
        {activeTab === 'profile' && renderProfileContent()}
        {activeTab === 'jobs' && renderJobsContent()}
        {activeTab === 'applications' && renderApplicationsContent()}
        {activeTab === 'settings' && renderSettingsContent()}
      </div>
    </div>
  );
};

export default CompanyProfile; 
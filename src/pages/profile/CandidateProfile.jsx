import React, { useState, useEffect } from 'react';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import { FaUser, FaEdit, FaFileAlt, FaBookmark, FaBriefcase, FaGraduationCap, FaCog, FaEnvelope, FaPhone, FaTools, FaInfoCircle, FaCogs, FaCamera, FaBuilding, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { profiles } from '../../config/supabase';
import { uploadImage, deleteImage } from '../../utils/imageUpload';
import { showSuccess, showError, showLoading, closeLoading } from '../../utils/alerts';
import './CandidateProfile.css';

const CandidateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userProfile, userType, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    curriculo: null,
    foto: null,
    experiencia: '',
    educacao: '',
    habilidades: '',
    sobre: '',
    curriculo_url: null,
    curriculo_path: null,
    foto_url: null,
    foto_path: null
  });
  const [currentProfile, setCurrentProfile] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    // Se for uma empresa, redireciona para CompanyProfile
    if (userType === 'company') {
      navigate(`/profile/${user.id}`);
      return;
    }

    const loadApplications = async (profileId) => {
      try {
        if (!profileId) return;
        
        const { data, error } = await profiles.getApplications(profileId);
        if (error) {
          console.error('Erro ao carregar candidaturas:', error);
          showError('Erro', 'Não foi possível carregar suas candidaturas');
          return;
        }
        setApplications(data || []);
      } catch (error) {
        console.error('Erro ao carregar candidaturas:', error);
        showError('Erro', 'Não foi possível carregar suas candidaturas');
      }
    };

    const loadSavedJobs = async (profileId) => {
      try {
        if (!profileId) return;
        
        const { data, error } = await profiles.getSavedJobs(profileId);
        if (error) {
          console.error('Erro ao carregar vagas salvas:', error);
          showError('Erro', 'Não foi possível carregar suas vagas salvas');
          return;
        }
        setSavedJobs(data || []);
      } catch (error) {
        console.error('Erro ao carregar vagas salvas:', error);
        showError('Erro', 'Não foi possível carregar suas vagas salvas');
      }
    };

    const init = async () => {
      if (!user) return;
      
      // Se não tiver ID na URL, usa o ID do usuário logado
      const profileId = id || user.id;
      setIsOwnProfile(user.id === profileId);
      
      try {
        setLoading(true);
        
        // Verifica se o usuário atual é uma empresa
        if (!id && userType === 'company') {
          showError('Erro', 'Acesso negado. Esta página é apenas para candidatos.');
          navigate('/');
          return;
        }

        let { data: profile, error } = await profiles.getCandidateProfile(profileId);

        if (error) {
          console.error('Erro ao carregar perfil:', error);
          
          // Se o erro for relacionado a múltiplos perfis, tenta criar um novo
          if (error.code === 'PGRST116') {
            const initialData = {
              user_id: profileId,
              nome: user?.user_metadata?.name || user.email,
              email: user.email,
              telefone: '',
              experiencia: '',
              educacao: '',
              habilidades: '',
              sobre: '',
              curriculo_url: null,
              curriculo_path: null,
              foto_url: null,
              foto_path: null
            };

            const { data: newProfile, error: createError } = await profiles.createCandidateProfile(initialData);

            if (createError) throw createError;
            profile = newProfile;
          } else {
            throw error;
          }
        }

        // Se não existir perfil e for o próprio usuário, cria um perfil inicial
        if (!profile && user.id === profileId && userType === 'candidate') {
          const initialData = {
            user_id: profileId,
            nome: user?.user_metadata?.name || user.email,
            email: user.email,
            telefone: '',
            experiencia: '',
            educacao: '',
            habilidades: '',
            sobre: '',
            curriculo_url: null,
            curriculo_path: null,
            foto_url: null,
            foto_path: null
          };

          const { data: newProfile, error: createError } = await profiles.createCandidateProfile(initialData);

          if (createError) throw createError;
          profile = newProfile;
        }

        if (profile) {
          setCurrentProfile(profile);
          setFormData({
            nome: profile.nome || '',
            email: profile.email || '',
            telefone: profile.telefone || '',
            experiencia: profile.experiencia || '',
            educacao: profile.educacao || '',
            habilidades: profile.habilidades || '',
            sobre: profile.sobre || '',
            curriculo_url: profile.curriculo_url,
            curriculo_path: profile.curriculo_path,
            foto_url: profile.foto_url,
            foto_path: profile.foto_path
          });

          // Carrega as candidaturas e vagas salvas apenas se for o próprio perfil
          if (isOwnProfile && profile.id) {
            await Promise.all([
              loadApplications(profile.id),
              loadSavedJobs(profile.id)
            ]);
          }
        } else {
          showError('Erro', 'Perfil não encontrado');
          navigate('/');
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        showError('Erro', 'Erro ao carregar perfil');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [user, id, isOwnProfile, userType, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      showLoading('Fazendo upload do arquivo...');

      // Validação de tipo de arquivo para currículo
      if (type === 'curriculo') {
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (!allowedTypes.includes(file.type)) {
          closeLoading();
          showError('Erro', 'Formato de arquivo não suportado. Use PDF ou DOC/DOCX.');
          return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
          closeLoading();
          showError('Erro', 'O arquivo é muito grande. Tamanho máximo: 5MB');
          return;
        }
      }

      // Validação de tipo de arquivo para foto
      if (type === 'foto') {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        
        if (!allowedTypes.includes(file.type)) {
          closeLoading();
          showError('Erro', 'Formato de imagem não suportado. Use JPG ou PNG.');
          return;
        }

        if (file.size > 2 * 1024 * 1024) { // 2MB
          closeLoading();
          showError('Erro', 'A imagem é muito grande. Tamanho máximo: 2MB');
          return;
        }
      }

      // Remove arquivo antigo se existir
      if (formData[`${type}_path`]) {
        await deleteImage(formData[`${type}_path`], type);
      }

      // Faz upload do novo arquivo
      const { url, path } = await uploadImage(file, type);
      
      // Atualiza o estado com as novas informações
      const updateData = {
        ...formData,
        [`${type}_url`]: url,
        [`${type}_path`]: path
      };

      // Atualiza o perfil no banco de dados
      const { error: updateError } = await profiles.updateCandidateProfile(user.id, updateData);
      if (updateError) {
        closeLoading();
        showError('Erro', 'Não foi possível atualizar o perfil com o novo arquivo.');
        return;
      }

      // Atualiza os estados locais
      setFormData(updateData);
      setCurrentProfile(prev => ({
        ...prev,
        [`${type}_url`]: url,
        [`${type}_path`]: path
      }));

      closeLoading();
      showSuccess('Sucesso', `${type === 'foto' ? 'Foto' : 'Currículo'} atualizado com sucesso!`);
    } catch (error) {
      closeLoading();
      if (error.message?.includes('row-level security policy')) {
        showError('Erro', 'Você não tem permissão para fazer upload de arquivos. Por favor, faça login novamente.');
      } else {
        showError('Erro', `Erro ao fazer upload do ${type === 'foto' ? 'foto' : 'currículo'}. Tente novamente.`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await profiles.updateCandidateProfile(user.id, formData);
      if (error) throw error;

      setCurrentProfile({
        ...currentProfile,
        ...formData
      });
      
      showSuccess('Sucesso', 'Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      showError('Erro', 'Não foi possível atualizar o perfil');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="status-icon approved" />;
      case 'rejected':
        return <FaTimesCircle className="status-icon rejected" />;
      default:
        return <FaHourglassHalf className="status-icon pending" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      default:
        return 'Pendente';
    }
  };

  const renderApplications = () => {
    if (!applications.length) {
      return (
        <div className="empty-state">
          <p>Nenhuma candidatura encontrada</p>
        </div>
      );
    }

    return (
      <div className="applications-list">
        {applications.map((application) => (
          <div key={application.id} className="application-card">
            <div className="application-header">
              <FaBuilding className="company-icon" />
              <h4>{application.job.titulo}</h4>
            </div>
            <div className="application-company">
              {application.job.company.nome_empresa}
            </div>
            <div className="application-info">
              <div className="application-date">
                <FaClock />
                <span>Candidatura em: {new Date(application.created_at).toLocaleDateString()}</span>
              </div>
              <div className={`application-status ${application.status}`}>
                {getStatusIcon(application.status)}
                <span>{getStatusText(application.status)}</span>
              </div>
            </div>
            {application.feedback && (
              <div className="application-feedback">
                <strong>Feedback:</strong>
                <p>{application.feedback}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSidebar = () => (
    <div className="profile-sidebar">
      <div className="profile-nav">
        <div className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          <FaUser />
          <span>Perfil do Usuário</span>
        </div>
        {isOwnProfile && (
          <>
            <div className={`nav-item ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>
              <FaBriefcase />
              <span>Minhas Candidaturas</span>
            </div>
            <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              <FaCog />
              <span>Configurações</span>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderProfileHeader = () => (
    <div className="profile-header">
      <div className="profile-picture">
        {currentProfile?.foto_url ? (
          <img src={currentProfile.foto_url} alt={currentProfile.nome} />
        ) : (
          <FaUser size={40} color="#4f5660" />
        )}
        {isOwnProfile && (
          <div className="change-photo" onClick={() => document.getElementById('foto-input').click()}>
            <FaCamera /> Alterar foto
          </div>
        )}
      </div>
      <h2 className="profile-name">{currentProfile?.nome}</h2>
      <div className="profile-username">@{currentProfile?.email?.split('@')[0]}</div>
      {currentProfile?.curriculo_url && (
        <a 
          href={currentProfile.curriculo_url}
          target="_blank"
          rel="noopener noreferrer"
          className="download-resume-button"
        >
          <FaFileAlt /> Visualizar Currículo
        </a>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="profile-content">
      <form onSubmit={handleSubmit}>
        <div className="settings-section">
          <h3 className="settings-title">Informações do Usuário</h3>
          <div className="settings-field">
            <label>Nome Completo</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="settings-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="settings-field">
            <label>Telefone</label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="settings-section">
          <h3 className="settings-title">Perfil Profissional</h3>
          <div className="settings-field">
            <label>Sobre Você</label>
            <textarea
              name="sobre"
              value={formData.sobre}
              onChange={handleInputChange}
              placeholder="Conte um pouco sobre sua trajetória profissional..."
            />
          </div>
          <div className="settings-field">
            <label>Experiência</label>
            <textarea
              name="experiencia"
              value={formData.experiencia}
              onChange={handleInputChange}
              placeholder="Descreva suas experiências profissionais..."
            />
          </div>
          <div className="settings-field">
            <label>Educação</label>
            <textarea
              name="educacao"
              value={formData.educacao}
              onChange={handleInputChange}
              placeholder="Descreva sua formação acadêmica..."
            />
          </div>
          <div className="settings-field">
            <label>Habilidades</label>
            <textarea
              name="habilidades"
              value={formData.habilidades}
              onChange={handleInputChange}
              placeholder="Liste suas principais habilidades..."
            />
          </div>
        </div>

        <div className="settings-section">
          <h3 className="settings-title">Documentos</h3>
          <div className="settings-field">
            <label>Currículo</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileUpload(e, 'curriculo')}
              className="file-input"
            />
            {formData.curriculo_url && (
              <div className="hint">
                Currículo atual: <a href={formData.curriculo_url} target="_blank" rel="noopener noreferrer">Visualizar</a>
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="save-button">
          Salvar Alterações
        </button>
      </form>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'settings':
        return renderSettings();
      case 'applications':
        return (
          <div className="profile-content">
            <h3 className="settings-title">Minhas Candidaturas</h3>
            {renderApplications()}
          </div>
        );
      default:
        return (
          <div className="profile-content">
            <div className="settings-section">
              <h3 className="settings-title">Sobre</h3>
              <p>{currentProfile?.sobre || 'Nenhuma informação disponível'}</p>
            </div>
            <div className="settings-section">
              <h3 className="settings-title">Experiência</h3>
              <p>{currentProfile?.experiencia || 'Nenhuma experiência cadastrada'}</p>
            </div>
            <div className="settings-section">
              <h3 className="settings-title">Educação</h3>
              <p>{currentProfile?.educacao || 'Nenhuma formação cadastrada'}</p>
            </div>
            <div className="settings-section">
              <h3 className="settings-title">Habilidades</h3>
              <p>{currentProfile?.habilidades || 'Nenhuma habilidade cadastrada'}</p>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando perfil...</p>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="error-container">
        <p>Perfil não encontrado</p>
        <button onClick={() => navigate('/')} className="back-button">
          Voltar para Home
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {renderSidebar()}
      <div className="profile-main">
        {renderProfileHeader()}
        {renderContent()}
      </div>
      <input
        type="file"
        id="foto-input"
        accept="image/*"
        onChange={(e) => handleFileUpload(e, 'foto')}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default CandidateProfile; 
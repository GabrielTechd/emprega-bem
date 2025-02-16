import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import * as supabaseService from '../../services/supabaseService';
import { showSuccess, showError } from '../../utils/alerts';
import './NewJob.css';

const NewJob = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [jobForm, setJobForm] = useState({
    titulo: '',
    descricao: '',
    requisitos: '',
    salario: '',
    tipo_contrato: '',
    local: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !userProfile) {
      showError('Erro', 'Você precisa estar logado para criar uma vaga');
      return;
    }

    try {
      setIsLoading(true);

      // Busca o perfil da empresa
      const { data: companyProfile, error: profileError } = await supabaseService.getCompanyProfile(user.id);
      
      if (profileError || !companyProfile) {
        throw new Error('Perfil da empresa não encontrado');
      }

      // Cria a vaga
      const { data, error } = await supabaseService.createJob({
        ...jobForm,
        company_id: companyProfile.id,
        status: 'active',
        salario: parseFloat(jobForm.salario)
      });

      if (error) throw error;

      await showSuccess('Sucesso', 'Vaga criada com sucesso!');
      navigate('/empresa/perfil/' + user.id);
    } catch (error) {
      console.error('Erro ao criar vaga:', error);
      showError('Erro', 'Erro ao criar vaga');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="new-job-container">
      <div className="new-job-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Voltar
        </button>
        <h1>Nova Vaga</h1>
      </div>

      <form className="new-job-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Informações da Vaga</h2>
          
          <div className="form-field">
            <label>Título da Vaga*</label>
            <input
              type="text"
              name="titulo"
              value={jobForm.titulo}
              onChange={handleInputChange}
              placeholder="Ex: Desenvolvedor Full Stack"
              required
            />
          </div>

          <div className="form-field">
            <label>Descrição*</label>
            <textarea
              name="descricao"
              value={jobForm.descricao}
              onChange={handleInputChange}
              placeholder="Descreva as principais responsabilidades e atividades da vaga"
              required
            />
          </div>

          <div className="form-field">
            <label>Requisitos*</label>
            <textarea
              name="requisitos"
              value={jobForm.requisitos}
              onChange={handleInputChange}
              placeholder="Liste as habilidades e experiências necessárias"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Salário*</label>
              <input
                type="number"
                name="salario"
                value={jobForm.salario}
                onChange={handleInputChange}
                placeholder="Ex: 5000"
                required
              />
            </div>

            <div className="form-field">
              <label>Tipo de Contrato*</label>
              <select
                name="tipo_contrato"
                value={jobForm.tipo_contrato}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione...</option>
                <option value="CLT">CLT</option>
                <option value="PJ">PJ</option>
                <option value="Temporário">Temporário</option>
                <option value="Estágio">Estágio</option>
              </select>
            </div>
          </div>

          <div className="form-field">
            <label>Local*</label>
            <input
              type="text"
              name="local"
              value={jobForm.local}
              onChange={handleInputChange}
              placeholder="Ex: São Paulo, SP (Remoto)"
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
            Cancelar
          </button>
          <button type="submit" className="submit-button" disabled={isLoading}>
            <FaSave /> {isLoading ? 'Criando...' : 'Publicar Vaga'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewJob; 
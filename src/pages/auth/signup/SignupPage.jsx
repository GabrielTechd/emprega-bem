import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import './SignupPage.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    userType: 'candidate', // 'candidate' ou 'company'
    email: '',
    password: '',
    confirmPassword: '',
    // Campos de candidato
    nome: '',
    telefone: '',
    // Campos de empresa
    nome_empresa: '',
    cnpj: '',
    telefone_empresa: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validações comuns
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    // Validações específicas para candidato
    if (formData.userType === 'candidate') {
      if (!formData.nome.trim()) {
        newErrors.nome = 'Nome é obrigatório';
      }
      if (!formData.telefone.trim()) {
        newErrors.telefone = 'Telefone é obrigatório';
      }
    }

    // Validações específicas para empresa
    if (formData.userType === 'company') {
      if (!formData.nome_empresa.trim()) {
        newErrors.nome_empresa = 'Nome da empresa é obrigatório';
      }
      if (!formData.cnpj.trim()) {
        newErrors.cnpj = 'CNPJ é obrigatório';
      }
      if (!formData.telefone_empresa.trim()) {
        newErrors.telefone_empresa = 'Telefone é obrigatório';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Preparar dados do perfil baseado no tipo de usuário
        const profileData = formData.userType === 'candidate' 
          ? {
              nome: formData.nome,
              email: formData.email,
              telefone: formData.telefone
            }
          : {
              nome_empresa: formData.nome_empresa,
              email: formData.email,
              telefone: formData.telefone_empresa,
              cnpj: formData.cnpj
            };

        const { data, error } = await signUp({
          email: formData.email,
          password: formData.password,
          userType: formData.userType,
          profileData
        });

        if (error) {
          setErrors({ submit: error.message });
          return;
        }

        if (data) {
          navigate('/');
        }
      } catch (error) {
        setErrors({ submit: 'Erro ao criar conta. Tente novamente.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-content">
          <h1>Crie sua conta</h1>
          <p className="subtitle">Junte-se ao EmpregaBem</p>

          <div className="user-type-selector">
            <button
              type="button"
              className={`type-button ${formData.userType === 'candidate' ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, userType: 'candidate' }))}
            >
              Sou Candidato
            </button>
            <button
              type="button"
              className={`type-button ${formData.userType === 'company' ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, userType: 'company' }))}
            >
              Sou Empresa
            </button>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            {errors.submit && (
              <div className="error-message global-error">
                {errors.submit}
              </div>
            )}

            {formData.userType === 'candidate' ? (
              <>
                <div className="form-group">
                  <label htmlFor="nome">Nome Completo</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className={errors.nome ? 'error' : ''}
                    disabled={isLoading}
                  />
                  {errors.nome && <span className="error-message">{errors.nome}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="telefone">Telefone</label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className={errors.telefone ? 'error' : ''}
                    disabled={isLoading}
                  />
                  {errors.telefone && <span className="error-message">{errors.telefone}</span>}
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="nome_empresa">Nome da Empresa</label>
                  <input
                    type="text"
                    id="nome_empresa"
                    name="nome_empresa"
                    value={formData.nome_empresa}
                    onChange={handleChange}
                    className={errors.nome_empresa ? 'error' : ''}
                    disabled={isLoading}
                  />
                  {errors.nome_empresa && <span className="error-message">{errors.nome_empresa}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cnpj">CNPJ</label>
                  <input
                    type="text"
                    id="cnpj"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleChange}
                    className={errors.cnpj ? 'error' : ''}
                    disabled={isLoading}
                  />
                  {errors.cnpj && <span className="error-message">{errors.cnpj}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="telefone_empresa">Telefone</label>
                  <input
                    type="tel"
                    id="telefone_empresa"
                    name="telefone_empresa"
                    value={formData.telefone_empresa}
                    onChange={handleChange}
                    className={errors.telefone_empresa ? 'error' : ''}
                    disabled={isLoading}
                  />
                  {errors.telefone_empresa && <span className="error-message">{errors.telefone_empresa}</span>}
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <div className="login-link">
            <p>
              Já tem uma conta?{' '}
              <Link to="/login">Faça login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 
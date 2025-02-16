import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave, FaClock, FaBookmark } from 'react-icons/fa';
import './JobDetailsPage.css';

const JobDetailsPage = ({ jobs }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = jobs.find((j) => j.id === parseInt(id));

  // Scroll para o topo quando a página carregar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]); // Executa quando o ID da vaga mudar

  const handleApply = () => {
    navigate('/cadastro', { 
      state: { 
        role: 'candidate',
        redirectFrom: 'job',
        jobId: id 
      } 
    });
  };

  const handleSave = () => {
    navigate('/cadastro', { 
      state: { 
        role: 'candidate',
        redirectFrom: 'save',
        jobId: id 
      } 
    });
  };

  if (!job) {
    return (
      <div className="container">
        <div className="not-found">
          <h2>Vaga não encontrada</h2>
          <p>A vaga que você está procurando não existe ou foi removida.</p>
          <Link to="/" className="btn-primary">
            Voltar para vagas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      <div className="container">
        <div className="job-header">
          <div className="company-info">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.company} className="company-logo" />
            ) : (
              <div className="company-logo-placeholder">
                {job.company.charAt(0)}
              </div>
            )}
            <div>
              <h1>{job.title}</h1>
              <h2>{job.company}</h2>
            </div>
          </div>

          <div className="job-meta">
            <div className="meta-item">
              <FaMapMarkerAlt />
              <span>{job.city}, {job.state}</span>
            </div>
            <div className="meta-item">
              <FaBriefcase />
              <span>{job.type}</span>
            </div>
            <div className="meta-item">
              <FaMoneyBillWave />
              <span>{job.salary}</span>
            </div>
            <div className="meta-item">
              <FaClock />
              <span>{job.contractType}</span>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-primary" onClick={handleApply}>
              Candidatar-se
            </button>
            <button className="btn-secondary" onClick={handleSave}>
              <FaBookmark /> Salvar vaga
            </button>
          </div>
        </div>

        <div className="job-content">
          <section className="job-section">
            <h3>Descrição da vaga</h3>
            <div className="job-description">
              {job.description}
            </div>
          </section>

          <section className="job-section">
            <h3>Requisitos</h3>
            <ul className="requirements-list">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </section>

          <section className="job-section">
            <h3>Benefícios</h3>
            <ul className="benefits-list">
              {job.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </section>

          <section className="job-section">
            <h3>Sobre a empresa</h3>
            <p className="company-description">
              {job.companyDescription || `${job.company} é uma empresa líder em seu segmento, 
              comprometida com a inovação e o desenvolvimento de seus colaboradores.`}
            </p>
          </section>
        </div>

        <div className="similar-jobs">
          <h3>Vagas similares</h3>
          <div className="similar-jobs-grid">
            {jobs
              .filter((j) => j.id !== job.id && j.type === job.type)
              .slice(0, 3)
              .map((similarJob) => (
                <Link 
                  to={`/vaga/${similarJob.id}`} 
                  key={similarJob.id} 
                  className="similar-job-card"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <h4>{similarJob.title}</h4>
                  <p>{similarJob.company}</p>
                  <span>{similarJob.city}, {similarJob.state}</span>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage; 
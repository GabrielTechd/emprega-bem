import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave } from 'react-icons/fa';
import './JobCard.css';

const JobCard = ({ job }) => {
  const formatSalary = (salary) => {
    if (!salary) return 'A combinar';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(salary);
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3>{job.titulo}</h3>
        <span className="company-name">{job.company?.nome_empresa}</span>
      </div>

      <div className="job-card-info">
        <div className="info-item">
          <FaMapMarkerAlt />
          <span>{job.local || 'Remoto'}</span>
        </div>
        <div className="info-item">
          <FaBriefcase />
          <span>{job.tipo_contrato}</span>
        </div>
        <div className="info-item">
          <FaMoneyBillWave />
          <span>{formatSalary(job.salario)}</span>
        </div>
      </div>

      <p className="job-description">
        {job.descricao?.substring(0, 150)}
        {job.descricao?.length > 150 ? '...' : ''}
      </p>

      <div className="job-card-footer">
        <Link to={`/jobs/${job.id}`} className="view-job-button">
          Ver Vaga
        </Link>
        <span className="posted-date">
          {new Date(job.created_at).toLocaleDateString('pt-BR')}
        </span>
      </div>
    </div>
  );
};

export default JobCard;

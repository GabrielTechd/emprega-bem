import './JobDetails.css';
import React from 'react';
import { useParams } from 'react-router-dom';

function JobDetails({ jobs }) {
  const { id, title, company } = useParams();  // Pega os parâmetros da URL
  const job = jobs.find(job => 
    job.id === parseInt(id, 10) &&
    job.title.toLowerCase().replace(/[^a-z0-9]/g, '') === title.toLowerCase().replace(/[^a-z0-9]/g, '') && 
    job.company.toLowerCase().replace(/[^a-z0-9]/g, '') === company.toLowerCase().replace(/[^a-z0-9]/g, '')
  );  // Busca a vaga com base no ID, título e empresa, considerando possíveis modificações na URL

  if (!job) {
    return <p>Vaga não encontrada</p>;
  }

  return (
    <div className="job-details-container">
      <h2>{job.title}</h2>
      <div className="job-details">
        <span><strong>Empresa:</strong> {job.company}</span>
        <span><strong>Localização:</strong> {job.city} {job.state && `/ ${job.state}`}</span>
        <span><strong>Tipo:</strong> {job.type}</span>
        <span><strong>Salário:</strong> {job.salary}</span>
      </div>

      <div className="section">
        <h3>Descrição</h3>
        <p>{job.description}</p>
      </div>

      <div className="section">
        <h3>Requisitos</h3>
        <p>{job.requirements}</p>
      </div>

      <div className="section">
        <h3>Benefícios</h3>
        <p>{job.benefits}</p>
      </div>

      <div className="section">
        <h3>Cultura da Empresa</h3>
        <p>{job.companyCulture}</p>
      </div>

      <div className="section">
        <h3>Oportunidades de Carreira</h3>
        <p>{job.careerGrowth}</p>
      </div>

      <div className="section">
        <h3>Processo Seletivo</h3>
        <p>{job.applicationProcess}</p>
      </div>

      <div className="job-extra-info">
        <p><strong>Data de Publicação:</strong> {job.postedAt}</p>
        <p><strong>Data Limite:</strong> {job.deadline}</p>
      </div>

      <button className="apply-button">Candidate-se</button>
    </div>
  );
}

export default JobDetails;

import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import JobCard from '../../components/JobCard/JobCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import Filters from '../../components/Filters/Filters';
import { showError } from '../../utils/alerts';
import './HomePage.css';

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    salary: '',
    city: '',
    state: '',
    company: '',
    contractType: '',
    workMode: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    loadJobs();
  }, [searchTerm, filters, currentPage]);

  const loadJobs = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('jobs')
        .select(`
          *,
          company:company_profiles(*)
        `)
        .eq('status', 'active')
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (searchTerm) {
        query = query.or(`titulo.ilike.%${searchTerm}%,descricao.ilike.%${searchTerm}%`);
      }

      if (filters.salary) {
        query = query.eq('salario', filters.salary);
      }

      if (filters.city) {
        query = query.ilike('local', `%${filters.city}%`);
      }

      if (filters.state) {
        query = query.ilike('estado', `%${filters.state}%`);
      }

      if (filters.company) {
        query = query.ilike('company.nome_empresa', `%${filters.company}%`);
      }

      if (filters.contractType) {
        query = query.eq('tipo_contrato', filters.contractType);
      }

      if (filters.workMode) {
        query = query.eq('modalidade', filters.workMode);
      }

      const { data: jobsData, error } = await query;

      if (error) throw error;

      setJobs(jobsData || []);
    } catch (error) {
      showError('Erro', 'Não foi possível carregar as vagas');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      salary: '',
      city: '',
      state: '',
      company: '',
      contractType: '',
      workMode: ''
    });
    setCurrentPage(1);
  };

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Encontre sua próxima oportunidade</h1>
          <p>Milhares de vagas disponíveis para você</p>
        </div>
      </section>

      <section className="search-section">
        <div className="search-container">
          <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
          <Filters onFilter={handleFilter} initialFilters={filters} />
        </div>
      </section>

      <section className="jobs-section">
        <div className="jobs-header">
          <h2>Vagas em Destaque</h2>
          {jobs.length > 0 && (
            <p className="jobs-count">{jobs.length} vagas encontradas</p>
          )}
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando vagas...</p>
          </div>
        ) : jobs.length > 0 ? (
          <>
            <div className="jobs-grid">
              {jobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Anterior
              </button>
              <span className="page-info">Página {currentPage}</span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={jobs.length < itemsPerPage}
                className="pagination-button"
              >
                Próxima
              </button>
            </div>
          </>
        ) : (
          <div className="no-jobs">
            <p>Nenhuma vaga encontrada com os filtros atuais.</p>
            <button 
              onClick={handleClearFilters}
              className="clear-filters-button"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage; 
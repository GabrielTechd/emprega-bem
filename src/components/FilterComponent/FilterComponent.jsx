import React, { useState } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';
import './FilterComponent.css';

const FilterComponent = ({ filters, setFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      salary: '',
      city: '',
      state: '',
      company: '',
      contractType: '',
      workMode: ''
    });
  };

  const states = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
    'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
    'SP', 'SE', 'TO'
  ];

  const contractTypes = ['CLT', 'PJ', 'Estágio', 'Temporário'];
  const workModes = ['Presencial', 'Remoto', 'Híbrido'];

  return (
    <div className="filter-component">
      <button
        className="filter-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaFilter />
        Filtros
        {Object.values(filters).some(value => value) && (
          <span className="filter-count">
            {Object.values(filters).filter(value => value).length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="filter-panel">
          <div className="filter-header">
            <h3>Filtros</h3>
            {Object.values(filters).some(value => value) && (
              <button className="clear-filters" onClick={clearFilters}>
                <FaTimes />
                Limpar filtros
              </button>
            )}
          </div>

          <div className="filter-grid">
            <div className="filter-group">
              <label htmlFor="city">Cidade</label>
              <input
                type="text"
                id="city"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                placeholder="Digite a cidade"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="state">Estado</label>
              <select
                id="state"
                value={filters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
              >
                <option value="">Todos</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="company">Empresa</label>
              <input
                type="text"
                id="company"
                value={filters.company}
                onChange={(e) => handleFilterChange('company', e.target.value)}
                placeholder="Digite a empresa"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="contractType">Tipo de Contrato</label>
              <select
                id="contractType"
                value={filters.contractType}
                onChange={(e) => handleFilterChange('contractType', e.target.value)}
              >
                <option value="">Todos</option>
                {contractTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="workMode">Modalidade</label>
              <select
                id="workMode"
                value={filters.workMode}
                onChange={(e) => handleFilterChange('workMode', e.target.value)}
              >
                <option value="">Todas</option>
                {workModes.map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="salary">Faixa Salarial</label>
              <select
                id="salary"
                value={filters.salary}
                onChange={(e) => handleFilterChange('salary', e.target.value)}
              >
                <option value="">Todas</option>
                <option value="0-3000">Até R$ 3.000</option>
                <option value="3000-5000">R$ 3.000 - R$ 5.000</option>
                <option value="5000-8000">R$ 5.000 - R$ 8.000</option>
                <option value="8000-12000">R$ 8.000 - R$ 12.000</option>
                <option value="12000+">Acima de R$ 12.000</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;

import React, { useState } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';
import './Filters.css';

const Filters = ({ onFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    salary: '',
    city: '',
    state: '',
    company: '',
    contractType: '',
    workMode: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      salary: '',
      city: '',
      state: '',
      company: '',
      contractType: '',
      workMode: ''
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
    setIsOpen(false);
  };

  const states = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
    'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
    'SP', 'SE', 'TO'
  ];

  return (
    <div className="filters">
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
              <button className="clear-filters" onClick={handleClear}>
                <FaTimes />
                Limpar filtros
              </button>
            )}
          </div>

          <div className="filter-grid">
            <div className="filter-group">
              <label>Cidade</label>
              <input
                type="text"
                name="city"
                placeholder="Digite a cidade..."
                value={filters.city}
                onChange={handleChange}
              />
            </div>

            <div className="filter-group">
              <label>Estado</label>
              <select name="state" value={filters.state} onChange={handleChange}>
                <option value="">Todos</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Empresa</label>
              <input
                type="text"
                name="company"
                placeholder="Digite a empresa..."
                value={filters.company}
                onChange={handleChange}
              />
            </div>

            <div className="filter-group">
              <label>Tipo de Contrato</label>
              <select name="contractType" value={filters.contractType} onChange={handleChange}>
                <option value="">Todos</option>
                <option value="CLT">CLT</option>
                <option value="PJ">PJ</option>
                <option value="Temporário">Temporário</option>
                <option value="Estágio">Estágio</option>
                <option value="Freelancer">Freelancer</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Modalidade</label>
              <select name="workMode" value={filters.workMode} onChange={handleChange}>
                <option value="">Todas</option>
                <option value="Presencial">Presencial</option>
                <option value="Remoto">Remoto</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Faixa Salarial</label>
              <select name="salary" value={filters.salary} onChange={handleChange}>
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

export default Filters; 
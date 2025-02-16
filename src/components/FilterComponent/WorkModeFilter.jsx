import React, { useState } from 'react';

function WorkModeFilter({ onFilterChange }) {
  const [workMode, setWorkMode] = useState('');

  return (
    <div className="filter-group">
      <label htmlFor="work-mode">Modalidade de Trabalho</label>
      <select
        id="work-mode"
        value={workMode}
        onChange={(e) => {
          setWorkMode(e.target.value);
          onFilterChange({ workMode: e.target.value }); // Enviando workMode para o filtro
        }}
      >
        <option value="">Selecione uma modalidade</option>
        <option value="Remoto">Remoto</option>
        <option value="Presencial">Presencial</option>
        <option value="Híbrido">Híbrido</option>
        <option value="Flexível">Flexível</option>
        <option value="Intermitente">Intermitente</option>
        <option value="Freelancer">Freelancer</option>
        <option value="Autônomo">Autônomo</option>
        <option value="Estágio">Estágio</option>
        <option value="Temporário">Temporário</option>
      </select>
    </div>
  );
}

export default WorkModeFilter;

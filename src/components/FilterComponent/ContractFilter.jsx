import React, { useState } from 'react';

function ContractFilter({ onFilterChange }) {
  const [contractType, setContractType] = useState('');

  return (
    <div className="filter-group">
      <label htmlFor="contract-type">Tipo de Contrato</label>
      <select
        id="contract-type"
        value={contractType}
        onChange={(e) => {
          setContractType(e.target.value);
          onFilterChange({ contractType: e.target.value }); // Enviando contractType para o filtro
        }}
      >
        <option value="">Selecione um contrato</option>
        <option value="CLT">CLT</option>
        <option value="PJ">PJ</option>
        <option value="Freelancer">Freelancer</option>
        <option value="Estágio">Estágio</option>
        <option value="Temporário">Temporário</option>
        <option value="Comissão">Comissão</option>
        <option value="Híbrido">Híbrido</option>
        <option value="Autônomo">Autônomo</option>
        <option value="Intermitente">Intermitente</option>
        <option value="Aprendiz">Aprendiz</option>
        <option value="Associado">Associado</option>
        <option value="Consultoria">Consultoria</option>
        <option value="Contrato de Resultados">Contrato de Resultados</option>
      </select>
    </div>
  );
}

export default ContractFilter;

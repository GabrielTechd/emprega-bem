import React, { useState } from 'react';

function CompanyFilter({ onFilterChange }) {
  const [company, setCompany] = useState('');

  return (
    <div className="filter-group">
      <label htmlFor="company">Empresa</label>
      <input
        id="company"
        type="text"
        placeholder="Ex: Tech Solutions"
        value={company}
        onChange={(e) => {
          setCompany(e.target.value);
          onFilterChange({ company: e.target.value });
        }}
      />
    </div>
  );
}

export default CompanyFilter;

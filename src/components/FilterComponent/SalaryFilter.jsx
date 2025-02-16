import React, { useState } from 'react';

function SalaryFilter({ onFilterChange }) {
  const [salary, setSalary] = useState('');

  const formatSalary = (value) => {
    return value.replace(/\D/g, '').replace(/(\d)(\d{3})$/, '$1.$2');
  };

  const handleChange = (e) => {
    const formattedSalary = formatSalary(e.target.value);
    setSalary(formattedSalary);
    onFilterChange({ salary: formattedSalary });
  };

  return (
    <div className="filter-group">
      <label htmlFor="salary">Salário</label>
      <input
        id="salary"
        type="text"
        placeholder="Ex: R$ 5.000"
        value={salary}
        onChange={handleChange}
      />
    </div>
  );
}

export default SalaryFilter;

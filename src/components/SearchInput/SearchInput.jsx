import './SearchInput.css';
import React from 'react';
import { FaSearch } from 'react-icons/fa'; // Importando o ícone de pesquisa

const SearchInput = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-input-container">
      <FaSearch className="search-icon" />
      <input
        type="text"
        placeholder="Busque por cargo, empresa ou palavra-chave"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default SearchInput;

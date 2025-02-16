import React, { useState, useEffect } from 'react';

function LocationFilter({ onFilterChange, filters }) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [state, setState] = useState(filters.state || '');
  const [city, setCity] = useState(filters.city || '');

  useEffect(() => {
    fetch('https://brasilapi.com.br/api/ibge/uf/v1')
      .then((res) => res.json())
      .then((data) => setStates(data))
      .catch((error) => console.error('Erro ao obter estados:', error));
  }, []);

  useEffect(() => {
    if (state) {
      fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${state}`)
        .then((res) => res.json())
        .then((data) => setCities(data))
        .catch((error) => console.error('Erro ao obter cidades:', error));
    } else {
      setCities([]);
    }
    setCity(''); // Resetar cidade ao trocar estado
  }, [state]);

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setState(newState);
    setCity(''); // Resetar cidade ao trocar estado
    onFilterChange({ ...filters, state: newState, city: '' });
  };

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setCity(newCity);
    onFilterChange({ ...filters, city: newCity });
  };

  return (
    <>
      <div className="filter-group">
        <label htmlFor="state">Estado</label>
        <select id="state" value={state} onChange={handleStateChange}>
          <option value="">Selecione um estado</option>
          {states.map((uf) => (
            <option key={uf.sigla} value={uf.sigla}>
              {uf.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="city">Cidade</label>
        <select id="city" value={city} onChange={handleCityChange} disabled={!state}>
          <option value="">Selecione uma cidade</option>
          {cities.map((municipio) => (
            <option key={municipio.codigo_ibge} value={municipio.nome}>
              {municipio.nome}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default LocationFilter;

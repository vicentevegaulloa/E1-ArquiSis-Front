import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CompanyList.css'

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://api.valeria-riquel.me/stocks')
      .then((response) => {
        setCompanies(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener datos:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="company-list">
      <h2>Available Company List</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Short Name</th>
              <th>Symbol</th>
              <th>Price</th>
              <th>Currency</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} className="company-item">
                <td>{company.shortName}</td>
                <td>{company.symbol}</td>
                <td>{company.price}</td>
                <td>{company.currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CompanyList;

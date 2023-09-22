import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CompanyList.css'; // Asegúrate de importar el archivo CSS

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
    <div className="table-title"> 
      <h3>Available Companies</h3>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="table-fill"> 
          <thead>
            <tr>
              <th className="text-left">Short Name</th>
              <th className="text-left">Symbol</th>
              <th className="text-left">Price</th>
              <th className="text-left">Currency</th>
            </tr>
          </thead>
          <tbody className="table-hover"> 
            {companies.map((company) => (
              <tr key={company.id} className="company-item">
                <td className="text-left">{company.shortName}</td>
                <td className="text-left">{company.symbol}</td>
                <td className="text-left">{company.price}</td>
                <td className="text-left">{company.currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CompanyList;

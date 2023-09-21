import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HistoryRecord.css'

const companiesPerPage = 6;
const stocksPerPage = 3;
const dataC = [1,2,3,4,5,6,7,8,9,10]
const dataS = ["a", "b", "f", "g", "f", "aa"]

const HistoryRecord = () => {

  const navigate = useNavigate();
  const navigateToBuy = () => {
    navigate('/buy');
  };
    
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPageC, setCurrentPageC] = useState(1);
  const [currentPageS, setCurrentPageS] = useState(1);
  
  const totalPagesC = Math.ceil(dataC.length / companiesPerPage);
  const startIndexC = (currentPageC - 1) * companiesPerPage;
  const endIndexC = startIndexC + companiesPerPage;
    
  const totalPagesA = Math.ceil(dataS.length / stocksPerPage);
  const startIndexS = (currentPageS - 1) * stocksPerPage;
  const endIndexS = startIndexS + stocksPerPage;
  
  const currentCompanies = dataC.slice(startIndexC, endIndexC);
  const currentStocks = dataS.slice(startIndexS, endIndexS);

  const handlePageChangeC = (newPage) => {
    setCurrentPageC(newPage);
  };

  const handlePageChangeS = (newPage) => {
    setCurrentPageS(newPage);
  };  

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
    <div className="content">
      <h2>Historical records per company</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <caption>
            <div className="pagination">
                <button onClick={() => handlePageChangeC(currentPageC - 1)} disabled={currentPageC === 1}>
                  ❮
                </button>
                <span>{currentPageC} of {totalPagesC} pages</span>
                <button onClick={() => handlePageChangeC(currentPageC + 1)} disabled={currentPageC === totalPagesC}>
                  ❯
                </button>
            </div>
          </caption>
          
          <thead>
            <tr>
              <th>Short Name</th>
              <th>Symbol</th>
              <th>Price</th>
              <th>Currency</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <div className="empresas">
                <ul>
                {currentCompanies.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
                </ul>
            </div>
            {companies.map((company) => (
              <tr key={company.id} className="company-item">
                <td>{company.shortName}</td>
                <td>{company.symbol}</td>
                <td>{company.price}</td>
                <td>{company.currency}</td>
                <td>
                  <button onClick={navigateToBuy}>Buy</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HistoryRecord;

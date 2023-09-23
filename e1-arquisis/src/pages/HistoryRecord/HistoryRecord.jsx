import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import './HistoryRecord.css'

const API_BASE_URL = 'https://api.valeria-riquel.me';

const stocksPerPage = 3;

const HistoryRecord = () => {
  const { symbol } = useParams();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterQueryParam = queryParams.get('filter');

  const navigate = useNavigate();
  const navigateToBuy = () => {
    navigate('/buy');
  };
    
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPageS, setCurrentPageS] = useState(1);
  const [orderBy, setOrderBy] = useState("orderby_asc");
  const [filterText, setFilterText] = useState(filterQueryParam || ''); 

  
  const handleChangeOrder = (event) => {
    const selectedValue = event.target.value;
    setOrderBy(selectedValue);
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/stocks`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const sortedStocks = data.filter((company) => company.symbol === symbol);
        
        if (orderBy === "orderby_asc") {
          sortedStocks.sort((a, b) => a.datetime.localeCompare(b.datetime));
        } else if (orderBy === "orderby_desc") {
          sortedStocks.sort((a, b) => b.datetime.localeCompare(a.datetime));
        }

        setCompanies(sortedStocks);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setLoading(false);
      });
  }, [orderBy, filterText, symbol]);
  
  const filteredCompanies = companies.filter(company => company.symbol.includes(filterText));
  let totalPagesS = Math.ceil(filteredCompanies.length / stocksPerPage);
  totalPagesS = Math.max(totalPagesS, 1);

  const handlePageChangeS = (newPage) => {
    setCurrentPageS(newPage);
  };  

  const startIndexS = (currentPageS - 1) * stocksPerPage;
  const endIndexS = startIndexS + stocksPerPage;
  const currentStocks = filteredCompanies.slice(startIndexS, endIndexS);

  return (
    <div className="content">
      <h2>Historical records per company</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <caption>
            <div className='tablecaptionspace'>
              <div className="pagination">
                  <button onClick={() => handlePageChangeS(currentPageS - 1)} disabled={currentPageS === 1}>
                    ❮
                  </button>
                  <span>{currentPageS} of {totalPagesS} pages</span>
                  <button onClick={() => handlePageChangeS(currentPageS + 1)} disabled={currentPageS === totalPagesS}>
                    ❯
                  </button>
              </div>
              <div className='selector'> 
                <select onChange={(event) => handleChangeOrder(event)}>
                  <label>Order by</label>
                  <option value="orderby_asc">From oldest</option>
                  <option value="orderby_desc">From newest</option>
                </select>
              </div>
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
            {currentStocks.map((company) => (
              <tr key={company.id} className="company-item">
                <td>{company.shortName}</td>
                <td>{company.symbol}</td>
                <td>{company.price}</td>
                <td>{company.currency}</td>
                <td style={{ textAlign: "center" }}>
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

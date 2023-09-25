import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import callApi from '../../fetchData';
import './Stocks.css';

const API_BASE_URL = 'https://api.valeria-riquel.me';
const companiesPerPage = 8;

const AllCompanies = () => {

  const [postData, setPostData] = useState(null);
  const [getData, setGetData] = useState(null);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await callApi('/users', 'POST', true, {});
        console.log('DataPost: ', data);
        setPostData(data);
      } catch (error) {
        console.error(error);
        try {
          const data = await callApi('/users', 'GET');
          console.log('DataGet: ', data);
          setGetData(data);
        } catch (retryError) {
          console.error(retryError);
        }
      }
    };

    fetchData();
  }, []);

  let userId;

  if (postData === null && getData === null) {
    userId = null; // Handle the case when both are null
  } else if (postData === null) {
    userId = getData.id;
  } else {
    userId = postData.id;
  };
  
  console.log(userId);

  const navigate = useNavigate();
    
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPageC, setCurrentPageC] = useState(1);
  const [orderBy, setOrderBy] = useState("orderby_asc");

  const handleChangeOrder = (event) => {
    const selectedValue = event.target.value;
    setOrderBy(selectedValue);
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/stocks`)
      .then((response) => response.json())
      .then((data) => {
        const sortedCompanies = [...data];
        
        if (orderBy === "orderby_asc") {
          sortedCompanies.sort((a, b) => a.shortName.localeCompare(b.shortName));
        } else if (orderBy === "orderby_desc") {
          sortedCompanies.sort((a, b) => b.shortName.localeCompare(a.shortName));
        }

        setCompanies(sortedCompanies);
        console.log(sortedCompanies);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener datos:', error);
        setLoading(false);
      });
  }, [orderBy]);

  const totalPagesC = companies.length === 0 ? 1 : Math.ceil(companies.length / companiesPerPage);
  const handlePageChangeC = (newPage) => {
    setCurrentPageC(newPage);
  };
  
  
  const startIndexC = (currentPageC - 1) * companiesPerPage;
  const endIndexC = startIndexC + companiesPerPage;
  const currentCompanies = companies.slice(startIndexC, endIndexC);

  const handleFilterSubmit = (symbol) => {
    navigate(`/company/${symbol}`);
  };
  
  const goBack = () => {
    navigate(`/`);
  };

  return (
    <div className="content">
      <h2>Companies with available stocks</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <caption>
            <div className='tablecaptionspace'>
              <div className="pagination">
                  <button onClick={() => handlePageChangeC(currentPageC - 1)} disabled={currentPageC === 1}>
                    ❮
                  </button>
                  <span>{currentPageC} of {totalPagesC} pages</span>
                  <button onClick={() => handlePageChangeC(currentPageC + 1)} disabled={currentPageC === totalPagesC}>
                    ❯
                  </button>
              </div>
              <div className='selector'> 
              <p>Order by</p>
                <select onChange={(event) => handleChangeOrder(event)}>
                  <option value="orderby_asc">A to Z</option>
                  <option value="orderby_desc">Z to A</option>
                </select>
              </div>
            </div>
          </caption>
          
          <thead>
          </thead>

          <tbody>
            {currentCompanies.map((company) => (
              <tr key={company.id} className="company-item">
                <td>{company.shortName}</td>
                <td style={{ textAlign: "center" }}>
                  <button onClick={() => handleFilterSubmit(company.symbol)}>View stocks records</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className='goback'>
        <button onClick={() => goBack()}>Go back</button>
      </div>
    </div>
  );
};

export default AllCompanies;
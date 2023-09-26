import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import callApi from '../../fetchData';
import './Stocks.css'

const stocksPerPage = 8;

const CompanyStocks = () => {
  const { symbol } = useParams();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterQueryParam = queryParams.get('filter');

  const navigate = useNavigate();

  const [postData, setPostData] = useState(null);
  const [getData, setGetData] = useState(null);
 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await callApi('/users', 'POST', true, {});
        console.log('DataPost: ', data);
        setPostData(data);
      } catch (error) {
        console.error("BUTWHY", error);
        try {
          const data = await callApi('/users', 'GET');
          console.log('DataGet: ', data);
          setGetData(data);
        } catch (retryError) {
          console.error(retryError);
        }
      }
    };

    fetchUserData();
  }, []);

  let userId;

  if (postData === null && getData === null) {
    userId = null; // Handle the case when both are null
  } else if (postData === null) {
    userId = getData.id;
  } else {
    userId = postData.id;
  }
    
  console.log("UserId: ", userId);

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPageS, setCurrentPageS] = useState(1);
  const [orderBy, setOrderBy] = useState("orderby_newest");
  const [filterText] = useState(filterQueryParam || ''); 
  
  const handleChangeOrder = (event) => {
    const selectedValue = event.target.value;
    setOrderBy(selectedValue);
  };

  useEffect(() => {
    const fetchStockData = async () => {
      /* const data = await callApi("/stocks/PG?page=3&size=5"); */
      try {
        const dataFull = await callApi(`/stocks/${symbol}`);
        const totalStockPages = dataFull.totalPages;

        let data = [];
        for (let page = 1; page <= totalStockPages; page++) {
          const pageSymbol = await callApi(`/stocks/${symbol}?page=${page}`);
          data = data.concat(pageSymbol.stockHistory);
        }

        
        if (orderBy === "orderby_newest") {
          data.sort((a, b) => b.id - a.id);
        } else if (orderBy === "orderby_older") {
          data.sort((a, b) => a.id - b.id);
        }

        setCompanies(data);
        console.log("SORTED", data);
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setLoading(false);
      }
    };

      fetchStockData();
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

  const [quantity, setQuantity] = useState(0);
  const [purchase, setPurchase] = useState(null);
  
  const handleQuantity = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      setQuantity(value);
    }
  };

  const handlePurchase = async (stockId, purchaseQuantity) => {
    try {
      console.log("PURCHASING")
      const data = await callApi(`purchases/${userId}`, "POST", true, {
        userId: userId,
        stockId: stockId,
        quantity: purchaseQuantity,
      });
      console.log("Purchase result:", data);
      setPurchase(data);
      console.log(purchase);
    } catch (error) {
      console.error("Purchase error:", error);
    }
  };

  const goBack = () => {
    navigate(`/stocks`);
  };

  return (
    <div className="content">
      <h2>Available stocks details</h2>
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
              <p>Order by</p>
                <select onChange={(event) => handleChangeOrder(event)}>
                  <option value="orderby_newest">Newest to oldest</option>
                  <option value="orderby_oldest">Oldest to newest</option>
                </select>
              </div>
            </div>
          </caption>
          
          <thead>
            <tr>
              <th>Short Name</th>
              <th>Symbol</th>
              <th>Price</th>
              <th>Date</th>
              <th>Time in UTC</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentStocks.map((stock) => (
              <tr key={stock.id} className="company-item">
                <td>{stock.shortName}</td>
                <td>{stock.symbol}</td>
                <td>{stock.price} {stock.currency}</td>
                <td>{stock.datetime.split("T")[0]}</td>
                <td>{stock.datetime.split("T")[1].replace("Z", "")}</td>
                <td>
                  <form className="buy-form">
                    <label>
                      Quantity:   
                      <input type="number" onChange={handleQuantity}/>
                    </label>
                    <button onClick={() => handlePurchase(stock.id, quantity)}>Buy</button>
                  </form>
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

export default CompanyStocks;
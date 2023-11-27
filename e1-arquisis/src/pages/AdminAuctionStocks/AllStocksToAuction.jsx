import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import callApi from '../../fetchData';
import './AllStocksToAuction.css';

const stocksPerPage = 12;

const AllStocksToAuction = () => {

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
          console.error("RetryError:", retryError);
        }
      }
    };

    fetchData();
  }, []);

  let userId;

  if (postData === null && getData === null) {
    userId = null; 
  } else if (postData === null) {
    userId = getData.id;
  } else {
    userId = postData.id;
  }
  
  console.log(userId);

  const navigate = useNavigate();
    
  const [stocksToAuction, setStocksToAuction] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPageC, setCurrentPageC] = useState(1);


  useEffect(() => {
    const fetchStocksToAuction = async () => {
      try {
        const data = await callApi("/admin/my-stocks"); /* POR IMPLEMENTAR EN API GATEWAY    ---------------------*/ 
      
        setStocksToAuction(data);
        console.log("stocksToAuction: ", data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setLoading(false);
      }
    };
    fetchStocksToAuction();
    }, []);


  const totalPagesC = stocksToAuction.length === 0 ? 1 : Math.ceil(stocksToAuction.length / stocksPerPage);
  const handlePageChangeC = (newPage) => {
    setCurrentPageC(newPage);
  };  
  
  const startIndexC = (currentPageC - 1) * stocksPerPage;
  const endIndexC = startIndexC + stocksPerPage;
  const currentStocksToAuction = stocksToAuction.slice(startIndexC, endIndexC);

  const handleAuctionStock = (id) => { /* POR IMPLEMENTAR HACER POST A LA STOCK Y QUE PASE A ESTAR EN SUBASTA ------------------- */
 
  };
  
  const goBack = () => {
    navigate(`/`);
  };

  return (
    <div className="content">
      <h2>Stocks available for auction</h2>
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
            </div>
          </caption>
          
          <thead>
                <tr>
                    <th>Short Name</th>
                    <th>Symbol</th>
                    <th>Price</th>
                    <th>Date</th>
                    <th>Time in UTC</th>
                    <th>To Auction</th>
                </tr>
        </thead>

          <tbody>
            {currentStocksToAuction.map((stock) => (
              <tr key={stock.id} className="company-item">
                <td>{stock.shortName}</td>
                <td>{stock.symbol}</td>
                <td>{stock.price} {stock.currency}</td>
                <td>{stock.datetime.split("T")[0]}</td>
                <td>{stock.datetime.split("T")[1].replace("Z", "")}</td>
                <td style={{ textAlign: "center" }}>
                  <button onClick={() => handleAuctionStock(stock.id)}>Auction Stock</button>
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

export default AllStocksToAuction;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import callApi from "../../fetchData"

const CompanyStocks2 = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [latestStock, setLatestStock] = useState(null);
  const [stockQuantity, setStockQuantity] = useState(1);
  const [message, setMessage] = useState(null);



  const { symbol } = useParams();

  useEffect(() => {
    fetchData(symbol, currentPage);
    fetchLatestStock(symbol);
  }, [currentPage, symbol]);

  const fetchData = async (symbol, page) => {
    try {
      const {stockHistory, totalPages} = await callApi(`/stocks/${symbol}?page=${page}&size=10`);
      setData(stockHistory); // Assuming the API returns an array called "data"
      setTotalPages(totalPages); // Assuming the API returns a total pages count
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setIsLoading(false);
    }
  };

  const fetchLatestStock = async (symbol) => {
    try {
        const {stockHistory} = await callApi(`/stocks/${symbol}?page=1&size=1`);
        setLatestStock(stockHistory[0]);
    } catch (error) {
        console.error('Failed to fetch latest stock data:', error);
    }
  };

  const handleButtonClick = async () => {
    let userId;
    try {
        const userInfo = await callApi("/users", "POST", true, {});
        userId = userInfo.id;
        // Process response1 if needed
      } catch (error1) {
        console.error('Failed request 1:', error1);
        try {
          const userInfo = await callApi("/users", "GET");
          // Based on the data from response2, make a third request
          userId = userInfo.id;          
        } catch (error2) {
            console.error('Failed request 2:', error2);
        }
      }
        try {
          await callApi(`/purchases/${userId}`, "POST", true, {
              userId,
              stockId: latestStock.id,
              quantity: stockQuantity,
            });
            setMessage("Purchase was made successfully!");
          // Process response3 if needed
        } catch (error3) {
          console.error('Failed request 3:', error3);
          setMessage("Purchase failed!");
        }
  };

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  
  const navigate = useNavigate(); 

  /* FALTA ENDPOINTTT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  */
  const handlePrediction = async () => {
    try {
      console.log('Entered button'); 
      //let Predictor = await callApi(`/health`);
      let Predictor = true;
      if (Predictor) {
        navigate(`/createpred`);  
      } else {
        navigate(`/notworking`)
      }      
    } catch (error) {
      console.error('Failed connect to worker:', error); 
    }
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
            {latestStock && (
    <div className="stock-card">
        <p><strong>Short Name:</strong> {latestStock.shortName}</p>
        <p><strong>Symbol:</strong> {latestStock.symbol}</p>
        <p><strong>Price:</strong> {latestStock.price} {latestStock.currency}</p>
        <p><strong>Date:</strong> {latestStock.datetime.split("T")[0]}</p>
        <p><strong>Time in UTC:</strong> {latestStock.datetime.split("T")[1].replace("Z", "")}</p>
        
        
        <div className="purchase-controls">
            <label>
                Quantity:
                <input 
                    type="number" 
                    min="1" 
                    value={stockQuantity} 
                    onChange={e => setStockQuantity(Number(e.target.value))} 
                />
            </label>
            <button onClick={handleButtonClick}>Buy the latest stock</button>
            <button onClick={handlePrediction}>Create prediction</button>
        </div>
        <br/>
        {message && <p className="message">{message}</p>}

    </div>
)}

          <table className="table">
            <caption>
              <div className='tablecaptionspace'>
                <div className="pagination">
                  <button onClick={() => handlePageChange('prev')}>
                      ❮
                    </button>
                    <span>{currentPage} of {totalPages} pages</span>
                    <button onClick={() => handlePageChange('next')}>
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
            </tr>
          </thead>
          <tbody>
            {data.map((stock) => (
              <tr key={stock.id} className="company-item">
                <td>{stock.shortName}</td>
                <td>{stock.symbol}</td>
                <td>{stock.price} {stock.currency}</td>
                <td>{stock.datetime.split("T")[0]}</td>
                <td>{stock.datetime.split("T")[1].replace("Z", "")}</td>
              </tr>
            ))}
          </tbody>
        </table>

        </div>
      )}
    </div>
  );
}

export default CompanyStocks2;

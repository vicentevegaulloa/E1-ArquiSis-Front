import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import callApi from "../../fetchData"

const UserCompanyStocks = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [latestStock, setLatestStock] = useState(null);
  const [groupStockQuantity, setGroupStockQuantity] = useState(0);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [message, setMessage] = useState(null);
  const [purchaseUrl, setPurchaseUrl] = useState(''); 
  const [purchaseToken, setPurchaseToken] = useState('');
  


  const { symbol } = useParams();

  useEffect(() => {
    fetchData(symbol, currentPage);
    fetchLatestStock(symbol);
    fetchGroupStock(symbol);
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

  const fetchGroupStock = async (symbol) => {
    try {
        const {quantity} = await callApi(`/adminstocks/get-adminstocks/${symbol}?`);
        if (quantity) {
          setGroupStockQuantity(quantity);
        }
    } catch (error) {
        console.error('Failed to fetch group stock data:', error);
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
      
      const purchaseData = {
        userId,
        symbol: latestStock.symbol,
        quantity: stockQuantity,
      };
      const groupStockData = {
        symbol: latestStock.symbol,
        quantity: stockQuantity,
      };
      console.log("A")
      const purchaseResponse = await callApi(`/purchases/buy-admin/${userId}`, "POST", true, purchaseData);
      console.log("/A", purchaseResponse, purchaseResponse.url, purchaseResponse.token)

      setPurchaseUrl(purchaseResponse.url); 
      setPurchaseToken(purchaseResponse.token);
      
      if(purchaseResponse.url && purchaseResponse.token) {
        const {quantity} = await callApi(`/adminstocks/update-adminstock`, "PUT", true, groupStockData);
        setGroupStockQuantity(quantity);
        setMessage("Purchase allowed! Now please confirm.");
      }
      else{
        setMessage("Purchase failed!");
      }
      console.log('Response from request 3:', purchaseResponse);
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
        navigate(`/createpred/${symbol}`);  
      } else {
        navigate(`/notworking`)
      }      
    } catch (error) {
      console.error('Failed connect to worker:', error); 
    }
  };

  const handleChange = (e) => {
    const enteredValue = Number(e.target.value);

    if (enteredValue > groupStockQuantity) {
      e.target.setCustomValidity(`Quantity cannot exceed ${groupStockQuantity}`);
      setStockQuantity(groupStockQuantity);
    } else {
      e.target.setCustomValidity('');
      setStockQuantity(enteredValue);
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

        <div className='controls'>
          <div className='izq'>
            <p><strong>Short Name:</strong> {latestStock.shortName}</p>
            <p><strong>Symbol:</strong> {latestStock.symbol}</p>
            <p><strong>Price:</strong> {latestStock.price} {latestStock.currency}</p>
            <p><strong>Date:</strong> {latestStock.datetime.split("T")[0]}</p>
            <p><strong>Time in UTC:</strong> {latestStock.datetime.split("T")[1].replace("Z", "")}</p>
            <p><strong>Quantity available:</strong> {groupStockQuantity}</p>
          </div>
          <div className='centro'>
            <div className="purchase-controls">
              <label>
                  Quantity:
                  <input 
                      type="number" 
                      min="0" 
                      max={groupStockQuantity}
                      step="0.01"
                      value={stockQuantity} 
                      onChange={handleChange}
                      
                  />
              </label>
              <button onClick={handlePrediction}>Create prediction</button>

              {purchaseUrl && purchaseToken ? (
                    <form action={purchaseUrl} method="POST">
                      <input type="hidden" value={purchaseToken} name="token_ws" />
                      <button type="submit">Confirm Purchase</button>
                    </form>
                  ) : (
                    <button type="button" onClick={handleButtonClick}>Buy Stonks</button>
                  )}
            </div>
            {message && <p className="message">{message}</p>}
          </div>
          <div className='der'>
          </div>
        </div>
        
        

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

export default UserCompanyStocks;

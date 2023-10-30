import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import callApi from "../../fetchData"

const CompanyStocks2 = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [latestStock, setLatestStock] = useState(null);
  const [stockQuantity, setStockQuantity] = useState(1);
  const [message, setMessage] = useState(null);
  const [purchaseUrl, setPurchaseUrl] = useState(''); 
  const [purchaseToken, setPurchaseToken] = useState('');
  


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
        const purchaseData = {
          userId,
          stockId: latestStock.id,
          quantity: stockQuantity,
        };
        const purchaseResponse = await callApi(`/purchases/${userId}`, "POST", true, purchaseData);
        setPurchaseUrl(purchaseResponse.url); 
        setPurchaseToken(purchaseResponse.token);
        setMessage("Purchase was made successfully!");
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
            {purchaseUrl && purchaseToken ? (
                  <form action={purchaseUrl} method="POST">
                    <input type="hidden" value={purchaseToken} name="token_ws" />
                    <button type="submit">Confirm Purchase</button>
                  </form>
                ) : (
                  <button type="button" onClick={handleButtonClick}>Buy Stonks</button>
                )}
        </div>
        <br/>
        {message && <p className="message">{message}</p>}

    </div>
)}

          <table className="table">
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

          <div>
            <button onClick={() => handlePageChange('prev')}>Previous</button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={() => handlePageChange('next')}>Next</button>
          </div>

        </div>
      )}
    </div>
  );
}

export default CompanyStocks2;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import callApi from '../../fetchData';
import './Auctions.css';
import ErrorUserAccessAuctions from './ErrorUserAccessAuctions';

const stocksPerPage = 10;

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
          console.error('RetryError:', retryError);
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
  const [auctionMessage, setAuctionMessage] = useState('');

  const [currentPageC, setCurrentPageC] = useState(1);

  useEffect(() => {
    const fetchStocksToAuction = async () => {
      try {
        const data = await callApi('/adminstocks/get-adminstocks');

        setStocksToAuction(data);
        console.log('stocksToAuction: ', data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setLoading(false);
      }
    };
    fetchStocksToAuction();
  }, []);

  const totalPagesC =
    stocksToAuction.length === 0 ? 1 : Math.ceil(stocksToAuction.length / stocksPerPage);
  const handlePageChangeC = (newPage) => {
    setCurrentPageC(newPage);
  };

  const startIndexC = (currentPageC - 1) * stocksPerPage;
  const endIndexC = startIndexC + stocksPerPage;
  const currentStocksToAuction = stocksToAuction.slice(startIndexC, endIndexC);

  const isAdmin = postData ? postData.role === 'ADMIN' : getData ? getData.role === 'ADMIN' : false;

  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [maxQuantity, setMaxQuantity] = useState(1);

  const handleSelectStock = (symbol, maxQuantity) => {
    setSelectedSymbol(symbol);
    setSelectedQuantity(1);
    setAuctionMessage('');
    setMaxQuantity(maxQuantity);
    console.log(symbol);
  };

  const handleAuctionStock = async () => {
    console.log('handleAuctionStock is called');
    try {
      const auctionData = {
        symbol: selectedSymbol,
        quantity: selectedQuantity,
      };
      console.log(auctionData);

      await callApi('/auctions/offers', 'POST', true, auctionData);
      console.log('handleAuctionStock is called');
      setAuctionMessage('Auction was successful!');
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Failed to perform auction:', error);
      setAuctionMessage('Failed to perform auction');
    }
  };

  const goBack = () => {
    navigate(`/`);
  };

  return (
    <div className="content">
      {isAdmin ? (
        <div>
          <h2>Stocks available for auction</h2>

          {selectedSymbol && (
            <div className="form-container">
              <label>
                Quantity:
                <input
                  type="number"
                  min="1"
                  max={maxQuantity}
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                />
              </label>
              <button type="button" onClick={handleAuctionStock}>
                Auction Selected Stock
              </button>
              {auctionMessage && <p className="message">{auctionMessage}</p>}
            </div>
          )}

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <table className="table">
                <caption>
                  <div className="tablecaptionspace">
                    <div className="pagination">
                      <button
                        onClick={() => handlePageChangeC(currentPageC - 1)}
                        disabled={currentPageC === 1}
                      >
                        ❮
                      </button>
                      <span>
                        {currentPageC} of {totalPagesC} pages
                      </span>
                      <button
                        onClick={() => handlePageChangeC(currentPageC + 1)}
                        disabled={currentPageC === totalPagesC}
                      >
                        ❯
                      </button>
                    </div>
                  </div>
                </caption>

                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Quantity</th>
                  </tr>
                </thead>

                <tbody>
                  {currentStocksToAuction.map((stock) => (
                    <tr key={stock.id} className="company-item">
                      <td>{stock.symbol}</td>
                      <td>{stock.quantity}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => handleSelectStock(stock.symbol, stock.quantity)}
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="goback">
            <button onClick={() => goBack()}>Go back</button>
          </div>
        </div>
      ) : (
        <div>
          <ErrorUserAccessAuctions />
        </div>
      )}
    </div>
  );
};

export default AllStocksToAuction;

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Predictions.css';
import callApi from '../../fetchData';
import Chart from 'chart.js/auto';
import { Line } from "react-chartjs-2";



const MyPredictionsStocks = () => {

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [latestStock, setLatestStock] = useState(null);
  const [stockQuantity, setStockQuantity] = useState(0);

  const navigate = useNavigate();

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

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const goBack = () => {
    navigate(`/`);
  };

  /* FALTA ENDPOINTTT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  */
  const handlePrediction = async () => {
    try {
      console.log('Entered button'); 
      //let Predictor = await callApi(`/health`);
      let Predictor = true;
      if (Predictor) {
        navigate(`/createpred`);  
        // tiene que añadir una fila en la tabla de predicciones
      } else {
        navigate(`/notworking`)
      }      
    } catch (error) {
      console.error('Failed connect to worker:', error); 
    }
  };

  const getNetProfit = () => {
    //if (latestStock.price && price) {
      //return (stockQuantity * (latestStock.price - price)).toFixed(2); 
    //} else {
      return 0;
    //}
    
  };

  const chartRef = useRef(null);

  // Create a function to generate the chart
  const generateChart = () => {
    if (data && data.length > 0) {
      
      const ctx = chartRef.current.getContext('2d');

      const dates = data.map(stock => stock.datetime);
      const prices = data.map(stock => (stock && stock.price !== null ? stock.price : 0));


        console.log(data)
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: dates, // Use labels instead of dates
            datasets: [
              {
                label: 'Stock Prices',
                data: prices,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              },
            ],
          },
        });
      

      
    }
  };

  // Call the generateChart function when the component mounts
  useEffect(() => {
    generateChart();
  }, []);
  

  return (
  
      <div className="card-container">
        <h2>My Predictions</h2>
        <div className="user-info">

          <div className='pred-graph-details'>
            <div className='pred-graph'>
    
              <canvas ref={chartRef} width="400" height="200"></canvas>
    
            </div>
          </div>


          <div className='pred-table'>
            
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div>
                {latestStock && latestStock.price && (
                  <div className="stock-card">
                    <p><strong>Short Name:</strong> {latestStock.shortName}</p>
                    <p><strong>Symbol:</strong> {latestStock.symbol}</p>
                    <p><strong>Price:</strong> {latestStock.price} {latestStock.currency}</p>
                    <p><strong>Date:</strong> {latestStock.datetime.split("T")[0]}</p>
                    <p><strong>Time in UTC:</strong> {latestStock.datetime.split("T")[1].replace("Z", "")}</p>
                    
                    
                    <div className="purchase-controls">
                        <label>
                            Simulation Quantity:
                            <input 
                                type="number" 
                                min="1" 
                                value={stockQuantity} 
                                onChange={e => setStockQuantity(Number(e.target.value))} 
                            />
                        </label>
                        <button onClick={handlePrediction}>Create prediction</button>
                    </div>
                    <br/>

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
                        <th>Current simulation net profit for {stockQuantity} stocks</th>
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
                          <td>{getNetProfit(stock.price)} {stock.currency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  </div>
                )}
            <div className='goback'>
                <button onClick={() => goBack()}>Go back</button>
            </div>
          </div>

          
          
        </div>
      </div>
  );
};

export default MyPredictionsStocks;
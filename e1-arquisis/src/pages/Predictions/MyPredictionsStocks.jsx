import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Predictions.css';
import callApi from '../../fetchData';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import LineChart from './Chart';

Chart.register(CategoryScale);

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

  const chartData = {
    labels: data.map(stock => stock.datetime.split("T")[0]), // Assuming each stock has a datetime field
    datasets: [
      {
        label: 'Stock Price',
        data: data.map(stock => stock.price), // Assuming each stock has a price field
        borderColor: 'rgba(75, 192, 192, 1)', // Line color
        fill: false, // Don't fill the area under the line
      },
    ],
  };

  return (
  
      <div className="card-container">
        <h2>My Predictions</h2>

          <div className='user-info'>   
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <div>
                <div className='up'>
                  <div className='pred-chart'>
                    <h3>Predictions history</h3>
                    <LineChart chartData={chartData} />
                  </div>
                  {latestStock && latestStock.price && (
                    <div className="stock-card">
                      <h3>Latest stock</h3>
                      <p><b>Short Name:</b> {latestStock.shortName}</p>
                      <p><strong>Symbol:</strong> {latestStock.symbol}</p>
                      <p><strong>Price:</strong> {latestStock.price} {latestStock.currency}</p>
                      <p><strong>Date:</strong> {latestStock.datetime.split("T")[0]}</p>
                      <p><strong>Time in UTC:</strong> {latestStock.datetime.split("T")[1].replace("Z", "")}</p>

                      <div className="simulation-controls">
                        <label>
                          Simulation Quantity:
                          <input 
                            type="number" 
                            min="0" 
                            value={stockQuantity} 
                            onChange={e => setStockQuantity(Number(e.target.value))} 
                          />
                        </label>
                        <button onClick={handlePrediction}>Create prediction</button>
                      </div>
                    </div>
                  )}
                </div>
                <div className='down'>    
                  <table className="table">
                    <caption>
                      <div className='tablecaptionspace'>
                        <div className="pagination">
                          <button onClick={() => handlePageChange('prev')}> ❮ </button>
                          <span>{currentPage} of {totalPages} pages</span>
                          <button onClick={() => handlePageChange('next')}> ❯ </button>
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
                          <td>
                          {(latestStock !== null && Object.keys(latestStock).length > 0)
                              ? (stockQuantity * (latestStock.price - stock.price)).toFixed(2)
                              : 0
                            } {stock.currency}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}
          </div>


          <div className='goback'>
            <button onClick={() => goBack()}>Go back</button>
          </div>

      </div>
  );
};

export default MyPredictionsStocks;
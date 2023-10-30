import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Predictions.css';
import callApi from '../../fetchData';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import LineChart from './Chart';

Chart.register(CategoryScale);

const MyPredictionsStocks = () => {

  // const [postData, setPostData] = useState(null);
  // const [getData, setGetData] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [chartDataShown, setChartDataShown] = useState(null);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPredData = async () => {
      try {
        const data = await callApi('/users', 'POST', true, {});
        console.log('DataPost: ', data);
        setUserId(data.id);
      } catch (error) {
        console.error(error);
        try {
          const data = await callApi('/users', 'GET');
          console.log('DataGet: ', data);
          setUserId(data.id);
        } catch (retryError) {
          console.error(retryError);
        }
      }
    };

    fetchPredData();
  }, []);

  // let userId;

  // if (postData === null && getData === null) {
  //   userId = null; // Handle the case when both are null
  // } else if (postData === null) {
  //   userId = getData.id;
  // } else {
  //   userId = postData.id;
  // }

  useEffect(() => {
    fetchData();
    // fetchLatestStock(symbol);
  }, [userId]);

  const fetchData = async () => {
    try {
      const predictions = await callApi(`/predictions/${userId}`, 'GET', true);
      setData(predictions); // Assuming the API returns an array called "data"
      setTotalPages(totalPages); // Assuming the API returns a total pages count
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setIsLoading(false);
    }
  };

  // const fetchLatestStock = async (symbol) => {
  //   try {
  //       const {stockHistory} = await callApi(`/stocks/${symbol}?page=1&size=1`);
  //       setLatestStock(stockHistory[0]);
  //   } catch (error) {
  //       console.error('Failed to fetch latest stock data:', error);
  //   }
  // }

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
  // const handlePrediction = async () => {
  //   try {
  //     console.log('Entered button'); 
  //     //let Predictor = await callApi(`/health`);
  //     let Predictor = true;
  //     if (Predictor) {
  //       navigate(`/createpred`);  
  //       // tiene que añadir una fila en la tabla de predicciones
  //     } else {
  //       navigate(`/notworking`)
  //     }      
  //   } catch (error) {
  //     console.error('Failed connect to worker:', error); 
  //   }
  // };

  // const chartData = {
  //   labels: data.map(stock => stock.datetime.split("T")[0]), // Assuming each stock has a datetime field
  //   datasets: [
  //     {
  //       label: 'Stock Price',
  //       data: data.map(stock => stock.price), // Assuming each stock has a price field
  //       borderColor: 'rgba(75, 192, 192, 1)', // Line color
  //       fill: false, // Don't fill the area under the line
  //     },
  //   ],
  // };

  const handlePrediction = async (pred) => {
    try {
      if (pred.result === null) { 
        return;
      }
      // today + pred.daysBack
      const predictionDate = new Date();
      predictionDate.setDate(predictionDate.getDate() + pred.result.daysBack);
      console.log('Prediction date:', pred.result.labels + [predictionDate.toISOString().split("T")[0]]);
      console.log('Prediction data:', pred.result.data + [pred.result.prediction]);
      const chartData = {
        labels: pred.result.labels.concat([predictionDate.toISOString().split("T")[0]]),
        datasets: [
          {
            label: `${pred.result.symbol} Stock Price`,
            data: pred.result.data.concat([pred.result.prediction]),
            borderColor: 'rgba(75, 192, 192, 1)', // Line color
            fill: false, // Don't fill the area under the line
          },
        ]
      }
      setChartDataShown(chartData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }

  return (
  
      <div className="card-container">
        <h2>My Predictions</h2>

          <div className='user-info'>   
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <div>
                <div className='up'>
                  { chartDataShown &&
                  <div className='pred-chart'>
                    <h3>Predictions history</h3>
                    <LineChart chartData={chartDataShown} />
                  </div>
                  }
                  {/* {latestStock && latestStock.price && (
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
                  )} */}
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
                        <th>Job Id</th>
                        <th>State</th>
                        <th>Stocks</th>
                        <th>Days Ahead</th>
                        <th>Symbol</th>
                        <th>Prediction</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((pred, i) => (
                        <tr key={i} className="company-item" onClick={() => handlePrediction(pred)}>
                          <td>{pred.id}</td>
                          <td>{pred.state}</td>
                          <td>{pred.result?.amount || '-'}</td>
                          <td>{pred.result?.daysBack || '-'}</td>
                          <td>{pred.result?.symbol || '-'}</td>
                          <td>{pred.result?.prediction || '-'}</td>
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
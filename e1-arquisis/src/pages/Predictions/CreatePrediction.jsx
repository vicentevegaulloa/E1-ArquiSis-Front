import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Predictions.css';
import callApi from '../../fetchData';
import PropTypes from 'prop-types';


const CreatePred = () => {

  const { symbol } = useParams();

  const navigate = useNavigate();

  const [postData, setPostData] = useState(null);
  const [getData, setGetData] = useState(null);
 
  useEffect(() => {
    const fetchPredData = async () => {
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

    fetchPredData();
  }, []);

  let userId;

  if (postData === null && getData === null) {
    userId = null; // Handle the case when both are null
  } else if (postData === null) {
    userId = getData.id;
  } else {
    userId = postData.id;
  }
  
  const [formData, setFormData] = useState({
    days: '',
    stocks: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await callApi(`/predictions/${symbol}/${userId}`, 'POST', true, {
        days: formData.days,
        stocks: formData.stocks
      });
      console.log('Response:', response.data);
      // Handle the response as needed
      navigate(`/predictions`);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Stock Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Amount of Days:
            <input
              type="number"
              name="days"
              value={formData.days}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Amount of Stocks:
            <input
              type="number"
              name="stocks"
              value={formData.stocks}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button type="submit" disabled={isLoading}>
          Submit
        </button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default CreatePred;
  
CreatePred.propTypes = {
    symbol: PropTypes.string.isRequired
  };
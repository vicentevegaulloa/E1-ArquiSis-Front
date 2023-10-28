import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Predictions.css';
import callApi from '../../fetchData';


const CreatePred = () => {

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
  
  console.log("User id: ", userId);


  const handleDate = () => {

  };

  const handleTime = () => {
    
  };

  const navigate = useNavigate();

  const handleCreate = (symbol) => {
    navigate(`/predictions/company/${symbol}`);
  };

  return (
  
      <div className="card-container">
        <h2>Your wallet</h2>
        <div className="user-info">
          <h3>Create Prediction</h3>
          
          <form>
            <label>
              Select date:   
              <input type="date" onClick={handleDate}/>
              <input type="time" onClick={handleTime}/>
            </label>
            <button className="primary" type="button" onClick={handleCreate}>Get prediction</button>
          </form>
        </div>
      </div>
  );
};

export default CreatePred;
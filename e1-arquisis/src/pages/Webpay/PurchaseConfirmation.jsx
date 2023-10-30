import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import callApi from "../../fetchData";
import './PurchaseConfirmation.css'; 

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PurchaseConfirmation = () => {
  const [postData, setPostData] = useState(null);
  const [getData, setGetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmationStatus, setConfirmationStatus] = useState('');
  const navigate = useNavigate();

  const query = useQuery();
  const token_ws = query.get('token_ws');

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

  useEffect(() => {
    if (token_ws) {
      confirmTransaction(token_ws);
    } else {
      setConfirmationStatus('User canceled the purchase');
      setIsLoading(false);
    }
  }, [token_ws]);

  const confirmTransaction = async (token_ws) => {
    try {
      const response = await callApi(`/purchases/confirm-transaction/${userId}`, 'POST', true, { token_ws });
      if (response.response_code === 0) {
        setConfirmationStatus('Transaction was successful');
      } else {
        setConfirmationStatus('Transaction was rejected');
      }
    } catch (error) {
      setConfirmationStatus('Error confirming the transaction');
    }
    setIsLoading(false);
  };

  return (
    <div className="your-container"> 
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1 className="your-heading">Transaction Confirmation</h1> 
          <p className="your-message">{confirmationStatus}</p> 
          <button onClick={() => navigate('/')} className="your-button">Back to Home</button> 
        </div>
      )}
    </div>
  );
}

export default PurchaseConfirmation;

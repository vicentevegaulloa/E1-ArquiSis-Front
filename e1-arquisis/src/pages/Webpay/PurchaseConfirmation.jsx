import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import callApi from "../../fetchData";
import './PurchaseConfirmation.css'; 

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PurchaseConfirmation = () => {
  // const [postData, setPostData] = useState(null);
  // const [getData, setGetData] = useState(null);
  const [userId, setUserId] = useState(null);
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

  useEffect(() => {
    if (token_ws && userId !== null) {
      confirmTransaction(token_ws, userId);
    } else if (!token_ws){
      setConfirmationStatus('User canceled the purchase');
      setIsLoading(false);
    }
  }, [token_ws, userId]);

  const confirmTransaction = async (token_ws, userId) => {
    console.log("userid ", userId)
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
          <h4 className="your-heading">Transaction state</h4> 
          <p className="your-message">{confirmationStatus}</p> 
          <button onClick={() => navigate('/stocks')} className="your-button">Back to Stocks</button> 
        </div>
      )}
    </div>
  );
}

export default PurchaseConfirmation;

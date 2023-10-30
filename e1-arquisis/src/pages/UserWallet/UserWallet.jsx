import React, { useState, useEffect } from 'react';
import callApi from '../../fetchData';
import './UserWallet.css';


const UserWallet = () => {

  const [postData, setPostData] = useState(null);
  const [getData, setGetData] = useState(null);
 
  useEffect(() => {
    const fetchUserData = async () => {
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

    fetchUserData();
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

  const [walletBalance, setWalletBalance] = useState(null);
  const [amountToAdd, setAmountToAdd] = useState(0);

  const handleAmountChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      setAmountToAdd(value);
    }
  };


  const addMoneyToWallet = async () => {
    if (amountToAdd > 0) {
      try {
        const data = await callApi(`/wallets/${walletId}`, 'PUT', true, {
          balance: walletBalance + amountToAdd, // Update the balance with the added amount
        });
        if (data.status === 200) {
          // Update walletBalance directly with the new value
          setWalletBalance(walletBalance + amountToAdd);
          setAmountToAdd(0);
        } else {
          console.error('Error updating wallet balance');
        }
      } catch (error) {
        console.error('Request error:', error);
      }
    }
  };

  const [walletId, setWalletId] = useState(null);

  const fetchWalletData = async () => {
    try {
      const data = await callApi(`/wallets/${userId}`, "GET");
      console.log('Wallet Balance: ', data.balance);
      console.log("Wallet Id: ", data.id);
      // Update walletBalance and walletId directly with the new values
      setWalletBalance(data.balance);
      setWalletId(data.id);
    } catch (error) {
      console.error(error);
    }
  };
  
  fetchWalletData();

  if (walletBalance === null) {
    return <p>Loading...</p>;
  }

  const handleRefresh = () => {
    window.location.reload(); // Reload the current page
  };

  return (
  
      <div className="card-container">
        <h2>Your wallet</h2>
        <div className="user-info">
          <h3>Current Balance</h3>
          <p>You have <b>${walletBalance}</b> in your wallet</p>
          <h3>Add balance</h3>
          <p>To add money, type the amount. Then click Add Money and Refresh data.</p>
          <form>
            <label>
              Amount to Add:   
              <input type="number" onChange={handleAmountChange}/>
            </label>
            <button className="primary" type="button" onClick={addMoneyToWallet}>Add Money</button>
            <button className="primary" type="button" onClick={handleRefresh}>Refresh data</button>
          </form>
        </div>
      </div>
  );
};

export default UserWallet;
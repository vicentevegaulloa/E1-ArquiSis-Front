import React, { useState, useEffect } from 'react';
import './UserWallet.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://api.valeria-riquel.me/wallets';

const UserWallet = () => {
  const { userId } = useParams();
  const [walletBalance, setWalletBalance] = useState(null);
  const [amountToAdd, setAmountToAdd] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleAmountChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      setAmountToAdd(value);
    }
  };

  const addMoneyToWallet = async () => {
    if (amountToAdd > 0) {
      try {
        const response = await axios.put(`${API_BASE_URL}/${userId}`, {
          balance: walletBalance + amountToAdd,
        });

        console.log('User ID:', userId);

        if (response.status === 200) {
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

  const fetchWalletData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${userId}`);
      if (response.status === 200) {
        setWalletBalance(response.data.balance);
        setLoading(false);
      } else {
        console.error('Error fetching wallet information');
        setLoading(false);
      }
    } catch (error) {
      console.error('Request error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('User ID (Fetch):', userId);
    fetchWalletData();
  }, [userId]);

  return (
  
      <div className="content">
        <h2>My wallet</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            walletBalance === null ? (
              <p>No wallet</p>
            ) : (
              walletBalance !== null && (
                <form>
                  <label><h3>Current Balance</h3></label>
                  <label>
                    Amount to Add:
                    <input type="number" value={amountToAdd} onChange={handleAmountChange}/>
                  </label>
                  <button className="primary" type="button" onClick={addMoneyToWallet}>Add Money</button>
                </form>
          )))}
      </div>
  );
};

export default UserWallet;
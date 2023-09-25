import React, { useState, useEffect } from 'react';
import './UserWallet.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://api.valeria-riquel.me/wallets';

const UserWallet = () => {
  const { userId } = useParams();
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
      } else {
        console.error('Error fetching wallet information');
      }
    } catch (error) {
      console.error('Request error:', error);
    }
  };

  useEffect(() => {
    console.log('User ID (Fetch):', userId);
    fetchWalletData();
  }, [userId]);

  if (walletBalance === null) {
    return <p>Loading...</p>;
  }

  return (
  
      <div className="card-container">
        <h2 className="title">Edit your balance</h2>
        <div className="user-info">
          <h3>Current Balance</h3>
          <p>${walletBalance}</p>
          <form>
            <label>
              Amount to Add:
              <input
                type="number"
                value={amountToAdd}
                onChange={handleAmountChange}
              />
            </label>
            <button
              className="primary"
              type="button"
              onClick={addMoneyToWallet}
            >
              Add Money
            </button>
          </form>
        </div>
      </div>
  );
};

export default UserWallet;
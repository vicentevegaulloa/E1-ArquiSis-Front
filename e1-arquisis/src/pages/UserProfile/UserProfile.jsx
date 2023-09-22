import React, { useState } from 'react';
import './UserProfile.css'; 

const UserProfile = ({ userId }) => {
  // Lógica para cargar email y dinero en billetera según userID

  const [email, setEmail] = useState("correo@correo.cl");
  const [walletBalance, setWalletBalance] = useState(0);

  const [amountToAdd, setAmountToAdd] = useState(0);

  const handleAmountChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      setAmountToAdd(value);
    }
  };

  const addMoneyToWallet = () => {
    if (amountToAdd > 0) {
      setWalletBalance(walletBalance + amountToAdd);
      setAmountToAdd(0);
    }
  };

  return (
    <div className="card-container"> 
      <h2 className="title">User Profile</h2> 
      <div className="user-info">
        <h3>Email</h3>
        <p>{email}</p>
        <h3>Wallet Balance</h3>
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

export default UserProfile;

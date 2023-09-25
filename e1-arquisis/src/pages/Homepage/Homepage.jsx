import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import callApi from '../../fetchData';
import './Homepage.css';
import '@aws-amplify/ui-react/styles.css';


const HomePage = () => {

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
  };
  
  console.log("UserId definido: ", userId);

  const [walletBalance, setWalletBalance] = useState(null);
  const [walletId, setWalletId] = useState(null);

  const fetchWalletData = async () => {
    try {
      const data = await callApi(`/wallets/${userId}`, "GET");
      console.log('Wallet Balance: ', data.balance);
      console.log("Wallet Id: ", data.id);
      setWalletBalance("New WalletBalance: ", data.balance);
      setWalletId("New WalletId: ", data.id);
    } catch (error) {
      console.error(error);
    }
  };
  fetchWalletData();

  const navigate = useNavigate();

  const explore = () => {
    navigate(`/stocks`);
  }

  return (
    <div className="homepage-grid">
      <div className='vacio'></div>
      <div className="content-text">
        <h1>Start Investing Today</h1>
        <p>Explore endless investment opportunities with Buy Stonks. Invest in your favorite companies and currencies effortlessly</p>
        <button onClick={() => explore()}>Explore stocks</button>
      </div>
      <div className='vacio'></div>
    </div>
    
  );
};

export default HomePage;

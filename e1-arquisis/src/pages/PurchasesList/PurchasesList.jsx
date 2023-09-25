import React, { useEffect, useState } from 'react';
import callApi from '../../fetchData';
import './PurchasesList.css';

const PurchasesList = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

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


    const fetchPurchases = async () => {
      try {
        const data = await callApi(`/purchases/${userId}`, "GET");
        const validPurchases = data.filter(purchase => purchase.valid === true);
        setPurchases(validPurchases);
        console.log(validPurchases);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener datos de compras:', error);
        setLoading(false);
      }};

    fetchPurchases();

  return (
    <div>
      <div className="table-title">
        <h2>My purchases</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          purchases.length === 0 ? (
            <p>You don't have any purchases yet</p>
          ) : (
          purchases.length > 0 && (
            <table className="table-fill">
              <thead>
                <tr>
                  <th className="text-left">ID de Compra</th>
                  <th className="text-left">Fecha y Hora</th>
                  <th className="text-left">Cantidad</th>
                </tr>
              </thead>
              <tbody className="table-hover">
                {purchases.map((purchase) => (
                  <tr key={purchase.id} className="purchase-item">
                    <td className="text-left">{purchase.id}</td>
                    <td className="text-left">{purchase.datetime}</td>
                    <td className="text-left">{purchase.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))
        )}
      </div>
    </div>
  );
};

export default PurchasesList;

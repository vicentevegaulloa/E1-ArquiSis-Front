import React, { useState, useEffect } from 'react';
import callApi from "../../fetchData"

const PurchasesList2 = () => {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchPurchases(userId);
    }
  }, [userId]);

  const fetchUserId = async () => {
    try {
      const userInfo = await callApi("/users", "POST", true, {});
      setUserId(userInfo.id);
    } catch (error1) {
      console.error('Failed request 1:', error1);
      try {
        const userInfo = await callApi("/users", "GET");
        console.log(userInfo)
        setUserId(userInfo.id);
      } catch (error2) {
          console.error('Failed request 2:', error2);
      }
    }
  };

  const fetchPurchases = async (userId) => {
    try {
      const purchaseData = await callApi(`/purchases/${userId}`);
      console.log('Purchase Data: ', purchaseData);
      setPurchases(purchaseData);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch purchase data:', error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Group ID</th>
              <th>Quantity</th>
              <th>Unitary Cost</th>
              <th>Seller</th>
              <th>IP Address</th>
              <th>Date</th>
              {/* <th>Valid</th> */}
              <th>State</th>
              <th>User ID</th>
              <th>Stock ID</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase.id}>
                <td>{purchase.groupid}</td>
                <td>{purchase.quantity}</td>
                <td>{purchase.stock.price}</td>
                <td>{purchase.seller}</td>
                <td>{purchase.ipadress}</td>
                <td>{purchase.datetime.split("T")[0]}</td>
                {/* <td>{purchase.valid ? "Valid" : "Not Valid"}</td> */}
                <td>{purchase.state}</td>
                <td>{purchase.userId}</td>
                <td>{purchase.stockId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PurchasesList2;

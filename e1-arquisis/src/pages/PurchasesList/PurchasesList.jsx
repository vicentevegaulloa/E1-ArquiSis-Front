import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PurchasesList.css';
import { useParams } from 'react-router-dom';

const API_BASE_URL = 'https://api.valeria-riquel.me/purchases';

const PurchasesList = () => {
  const { userId } = useParams();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/${userId}`);
        setPurchases(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener datos de compras:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div>
      <div className="table-title">
        {purchases.length === 0 ? (
          <h3>No Purchases</h3>
        ) : (
          <h3>Lista de Compras</h3>
        )}
        {loading ? (
          <p>Cargando...</p>
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
          )
        )}
      </div>
    </div>
  );
};

export default PurchasesList;
import callApi from "../fetchData";
import React from "react";

const FetchDataComponent = () => {
  return (
    <div>
      <h1>Ejemplos del uso de la API</h1>
      <button
        onClick={async () => {
          const data = await callApi("/stocks");
          console.log("data: ", data);
        }}
      >
        Call API GET /stocks
      </button>
      <br />
      <button
        onClick={async () => {
          const data = await callApi("/stocks/PG?page=3&size=5");
          console.log("data: ", data);
        }}
      >
        Call API GET /stocks/:symbol (usando PG)
      </button>

      <br />
      <button
        onClick={async () => {
          const data = await callApi("/users", "POST", true, {});
          console.log("data: ", data);
        }}
      >
        Call API POST /users
      </button>

      <br />
      <button
        onClick={async () => {
          const data = await callApi("/users", "GET");
          console.log("data: ", data);
        }}
      >
        Call API GET /users
      </button>

      <br />
      <button
        onClick={async () => {
          const data = await callApi("/wallets/15", "GET");
          console.log("data: ", data);
        }}
      >
        Call API GET /wallets/:userId
      </button>
      <br />
      <button
        onClick={async () => {
          const data = await callApi("/wallets/8", "PUT", true, {
            balance: 1000,
          });
          console.log("data: ", data);
        }}
      >
        Call API PUT /wallets/:walletId
      </button>
      <br />
      <button
        onClick={async () => {
          const data = await callApi("/purchases/15", "POST", true, {
            userId: 15,
            stockId: 1,
            quantity: 2,
          });
          console.log("data: ", data);
        }}
      >
        Call API POST /purchases/:userId
      </button>
      <br />
      <button
        onClick={async () => {
          const data = await callApi("/purchases/15", "GET");
          console.log("data: ", data);
        }}
      >
        Call API GET /purchases/:userId
      </button>
    </div>
  );
};

export default FetchDataComponent;

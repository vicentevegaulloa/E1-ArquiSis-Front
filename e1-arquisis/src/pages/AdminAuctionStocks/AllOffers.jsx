import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import callApi from '../../fetchData';
import './Auctions.css';
import ErrorUserAccessAuctions from './ErrorUserAccessAuctions';

const stocksPerPage = 10;

const AllOffers = () => {
  const [postData, setPostData] = useState(null);
  const [getData, setGetData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
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
          console.error('RetryError:', retryError);
        }
      }
    };

    fetchData();
  }, []);

  let userId;

  if (postData === null && getData === null) {
    userId = null;
  } else if (postData === null) {
    userId = getData.id;
  } else {
    userId = postData.id;
  }

  console.log(userId);

  const navigate = useNavigate();

  const [allOffers, setAllOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPageC, setCurrentPageC] = useState(1);

  useEffect(() => {
    const fetchAllOffers = async () => {
      try {
        const data = await callApi('/auctions/offers');

        setAllOffers(data);
        console.log('allOffers: ', data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setLoading(false);
      }
    };
    fetchAllOffers();
  }, []);

  const totalPagesC =
    allOffers.length === 0 ? 1 : Math.ceil(allOffers.length / stocksPerPage);
  const handlePageChangeC = (newPage) => {
    setCurrentPageC(newPage);
  };

  const startIndexC = (currentPageC - 1) * stocksPerPage;
  const endIndexC = startIndexC + stocksPerPage;
  const currentAllOffers = allOffers.slice(startIndexC, endIndexC);

  const isAdmin = postData ? postData.role === 'ADMIN' : getData ? getData.role === 'ADMIN' : false;



  const handleSelectedGroupOffer = (id) => {
    console.log(id)
    navigate(`/admin/make-proposal/${id}`);
 };

  const goBack = () => {
    navigate(`/`);
  };

  return (
    <div className="content">
      {isAdmin ? (
        <div>
          <h2>Currently Auctioning Owned Stocks</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <table className="table">
                <caption>
                  <div className="tablecaptionspace">
                    <div className="pagination">
                      <button
                        onClick={() => handlePageChangeC(currentPageC - 1)}
                        disabled={currentPageC === 1}
                      >
                        ❮
                      </button>
                      <span>
                        {currentPageC} of {totalPagesC} pages
                      </span>
                      <button
                        onClick={() => handlePageChangeC(currentPageC + 1)}
                        disabled={currentPageC === totalPagesC}
                      >
                        ❯
                      </button>
                    </div>
                  </div>
                </caption>

                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Symbol</th>
                    <th>GroupId</th>
                    <th>Quantity</th>
                    <th>Type</th>
                  </tr>
                </thead>

                <tbody>
                  {currentAllOffers.map((offer) => (
                    <tr key={offer.id} className="company-item">
                      <td>{offer.id}</td>
                      <td>{offer.stockId}</td>
                      <td>{offer.groupId}</td>
                      <td>{offer.quantity}</td>
                      <td>{offer.type}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() =>  handleSelectedGroupOffer(offer.id)}
                        >
                          Make a Proposal
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="goback">
            <button onClick={() => goBack()}>Go back</button>
          </div>
        </div>
      ) : (
        <div>
          <ErrorUserAccessAuctions />
        </div>
      )}
    </div>
  );
};

export default AllOffers;

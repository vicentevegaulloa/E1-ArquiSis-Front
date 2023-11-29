import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import callApi from '../../fetchData';
import './Auctions.css';
import ErrorUserAccessAuctions from './ErrorUserAccessAuctions';

const stocksPerPage = 10;

const OwnOffersProposals = () => {
  const [postData, setPostData] = useState(null);
  const [getData, setGetData] = useState(null);
  const [message, setMessage] = useState(null);


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

  const { id } = useParams();

  useEffect(() => {
    fetchOfferProposals(id);
  }, [id]);

  const navigate = useNavigate();

  const [offerProposals, setOfferProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPageC, setCurrentPageC] = useState(1);

  const fetchOfferProposals = async (id) => {
    try {
      const data = await callApi(`/auctions/proposals/${id}`);
      setOfferProposals(data);
      console.log('offerProposals ', data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setIsLoading(false);
    }
  };

  const totalPagesC =
    offerProposals.length === 0 ? 1 : Math.ceil(offerProposals.length / stocksPerPage);

  const handlePageChangeC = (newPage) => {
    setCurrentPageC(newPage);
  };

  const startIndexC = (currentPageC - 1) * stocksPerPage;
  const endIndexC = startIndexC + stocksPerPage;
  const currentOfferProposals = offerProposals.slice(startIndexC, endIndexC);

  const isAdmin = postData ? postData.role === 'ADMIN' : getData ? getData.role === 'ADMIN' : false;

  const handleProposalAcceptance = async (id) => {
    const proposalData = {
      type: 'acceptance',
    };
    try {
      await callApi(`/auctions/proposals/${id}`, 'PUT', true, proposalData);
      setMessage('Proposal accepted successfully!');
    } catch (error) {
      console.error('Failed to accept proposal:', error);
      setMessage('Failed to accept proposal');
    }
  };

  const handleProposalRejection = async (id) => {
    const proposalData = {
      type: 'rejection',
    };
    try {
      await callApi(`/auctions/proposals/${id}`, 'PUT', true, proposalData);
      setMessage('Proposal rejected successfully!');
    } catch (error) {
      console.error('Failed to reject proposal:', error);
      setMessage('Failed to reject proposal');
    }
  };

  const goBack = () => {
    navigate(`/admin/own-offers`);
  };

  return (
    <div className="content">
      {isAdmin ? (
        <div>
          <h2>Active Proposals</h2>

          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div>
              {message && <p className="message">{message}</p>}

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
                    <th>Symbol</th>
                    <th>GroupId</th>
                    <th>Quantity</th>
                    <th>Type</th>
                    <th>OfferId</th>
                  </tr>
                </thead>

                <tbody>
                  {currentOfferProposals.map((proposal) => (
                    <tr key={proposal.id} className="company-item">
                      <td>{proposal.stockId}</td>
                      <td>{proposal.groupId}</td>
                      <td>{proposal.quantity}</td>
                      <td>{proposal.type}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button onClick={() => handleProposalAcceptance(proposal.id)}>
                          Accept
                        </button>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button onClick={() => handleProposalRejection(proposal.id)}>
                          Reject
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

export default OwnOffersProposals;

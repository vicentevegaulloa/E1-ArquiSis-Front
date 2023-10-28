import React from 'react';
import { useNavigate } from 'react-router-dom';

const WorkerNotConnected = () => {
  const navigate = useNavigate();

  const goBack = () => {
    /*navigate(`/company/${symbol}`); !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */ 
    navigate(`/`);
  };

  return(
    <div>  
      <div className='not-connected'>
        <p>Worker not connected D: </p>
      </div>
      <div className='goback'>
        <button onClick={() => goBack()}>Go back</button>
      </div>
    </div>
  );
};

export default WorkerNotConnected;
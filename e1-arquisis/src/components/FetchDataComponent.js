import { useAuth0 } from '@auth0/auth0-react';

const FetchDataComponent = ({ url }) => {
  const { getAccessTokenSilently } = useAuth0();

  const fetchData = async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: 'https://9q2asixgxa.execute-api.us-east-1.amazonaws.com/test',
        scope: 'read:all'
      });
      console.log(token);
      const response = await fetch(`https://9q2asixgxa.execute-api.us-east-1.amazonaws.com/test/${url}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
};

export default FetchDataComponent;

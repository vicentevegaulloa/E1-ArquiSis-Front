import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.render(
  <Auth0Provider
    domain="dev-04e5krhlvwybtkve.us.auth0.com"
    clientId="ucaHqLU9lljCJpDG8YzidHQr3utZdHNN"
    redirectUri={window.location.origin}
    audience="https://9q2asixgxa.execute-api.us-east-1.amazonaws.com/test"
    useRefreshTokens={true}
    cacheLocation="localstorage"
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);

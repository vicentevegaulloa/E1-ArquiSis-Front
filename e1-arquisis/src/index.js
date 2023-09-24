import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import App from "./App";
import CustomSignIn from "./pages/Landingpage/SignIn";
import { Authenticator } from "@aws-amplify/ui-react";

// Configure custom authentication components
const authConfig = {
    // Configure your custom sign-in component
    signIn: CustomSignIn,
    // ... other custom components if needed ...
  };

ReactDOM.render(
  <Authenticator {...authConfig}>
    <BrowserRouter>
        <App/>
    </BrowserRouter>
  </Authenticator>,
  document.getElementById('root')
);

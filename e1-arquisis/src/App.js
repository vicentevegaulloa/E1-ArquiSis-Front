import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import FetchDataComponent from "./components/FetchDataComponent";
import CompanyList from "./pages/CompanyList/CompanyList";
import awsExports from "./aws-exports"; // This path might vary depending on where the file is located

import '@aws-amplify/ui-react/styles.css'

Amplify.configure(awsExports);

const HomePage = ({signOut, user}) => (
  <div>
    {console.log(user)}
    <h1>Welcome Home {user.email}</h1>
    <button onClick={() => signOut()}>Sign out</button>
  </div>
);

const App = ({ signOut, user }) => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage user={user} signOut={signOut}/>} />
        <Route
          path="/data"
          element={<FetchDataComponent/>}
        />
        <Route path="/stocks" element={<CompanyList />} />
      </Routes>
    </Router>
  );
};

export default withAuthenticator(App);

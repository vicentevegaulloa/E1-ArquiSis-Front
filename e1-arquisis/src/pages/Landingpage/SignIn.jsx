// CustomSignIn.js
import React, { useState } from "react";
import { Auth } from "aws-amplify";

const CustomSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    try {
      await Auth.signIn(email, password);
      // Handle successful sign-in
    } catch (error) {
      // Handle sign-in error
      console.error("Sign-in error", error);
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signIn}>Sign In</button>
    </div>
  );
};

export default CustomSignIn;

import React, { useState } from "react";
import { forgotPassword } from "../auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    forgotPassword(email).then((data) => {
      if (data.error) {
        console.log(data.error);
        setError(data.error);
      } else {
        console.log(data.message);
        setMessage(data.message);
      }
    });
  };

  return (
    <div className="container">
      <h2 className="mt-5 mb-5">Ask for Password Reset</h2>

      {message && <h4 className="bg-success">{message}</h4>}
      {error && <h4 className="bg-warning">{error}</h4>}

      <form>
        <div className="form-group mt-5">
          <input
            type="email"
            className="form-control"
            placeholder="Your email address"
            value={email}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
        </div>
        <button
          onClick={handleForgotPassword}
          className="btn btn-raised btn-primary"
        >
          Send Password Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;

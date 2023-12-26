import React, { useState } from "react";
import { resetPassword } from "../auth";

const ResetPassword = (props) => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    resetPassword({
      newPassword,
      resetPasswordLink: props.match.params.resetPasswordToken,
    }).then((data) => {
      if (data.error) {
        console.log(data.error);
        setError(data.error);
        setNewPassword("");
      } else {
        console.log(data.message);
        setMessage(data.message);
        setNewPassword("");
      }
    });
  };

  return (
    <div className="container">
      <h2 className="mt-5 mb-5">Reset your Password</h2>

      {message && <h4 className="bg-success">{message}</h4>}
      {error && <h4 className="bg-warning">{error}</h4>}

      <form style={{ display: message.length ? "none" : "" }}>
        <div className="form-group mt-5">
          <input
            type="password"
            className="form-control"
            placeholder="Your new password"
            value={newPassword}
            name="newPassword"
            onChange={(e) => setNewPassword(e.target.value)}
            autoFocus
          />
        </div>
        <button
          onClick={handleResetPassword}
          className="btn btn-raised btn-primary"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;

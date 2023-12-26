import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { signin, authenticate } from "../auth";
import SocialLogin from "./SocialLogin";

const Signin = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
    error: "",
    redirectToReferer: false,
    loading: false,
    recaptcha: false,
  });

  const handleChange = (name) => (event) => {
    setState({ ...state, error: "" });
    setState({ ...state, [name]: event.target.value });
  };

  const recaptchaHandler = (e) => {
    setState({ ...state, error: "" });
    let userDay = e.target.value.toLowerCase();
    let dayCount;

    if (userDay === "sunday") {
      dayCount = 0;
    } else if (userDay === "monday") {
      dayCount = 1;
    } else if (userDay === "tuesday") {
      dayCount = 2;
    } else if (userDay === "wednesday") {
      dayCount = 3;
    } else if (userDay === "thursday") {
      dayCount = 4;
    } else if (userDay === "friday") {
      dayCount = 5;
    } else if (userDay === "saturday") {
      dayCount = 6;
    }

    if (dayCount === new Date().getDay()) {
      setState({ ...state, recaptcha: true });
      return true;
    } else {
      setState({
        ...state,
        recaptcha: false,
      });
      return false;
    }
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setState({ ...state, loading: true });
    const { email, password, recaptcha } = state;
    const user = {
      email,
      password,
    };

    if (recaptcha) {
      signin(user)
        .then((data) => {
          if (data.error) {
            setState({ ...state, error: data.error, loading: false });
          } else {
            authenticate(data, () => {
              setState({ ...state, redirectToReferer: true });
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setState({
            ...state,
            loading: false,
            error: "Invalid email or password",
          });
        });
    } else {
      setState({
        ...state,
        loading: false,
        error: "What day is today? Please write a correct answer!",
      });
    }
  };

  const signinForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          value={state.email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange("password")}
          type="password"
          className="form-control"
          value={state.password}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">
          {state.recaptcha ? "Thanks. You got it!" : "What day is today?"}
        </label>

        <input
          onChange={recaptchaHandler}
          type="text"
          className="form-control"
        />
      </div>

      <button onClick={clickSubmit} className="btn btn-raised btn-primary">
        Submit
      </button>
    </form>
  );

  const { email, password, error, redirectToReferer, loading, recaptcha } =
    state;

  if (redirectToReferer) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container">
      <h2 className="mt-5 mb-5">SignIn</h2>
      <hr />
      <SocialLogin />

      <hr />
      <br />

      <div
        className="alert alert-danger"
        style={{ display: error ? "" : "none" }}
      >
        {error}
      </div>

      {loading ? (
        <div className="jumbotron text-center">
          <h2>Loading...</h2>
        </div>
      ) : (
        ""
      )}

      {signinForm()}

      <p>
        <Link to="/forgot-password" className="btn btn-raised btn-danger">
          {" "}
          Forgot Password
        </Link>
      </p>
    </div>
  );
};

export default Signin;

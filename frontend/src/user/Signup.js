import React, { useState } from "react";
import { signup } from "../auth";
import { Link } from "react-router-dom";
import SocialLogin from "./SocialLogin";

const Signup = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    open: false,
    recaptcha: false,
    birthday: "",
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
    const { name, email, password, birthday } = state;
    const user = {
      name,
      email,
      password,
      birthday,
    };

    if (state.recaptcha) {
      signup(user).then((data) => {
        if (data.error) setState({ ...state, error: data.error });
        else
          setState({
            ...state,
            error: "",
            name: "",
            email: "",
            password: "",
            birthday: "",
            open: true,
          });
      });
    } else {
      setState({
        ...state,
        error: "What day is today? Please write a correct answer!",
      });
    }
  };

  const signupForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          value={state.name}
        />
      </div>
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
        <label className="text-muted">Birthday</label>
        <input
          onChange={handleChange("birthday")}
          type="date"
          className="form-control"
          value={state.birthday}
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

  return (
    <div className="container">
      <h2 className="mt-5 mb-5">Signup</h2>

      <hr />
      <SocialLogin />

      <hr />
      <br />

      <div
        className="alert alert-danger"
        style={{ display: state.error ? "" : "none" }}
      >
        {state.error}
      </div>

      <div
        className="alert alert-info"
        style={{ display: state.open ? "" : "none" }}
      >
        New account is successfully created. Please{" "}
        <Link to="/signin">Sign In</Link>.
      </div>

      {signupForm()}
    </div>
  );
};

export default Signup;

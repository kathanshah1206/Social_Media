import axios from "axios";

export const signup = (user) => {
  return axios
    .post(`http://localhost:8080/api/signup`, user)
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const signin = (user) => {
  return axios
    .post(`http://localhost:8080/api/signin`, user)
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const authenticate = (jwt, next) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(jwt));
    next();
  }
};

export const setName = (name, next) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("username", JSON.stringify(name));
    next();
  }
};

export const signout = (next) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
    next();
    return axios
      .get(`http://localhost:8080/api/signout`)
      .then((response) => response.data)
      .catch((err) => console.log(err));
  }
};

export const isAuthenticated = () => {
  if (typeof window === "undefined") {
    return false;
  }

  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};

export const forgotPassword = (email) => {
  console.log("email: ", email);
  return axios
    .put(`http://localhost:8080/api/forgot-password/`, { email })
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const resetPassword = (resetInfo) => {
  return axios
    .put(`http://localhost:8080/api/reset-password/`, resetInfo)
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const socialLogin = (user) => {
  return axios
    .post(`http://localhost:8080/api/social-login/`, user)
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

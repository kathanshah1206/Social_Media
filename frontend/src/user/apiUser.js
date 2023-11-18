import axios from "axios";

export const read = (userId, token) => {
  return axios
    .get(`http://localhost:8080/api/user/${userId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.log(err));
};

export const update = (userId, token, user) => {
  console.log("USER DATA UPDATE: ", user);
  return axios
    .put(`http://localhost:8080/api/user/${userId}`, user, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.log(err));
};

export const remove = (userId, token) => {
  return axios
    .delete(`http://localhost:8080/api/user/${userId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.log(err));
};

export const list = () => {
  return axios
    .get(`http://localhost:8080/api/users`)
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.log(err));
};

export const updateUser = (user, next) => {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("jwt")) {
      let auth = JSON.parse(localStorage.getItem("jwt"));
      auth.user = user;
      localStorage.setItem("jwt", JSON.stringify(auth));
      next();
    }
  }
};

export const follow = (userId, token, followId) => {
  return axios
    .put(
      `http://localhost:8080/api/user/follow`,
      { userId, followId },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.log(err));
};

export const unfollow = (userId, token, unfollowId) => {
  return axios
    .put(
      `http://localhost:8080/api/user/unfollow`,
      { userId, unfollowId },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.log(err));
};

export const findPeople = (userId, token) => {
  return axios
    .get(`http://localhost:8080/api/user/findpeople/${userId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.log(err));
};

import axios from "axios";

export const create = (userId, token, post) => {
  return axios
    .post(`http://localhost:8080/api/post/new/${userId}`, post, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const list = (page) => {
  return axios
    .get(`http://localhost:8080/api/posts/?page=${page}`)
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const singlePost = (postId) => {
  return axios
    .get(`http://localhost:8080/api/post/${postId}`)
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const listByUser = (userId, token) => {
  return axios
    .get(`http://localhost:8080/api/posts/by/${userId}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const remove = (postId, token) => {
  return axios
    .delete(`http://localhost:8080/api/post/${postId}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const update = (postId, token, post) => {
  return axios
    .put(`http://localhost:8080/api/post/${postId}`, post, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const like = (userId, token, postId) => {
  return axios
    .put(
      `http://localhost:8080/api/post/like`,
      { userId, postId },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const unlike = (userId, token, postId) => {
  return axios
    .put(
      `http://localhost:8080/api/post/unlike`,
      { userId, postId },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const comment = (userId, token, postId, comment) => {
  return axios
    .put(
      `http://localhost:8080/api/post/comment`,
      { userId, postId, comment },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const uncomment = (userId, token, postId, comment) => {
  return axios
    .put(
      `http://localhost:8080/api/post/uncomment`,
      { userId, postId, comment },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

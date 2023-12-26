import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth";
import { read, update, updateUser } from "./apiUser";
import { Redirect } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";

const EditProfile = ({ match }) => {
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    redirectToProfile: false,
    error: "",
    fileSize: 0,
    loading: false,
    about: "",
  });

  const {
    id,
    name,
    email,
    password,
    redirectToProfile,
    error,
    fileSize,
    loading,
    about,
  } = userData;

  const init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token).then((data) => {
      if (data.error) {
        setUserData({ ...userData, redirectToProfile: true });
      } else {
        setUserData({
          ...userData,
          id: data._id,
          name: data.name,
          email: data.email,
          error: "",
          about: data.about,
        });
      }
    });
  };

  useEffect(() => {
    const userId = match.params.userId;
    init(userId);
  }, [match.params.userId]);

  const isValid = () => {
    if (fileSize > 1000000) {
      setUserData({
        ...userData,
        error: "File size should be less than 100kb",
        loading: false,
      });
      return false;
    }
    if (name.length === 0) {
      setUserData({ ...userData, error: "Name is required", loading: false });
      return false;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setUserData({
        ...userData,
        error: "A valid Email is required",
        loading: false,
      });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      setUserData({
        ...userData,
        error: "Password must be at least 6 characters long",
        loading: false,
      });
      return false;
    }
    return true;
  };

  const handleChange = (name) => (event) => {
    setUserData({ ...userData, error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;

    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    setUserData({ ...userData, [name]: value, fileSize });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setUserData({ ...userData, loading: true });

    if (isValid()) {
      const userId = match.params.userId;
      const token = isAuthenticated().token;

      update(userId, token, userData).then((data) => {
        if (data.error) {
          setUserData({ ...userData, error: data.error });
        } else if (isAuthenticated().user.role === "admin") {
          setUserData({
            ...userData,
            redirectToProfile: true,
          });
        } else {
          updateUser(data, () => {
            setUserData({
              ...userData,
              redirectToProfile: true,
            });
          });
        }
      });
    }
  };

  const signupForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Profile Photo</label>
        <input
          onChange={handleChange("photo")}
          type="file"
          accept="image/*"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          value={name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          value={email}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">About</label>
        <textarea
          onChange={handleChange("about")}
          type="text"
          className="form-control"
          value={about}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange("password")}
          type="password"
          className="form-control"
          value={password}
        />
      </div>
      <button onClick={clickSubmit} className="btn btn-raised btn-primary">
        Update
      </button>
    </form>
  );

  if (redirectToProfile) {
    return <Redirect to={`/user/${id}`} />;
  }

  const photoUrl = id
    ? `http://localhost:8080/api/user/photo/${id}?${new Date().getTime()}`
    : DefaultProfile;

  return (
    <div className="container">
      <h2 className="mt-5 mb-5">Edit Profile</h2>
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

      <img
        style={{ height: "200px", width: "auto" }}
        className="img-thumbnail"
        src={photoUrl}
        onError={(i) => (i.target.src = `${DefaultProfile}`)}
        alt={name}
      />

      {isAuthenticated().user.role === "admin" && signupForm()}

      {isAuthenticated().user._id === id && signupForm()}
    </div>
  );
};

export default EditProfile;
